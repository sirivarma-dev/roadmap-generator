// The roadmap generation engine.
//
// Pure, deterministic, dependency-aware. Given a RoadmapInput it produces a
// fully personalized Roadmap: topics in dependency order, grouped into phases,
// with realistic time estimates, a schedule, and a revision plan.

import type {
  DailyStudyTime,
  Difficulty,
  KnowledgeLevel,
  LearningSpeed,
  Phase,
  Roadmap,
  RoadmapInput,
  Schedule,
  ScheduleMonth,
  ScheduleWeek,
  RevisionPlan,
  Topic,
} from '../types/roadmap';
import {
  CURRICULA,
  PROGRAMMING_CURRICULUM,
  type Curriculum,
  type TopicBlueprint,
} from './curricula';

// Speed multiplier: higher means slower learner needs more calendar time.
const SPEED_FACTOR: Record<LearningSpeed, number> = {
  'Very Slow': 1.6,
  Slow: 1.3,
  Average: 1.0,
  'Above Average': 0.82,
  Fast: 0.68,
};

const HOURS_PER_DAY: Record<DailyStudyTime, number> = {
  '1 Hour': 1,
  '2 Hours': 2,
  '3 Hours': 3,
  '4 Hours': 4,
  '5+ Hours': 5,
};

// A learner's current knowledge lets us skip earlier levels.
const SKIP_LEVELS: Record<KnowledgeLevel, TopicBlueprint['level'][]> = {
  Beginner: [],
  Basic: ['foundation'],
  Intermediate: ['foundation', 'core'],
  Advanced: ['foundation', 'core', 'intermediate'],
};

const DIFFICULTY_ORDER: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Match the user's free-text subject to a curriculum. */
export function resolveCurriculum(subjectRaw: string): {
  curriculum: Curriculum;
  langLabel: string;
} {
  const subject = subjectRaw.trim().toLowerCase();

  for (const c of CURRICULA) {
    if (c.aliases.some((a) => subject === a || subject.includes(a))) {
      return { curriculum: c, langLabel: c.label };
    }
  }

  // Otherwise treat it as a programming language / generic technical skill and
  // interpolate the subject name into the programming template.
  const langLabel = titleCase(subjectRaw.trim() || 'This Skill');
  const curriculum: Curriculum = {
    ...PROGRAMMING_CURRICULUM,
    label: langLabel,
    destination: PROGRAMMING_CURRICULUM.destination.replace(/\{lang\}/g, langLabel),
    topics: PROGRAMMING_CURRICULUM.topics.map((t) => interpolateTopic(t, langLabel)),
  };
  return { curriculum, langLabel };
}

function interpolateTopic(t: TopicBlueprint, lang: string): TopicBlueprint {
  const swap = (s: string) => s.replace(/\{lang\}/g, lang);
  return {
    ...t,
    name: swap(t.name),
    subtopics: t.subtopics.map(swap),
    learningObjective: swap(t.learningObjective),
    interviewConcepts: t.interviewConcepts.map(swap),
    commonMistakes: t.commonMistakes.map(swap),
  };
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1));
}

// Goal changes how much interview-focused weight the roadmap carries.
function goalHourAdjustment(topic: TopicBlueprint, goal: RoadmapInput['goal']): number {
  const isInterviewGoal = goal === 'Interview Preparation' || goal === 'Job Preparation' || goal === 'Career Switch';
  if (isInterviewGoal && (topic.interviewImportance === 'Critical' || topic.interviewImportance === 'High')) {
    // Spend a bit more time on high-yield interview topics.
    return 1.15;
  }
  if (goal === 'General Knowledge' && topic.level === 'professional') {
    // Lighter touch on deep professional topics for general learners.
    return 0.85;
  }
  return 1;
}

const PHASE_META: Record<
  TopicBlueprint['level'],
  { name: string; objective: string }
> = {
  foundation: {
    name: 'Foundations',
    objective: 'Establish the absolute basics you will build everything else on.',
  },
  core: {
    name: 'Core Concepts',
    objective: 'Master the day-to-day building blocks used in every real project.',
  },
  intermediate: {
    name: 'Intermediate Depth',
    objective: 'Move from writing code that works to writing code that scales.',
  },
  advanced: {
    name: 'Advanced Topics',
    objective: 'Tackle the hard, high-signal areas that separate strong engineers.',
  },
  professional: {
    name: 'Professional Mastery',
    objective: 'Polish toward production-grade, interview-ready expertise.',
  },
};

const LEVEL_ORDER: TopicBlueprint['level'][] = [
  'foundation',
  'core',
  'intermediate',
  'advanced',
  'professional',
];

export function generateRoadmap(input: RoadmapInput): Roadmap {
  const { curriculum, langLabel } = resolveCurriculum(input.subject);
  const hoursPerDay = HOURS_PER_DAY[input.dailyHours];
  const speedFactor = SPEED_FACTOR[input.speed];
  const skip = SKIP_LEVELS[input.knowledge];

  // Filter blueprints by knowledge level; always keep at least the last 3
  // levels so an "Advanced" learner still gets a substantive roadmap.
  let selected = curriculum.topics.filter((t) => !skip.includes(t.level));
  if (selected.length < 4) {
    selected = curriculum.topics.slice(-Math.max(4, curriculum.topics.length - 2));
  }

  // Convert blueprints into full Topic objects with pace-adjusted timing.
  const topics: Topic[] = selected.map((bp) => {
    const goalAdj = goalHourAdjustment(bp, input.goal);
    const effectiveHours = bp.baseHours * goalAdj;
    // Calendar days = focused hours * speed factor / hours studied per day.
    const days = Math.max(1, Math.round((effectiveHours * speedFactor) / hoursPerDay));
    return {
      id: slugify(bp.name),
      name: bp.name,
      baseHours: Math.round(effectiveHours),
      estimatedDays: days,
      difficulty: bp.difficulty,
      prerequisites: bp.prerequisites,
      subtopics: bp.subtopics,
      learningObjective: bp.learningObjective,
      interviewImportance: bp.interviewImportance,
      interviewConcepts: bp.interviewConcepts,
      commonMistakes: bp.commonMistakes,
      videoUrl: bp.videoUrl,
    };
  });

  // Group into phases by level, preserving dependency order.
  const phases: Phase[] = [];
  for (const level of LEVEL_ORDER) {
    // Map each topic back to its blueprint to read its level.
    const membership = topics.filter((t) => {
      const bp = selected.find((s) => slugify(s.name) === t.id);
      return bp?.level === level;
    });
    if (membership.length === 0) continue;

    const meta = PHASE_META[level];
    const phaseDays = membership.reduce((sum, t) => sum + t.estimatedDays, 0);
    const difficulty = hardestDifficulty(membership);
    const prereqTopics = membership
      .flatMap((t) => t.prerequisites)
      .filter((p) => !membership.some((m) => m.name === p));

    phases.push({
      id: `phase-${slugify(level)}`,
      name: `${meta.name}`,
      objective: meta.objective,
      estimatedDays: phaseDays,
      difficulty,
      prerequisites: unique(prereqTopics),
      learningOutcomes: membership.map((t) => t.learningObjective),
      interviewConcepts: unique(membership.flatMap((t) => t.interviewConcepts)).slice(0, 8),
      commonBeginnerMistakes: unique(membership.flatMap((t) => t.commonMistakes)).slice(0, 6),
      topics: membership,
    });
  }

  const totalDays = phases.reduce((sum, p) => sum + p.estimatedDays, 0);
  const totalHours = topics.reduce((sum, t) => sum + t.baseHours, 0);
  const totalTopics = topics.length;

  const schedule = buildSchedule(phases, hoursPerDay, input.speed);
  const revision = buildRevision(topics);

  const destination = curriculum.destination.replace(/\{lang\}/g, langLabel);
  const summary = buildSummary(input, destination, totalDays, totalTopics);

  return {
    id: `${slugify(langLabel)}-${Date.now()}`,
    input,
    createdAt: Date.now(),
    subjectLabel: langLabel,
    summary,
    totalDays,
    totalHours,
    totalTopics,
    phases,
    schedule,
    revision,
  };
}

function hardestDifficulty(topics: Topic[]): Difficulty {
  let idx = 0;
  for (const t of topics) {
    idx = Math.max(idx, DIFFICULTY_ORDER.indexOf(t.difficulty));
  }
  return DIFFICULTY_ORDER[idx];
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function studyDaysPerWeek(speed: LearningSpeed): number {
  switch (speed) {
    case 'Very Slow':
      return 4;
    case 'Slow':
      return 5;
    case 'Average':
      return 5;
    case 'Above Average':
      return 6;
    case 'Fast':
      return 6;
  }
}

function buildSchedule(
  phases: Phase[],
  hoursPerDay: number,
  speed: LearningSpeed,
): Schedule {
  const daysPerWeek = studyDaysPerWeek(speed);

  // Flatten topics in order and slice them into weeks of `daysPerWeek` study days.
  const orderedTopics = phases.flatMap((p) =>
    p.topics.map((t) => ({ phase: p.name, topic: t })),
  );

  const weeks: ScheduleWeek[] = [];
  let weekNumber = 1;
  let dayBudget = daysPerWeek;
  let currentTopics: string[] = [];
  let currentFocusPhase = orderedTopics[0]?.phase ?? 'Study';

  const pushWeek = () => {
    if (currentTopics.length === 0) return;
    weeks.push({
      weekNumber,
      focus: currentFocusPhase,
      topics: [...currentTopics],
      hours: daysPerWeek * hoursPerDay,
    });
    weekNumber += 1;
    dayBudget = daysPerWeek;
    currentTopics = [];
  };

  for (const { phase, topic } of orderedTopics) {
    let remaining = topic.estimatedDays;
    if (currentTopics.length === 0) currentFocusPhase = phase;
    while (remaining > 0) {
      if (!currentTopics.includes(topic.name)) currentTopics.push(topic.name);
      const consume = Math.min(remaining, dayBudget);
      remaining -= consume;
      dayBudget -= consume;
      if (dayBudget <= 0) {
        pushWeek();
        if (remaining > 0) currentFocusPhase = phase;
      }
    }
  }
  pushWeek();

  // Group weeks into months (4 weeks each).
  const months: ScheduleMonth[] = [];
  for (let i = 0; i < weeks.length; i += 4) {
    const chunk = weeks.slice(i, i + 4);
    const focusPhases = unique(chunk.map((w) => w.focus));
    months.push({
      monthNumber: months.length + 1,
      focus: focusPhases.join(' → '),
      weeks: chunk.map((w) => w.weekNumber),
    });
  }

  const daily = `Study ${hoursPerDay} hour${hoursPerDay > 1 ? 's' : ''} per day, ${daysPerWeek} days a week. Spend the first few minutes reviewing yesterday's notes, then focus on one subtopic at a time until you can explain it out loud without looking.`;

  return { dailyHours: hoursPerDay, studyDaysPerWeek: daysPerWeek, daily, weeks, months };
}

function buildRevision(topics: Topic[]): RevisionPlan {
  const highPriority = topics
    .filter((t) => t.interviewImportance === 'Critical' || t.interviewImportance === 'High')
    .map((t) => t.name);

  return {
    daily: [
      'Re-read the notes you wrote today and summarize each subtopic in one sentence.',
      'Explain the single hardest concept from today aloud, as if teaching someone.',
      'List any subtopic you could not explain and flag it for tomorrow.',
    ],
    weekly: [
      'Revisit every topic touched this week and rewrite its learning objective from memory.',
      'Review all bookmarked topics and confirm you still understand them.',
      'Do a self-quiz on the week\u2019s interview concepts without notes.',
    ],
    monthly: [
      'Walk the full roadmap so far and mark topics that feel shaky.',
      'Re-study the shaky topics before moving to the next phase.',
      'Consolidate your notes into a single interview cheat-sheet.',
    ],
    highPriorityTopics: highPriority,
  };
}

function buildSummary(
  input: RoadmapInput,
  destination: string,
  totalDays: number,
  totalTopics: number,
): string {
  const weeks = Math.max(1, Math.round(totalDays / 5));
  return `A ${totalDays}-day path (about ${weeks} weeks) through ${totalTopics} topics, taking you from ${input.knowledge.toLowerCase()} level toward ${destination}. Personalized for a ${input.speed.toLowerCase()} pace at ${input.dailyHours.toLowerCase()} a day, optimized for ${input.goal.toLowerCase()}.`;
}
