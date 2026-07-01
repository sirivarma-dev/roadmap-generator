import { useMemo } from 'react';
import type { Roadmap } from '../types/roadmap';
import { useStore } from '../store/useStore';
import { BookmarkFilled, Note, Calendar, Refresh, Star } from './Icons';

interface Props {
  roadmap: Roadmap;
  onJumpToTopic: (topicId: string) => void;
}

export function Sidebar({ roadmap, onJumpToTopic }: Props) {
  const bookmarks = useStore((s) => s.bookmarks);
  const notes = useStore((s) => s.notes);

  const allTopics = useMemo(
    () => roadmap.phases.flatMap((p) => p.topics.map((t) => ({ ...t, phaseName: p.name }))),
    [roadmap],
  );

  const bookmarkedTopics = allTopics.filter((t) => bookmarks[t.id]);
  const notedTopics = allTopics.filter((t) => notes[t.id]);

  return (
    <aside className="sidebar-stack">
      <div className="panel">
        <div className="panel__head"><h3>Your plan</h3></div>
        <div className="panel__body">
          <div className="info-row"><span className="k">Subject</span><span className="v">{roadmap.subjectLabel}</span></div>
          <div className="info-row"><span className="k">Level</span><span className="v">{roadmap.input.knowledge}</span></div>
          <div className="info-row"><span className="k">Speed</span><span className="v">{roadmap.input.speed}</span></div>
          <div className="info-row"><span className="k">Daily</span><span className="v">{roadmap.input.dailyHours}</span></div>
          <div className="info-row"><span className="k">Goal</span><span className="v" style={{ fontSize: '0.74rem' }}>{roadmap.input.goal}</span></div>
          <div className="info-row"><span className="k">Study days/week</span><span className="v">{roadmap.schedule.studyDaysPerWeek}</span></div>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h3>Bookmarks</h3>
          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>{bookmarkedTopics.length}</span>
        </div>
        <div className="panel__body">
          {bookmarkedTopics.length === 0 ? (
            <p className="empty-note">No bookmarks yet. Tap the bookmark icon on any topic to save it here for revision.</p>
          ) : (
            <ul className="mini-list">
              {bookmarkedTopics.map((t) => (
                <li className="mini-item" key={t.id} onClick={() => onJumpToTopic(t.id)}>
                  <BookmarkFilled /><span>{t.name}</span><span className="mono">{t.estimatedDays}d</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <h3>Recent notes</h3>
          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>{notedTopics.length}</span>
        </div>
        <div className="panel__body">
          {notedTopics.length === 0 ? (
            <p className="empty-note">No notes yet. Expand a topic and write in the notes box to capture your thoughts.</p>
          ) : (
            <ul className="mini-list">
              {notedTopics.slice(0, 6).map((t) => (
                <li className="mini-item" key={t.id} onClick={() => onJumpToTopic(t.id)}>
                  <Note /><span>{t.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}

export function SchedulePanel({ roadmap }: { roadmap: Roadmap }) {
  const s = roadmap.schedule;
  return (
    <div className="panel section-gap">
      <div className="panel__head"><h3><Calendar style={{ width: 16, height: 16, verticalAlign: -3, marginRight: 6, color: 'var(--accent)' }} />Study schedule</h3></div>
      <div className="panel__body">
        <div className="schedule-block">
          <h4>Daily plan</h4>
          <p>{s.daily}</p>
        </div>
        <div className="schedule-block">
          <h4>Weekly plan — {s.weeks.length} weeks</h4>
          <div className="week-list">
            {s.weeks.map((w) => (
              <div className="week-item" key={w.weekNumber}>
                <div className="week-item__head">
                  <b>WEEK {w.weekNumber}</b>
                  <span>{w.focus} · ~{w.hours}h</span>
                </div>
                <div className="week-item__topics">{w.topics.join(' · ')}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="schedule-block">
          <h4>Monthly plan</h4>
          <div className="week-list">
            {s.months.map((m) => (
              <div className="week-item" key={m.monthNumber}>
                <div className="week-item__head">
                  <b>MONTH {m.monthNumber}</b>
                  <span>Weeks {m.weeks[0]}–{m.weeks[m.weeks.length - 1]}</span>
                </div>
                <div className="week-item__topics">{m.focus}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RevisionPanel({ roadmap }: { roadmap: Roadmap }) {
  const r = roadmap.revision;
  return (
    <div className="panel section-gap">
      <div className="panel__head"><h3><Refresh style={{ width: 16, height: 16, verticalAlign: -3, marginRight: 6, color: 'var(--accent)' }} />Revision plan</h3></div>
      <div className="panel__body">
        <div className="revision-group">
          <h4><Refresh /> Daily revision</h4>
          <ul>{r.daily.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="revision-group">
          <h4><Calendar /> Weekly revision</h4>
          <ul>{r.weekly.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="revision-group">
          <h4><Calendar /> Monthly revision</h4>
          <ul>{r.monthly.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="revision-group">
          <h4><Star /> High-priority interview topics</h4>
          <div className="prereq-row" style={{ marginTop: 2 }}>
            {roadmap.revision.highPriorityTopics.map((t) => (
              <span className="tag tag--days" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
