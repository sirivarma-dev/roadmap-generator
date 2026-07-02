// Pure helpers for study progress and the daily study log.
// Kept free of store/UI imports so both can depend on it without cycles.

import type { Roadmap } from '../types/roadmap';

/** Stable key for a subtopic's completion state. */
export function subtopicKey(topicId: string, subtopic: string): string {
  return `${topicId}::${subtopic}`;
}

/** Local calendar date as 'YYYY-MM-DD' (used to bucket daily activity). */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface RoadmapProgress {
  totalSubtopics: number;
  doneSubtopics: number;
  totalTopics: number;
  doneTopics: number;
  /** Overall completion percent, by subtopics (0–100). */
  pct: number;
}

/** Roll up how much of a roadmap is complete from the set of done subtopics. */
export function computeProgress(
  roadmap: Roadmap,
  completed: Record<string, number>,
): RoadmapProgress {
  let totalSubtopics = 0;
  let doneSubtopics = 0;
  let totalTopics = 0;
  let doneTopics = 0;

  for (const phase of roadmap.phases) {
    for (const t of phase.topics) {
      totalTopics += 1;
      const subs = t.subtopics;
      totalSubtopics += subs.length;
      let done = 0;
      for (const s of subs) if (completed[subtopicKey(t.id, s)]) done += 1;
      doneSubtopics += done;
      if (subs.length > 0 && done === subs.length) doneTopics += 1;
    }
  }

  const pct = totalSubtopics ? Math.round((doneSubtopics / totalSubtopics) * 100) : 0;
  return { totalSubtopics, doneSubtopics, totalTopics, doneTopics, pct };
}

/** How many subtopics of a single topic are complete. */
export function topicDoneCount(
  topicId: string,
  subtopics: string[],
  completed: Record<string, number>,
): number {
  let n = 0;
  for (const s of subtopics) if (completed[subtopicKey(topicId, s)]) n += 1;
  return n;
}

export interface DayStat {
  date: string; // 'YYYY-MM-DD'
  minutes: number;
  subtopics: number; // subtopics completed that day
  topics: number; // topics that became fully complete that day
}

/**
 * Build a per-day activity series for the last `days` days (oldest → today):
 * study minutes logged, subtopics completed, and topics finished each day.
 */
export function computeDailyStats(
  roadmap: Roadmap | null,
  completed: Record<string, number>,
  studyMinutes: Record<string, number>,
  days = 7,
): DayStat[] {
  const subPerDay: Record<string, number> = {};
  for (const ts of Object.values(completed)) {
    const key = dayKey(new Date(ts));
    subPerDay[key] = (subPerDay[key] ?? 0) + 1;
  }

  const topPerDay: Record<string, number> = {};
  if (roadmap) {
    for (const phase of roadmap.phases) {
      for (const t of phase.topics) {
        const subs = t.subtopics;
        if (subs.length === 0) continue;
        let all = true;
        let lastTs = 0;
        for (const s of subs) {
          const ts = completed[subtopicKey(t.id, s)];
          if (!ts) { all = false; break; }
          if (ts > lastTs) lastTs = ts;
        }
        if (all) {
          const key = dayKey(new Date(lastTs));
          topPerDay[key] = (topPerDay[key] ?? 0) + 1;
        }
      }
    }
  }

  const out: DayStat[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = dayKey(d);
    out.push({
      date: key,
      minutes: studyMinutes[key] ?? 0,
      subtopics: subPerDay[key] ?? 0,
      topics: topPerDay[key] ?? 0,
    });
  }
  return out;
}

/** Count of consecutive days (ending today) with any study activity. */
export function computeStreak(
  completed: Record<string, number>,
  studyMinutes: Record<string, number>,
): number {
  const active = new Set<string>();
  for (const ts of Object.values(completed)) active.add(dayKey(new Date(ts)));
  for (const [k, m] of Object.entries(studyMinutes)) if (m > 0) active.add(k);

  let streak = 0;
  const now = new Date();
  for (let i = 0; ; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    if (active.has(dayKey(d))) streak += 1;
    else break;
  }
  return streak;
}
