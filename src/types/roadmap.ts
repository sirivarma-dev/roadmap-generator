// Core domain types for the roadmap generator.

export type LearningSpeed =
  | 'Very Slow'
  | 'Slow'
  | 'Average'
  | 'Above Average'
  | 'Fast';

export type DailyStudyTime = '1 Hour' | '2 Hours' | '3 Hours' | '4 Hours' | '5+ Hours';

export type KnowledgeLevel = 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced';

export type LearningGoal =
  | 'Interview Preparation'
  | 'College'
  | 'Job Preparation'
  | 'Skill Development'
  | 'General Knowledge'
  | 'Career Switch';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type InterviewImportance = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RoadmapInput {
  subject: string;
  speed: LearningSpeed;
  dailyHours: DailyStudyTime;
  knowledge: KnowledgeLevel;
  goal: LearningGoal;
}

export interface Topic {
  id: string;
  name: string;
  /** Estimated effort in ideal focused hours, before pace adjustment. */
  baseHours: number;
  /** Calendar days computed from the learner's pace. */
  estimatedDays: number;
  difficulty: Difficulty;
  prerequisites: string[];
  subtopics: string[];
  learningObjective: string;
  interviewImportance: InterviewImportance;
  interviewConcepts: string[];
  commonMistakes: string[];
  /** Optional curated explainer video. When absent, the UI links to a
   *  beginner-friendly YouTube search for the topic instead. */
  videoUrl?: string;
}

export interface Phase {
  id: string;
  name: string;
  objective: string;
  estimatedDays: number;
  difficulty: Difficulty;
  prerequisites: string[];
  learningOutcomes: string[];
  interviewConcepts: string[];
  commonBeginnerMistakes: string[];
  topics: Topic[];
}

export interface ScheduleWeek {
  weekNumber: number;
  focus: string;
  topics: string[];
  hours: number;
}

export interface ScheduleMonth {
  monthNumber: number;
  focus: string;
  weeks: number[];
}

export interface Schedule {
  dailyHours: number;
  studyDaysPerWeek: number;
  daily: string;
  weeks: ScheduleWeek[];
  months: ScheduleMonth[];
}

export interface RevisionPlan {
  daily: string[];
  weekly: string[];
  monthly: string[];
  highPriorityTopics: string[];
}

export interface Roadmap {
  id: string;
  input: RoadmapInput;
  createdAt: number;
  subjectLabel: string;
  summary: string;
  totalDays: number;
  totalHours: number;
  totalTopics: number;
  phases: Phase[];
  schedule: Schedule;
  revision: RevisionPlan;
}
