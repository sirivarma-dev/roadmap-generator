import { useMemo } from 'react';
import type { Roadmap } from '../types/roadmap';
import { useStore } from '../store/useStore';
import { computeProgress, computeDailyStats, computeStreak, dayKey } from '../utils/progress';
import { CircleCheck, Flame, Clock } from './Icons';

const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ProgressPanel({ roadmap }: { roadmap: Roadmap }) {
  const completed = useStore((s) => s.completedSubtopics);
  const studyMinutes = useStore((s) => s.studyMinutes);
  const addStudyMinutes = useStore((s) => s.addStudyMinutes);

  const progress = useMemo(() => computeProgress(roadmap, completed), [roadmap, completed]);
  const days = useMemo(() => computeDailyStats(roadmap, completed, studyMinutes, 7), [roadmap, completed, studyMinutes]);
  const streak = useMemo(() => computeStreak(completed, studyMinutes), [completed, studyMinutes]);

  const today = days[days.length - 1];
  const maxMin = Math.max(30, ...days.map((d) => d.minutes));

  return (
    <div className="panel section-gap">
      <div className="panel__head">
        <h3><CircleCheck style={{ width: 16, height: 16, verticalAlign: -3, marginRight: 6, color: 'var(--accent)' }} />Study progress</h3>
        {streak > 0 && (
          <span className="streak-badge" title={`${streak}-day study streak`}>
            <Flame /> {streak}d
          </span>
        )}
      </div>
      <div className="panel__body">
        {/* Overall completion */}
        <div className="progress-head">
          <span className="progress-pct">{progress.pct}%</span>
          <span className="progress-frac">
            {progress.doneSubtopics}/{progress.totalSubtopics} subtopics · {progress.doneTopics}/{progress.totalTopics} topics
          </span>
        </div>
        <div className="progress-bar"><i style={{ width: `${progress.pct}%` }} /></div>

        {/* Today's study logging */}
        <div className="today-log">
          <div className="today-log__row">
            <span className="k"><Clock style={{ width: 14, height: 14, verticalAlign: -2 }} /> Studied today</span>
            <span className="v">{today.minutes} min</span>
          </div>
          <div className="quick-add">
            <span>Log time:</span>
            <button onClick={() => addStudyMinutes(15)}>+15m</button>
            <button onClick={() => addStudyMinutes(30)}>+30m</button>
            <button onClick={() => addStudyMinutes(60)}>+1h</button>
            {today.minutes > 0 && (
              <button className="quick-add__undo" onClick={() => addStudyMinutes(-15)} title="Remove 15 minutes">−15m</button>
            )}
          </div>
          <div className="today-counts">
            <span>{today.subtopics} subtopic{today.subtopics === 1 ? '' : 's'} done today</span>
            <span>{today.topics} topic{today.topics === 1 ? '' : 's'} finished today</span>
          </div>
        </div>

        {/* Last 7 days */}
        <div className="daily-history">
          <span className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Last 7 days</span>
          {days.map((d) => {
            const label = WEEKDAY[new Date(d.date + 'T00:00:00').getDay()];
            const isToday = d.date === dayKey();
            return (
              <div className={`day-row ${isToday ? 'is-today' : ''}`} key={d.date}>
                <span className="day-row__label">{isToday ? 'Today' : label}</span>
                <div className="day-row__bar">
                  <i style={{ width: `${Math.round((d.minutes / maxMin) * 100)}%` }} />
                </div>
                <span className="day-row__meta">
                  {d.minutes > 0 ? `${d.minutes}m` : '–'}
                  {d.subtopics > 0 && <em> · {d.subtopics}✓</em>}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
