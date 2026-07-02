import { useState } from 'react';
import type { Topic } from '../types/roadmap';
import { useStore } from '../store/useStore';
import {
  Bookmark, BookmarkFilled, ChevronDown, Clock, Target, Alert, Note, Check, Play,
} from './Icons';
import { subtopicKey } from '../utils/progress';

interface Props {
  topic: Topic;
  /** The roadmap subject, used to build relevant video-search links. */
  subject: string;
  defaultOpen?: boolean;
  scrollAnchorId?: string;
}

/**
 * A YouTube search link for a topic/subtopic, tuned for short, simple-English
 * explainers. The `sp=EgIYAw%3D%3D` filter restricts results to 4–20 minute
 * videos, so every result completes in minutes rather than hours.
 */
function videoSearchUrl(term: string): string {
  const query = `${term} explained simply for beginners in english`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIYAw%3D%3D`;
}

export function TopicCard({ topic, subject, defaultOpen = false, scrollAnchorId }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const bookmarked = useStore((s) => !!s.bookmarks[topic.id]);
  const note = useStore((s) => s.notes[topic.id] ?? '');
  const completed = useStore((s) => s.completedSubtopics);
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const setNote = useStore((s) => s.setNote);
  const toggleSubtopic = useStore((s) => s.toggleSubtopic);
  const setTopicComplete = useStore((s) => s.setTopicComplete);
  const [draft, setDraft] = useState(note);
  const [saved, setSaved] = useState(false);

  const doneCount = topic.subtopics.filter((s) => completed[subtopicKey(topic.id, s)]).length;
  const total = topic.subtopics.length;
  const allDone = total > 0 && doneCount === total;

  function saveNote() {
    setNote(topic.id, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className={`topic ${open ? 'topic--open' : ''} ${allDone ? 'topic--done' : ''}`} id={scrollAnchorId}>
      <div className="topic__bar" onClick={() => setOpen((o) => !o)}>
        {allDone && <span className="topic__done-check" title="Topic complete"><Check /></span>}
        <span className="topic__name">{topic.name}</span>
        <div className="topic__tags">
          {doneCount > 0 && (
            <span className={`tag tag--progress ${allDone ? 'is-done' : ''}`}>{doneCount}/{total} done</span>
          )}
          <span className="tag tag--days"><Clock style={{ width: 12, height: 12 }} /> {topic.estimatedDays}d</span>
          <span className={`tag tag--diff-${topic.difficulty}`}>{topic.difficulty}</span>
          <span className={`imp-badge imp-${topic.interviewImportance}`}>{topic.interviewImportance}</span>
        </div>
        <button
          className={`topic__bookmark ${bookmarked ? 'active' : ''}`}
          onClick={(e) => { e.stopPropagation(); toggleBookmark(topic.id); }}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark topic'}
          title={bookmarked ? 'Bookmarked' : 'Bookmark for revision'}
        >
          {bookmarked ? <BookmarkFilled /> : <Bookmark />}
        </button>
        <span className="topic__caret"><ChevronDown /></span>
      </div>

      {open && (
        <div className="topic__detail">
          <div className="detail-section">
            <span className="eyebrow">Learning objective</span>
            <p className="detail-objective">{topic.learningObjective}</p>
          </div>

          {topic.prerequisites.length > 0 && (
            <div className="detail-section">
              <span className="eyebrow">Prerequisites</span>
              <div className="prereq-row">
                {topic.prerequisites.map((p) => (
                  <span className="tag" key={p}>{p}</span>
                ))}
              </div>
            </div>
          )}

          <div className="detail-section">
            <div className="subtopic-head">
              <span className="eyebrow">Subtopics — {doneCount}/{total} completed</span>
              {total > 0 && (
                <button className="mark-all" onClick={() => setTopicComplete(topic.id, topic.subtopics, !allDone)}>
                  {allDone ? 'Clear all' : 'Mark all done'}
                </button>
              )}
            </div>
            {total > 0 && (
              <div className="progress-bar progress-bar--slim" style={{ margin: '0 0 12px' }}>
                <i style={{ width: `${Math.round((doneCount / total) * 100)}%` }} />
              </div>
            )}
            <div className="subtopic-grid">
              {topic.subtopics.map((s) => {
                const done = !!completed[subtopicKey(topic.id, s)];
                return (
                  <button
                    className={`subtopic subtopic--check ${done ? 'is-done' : ''}`}
                    key={s}
                    onClick={() => toggleSubtopic(topic.id, s)}
                    aria-pressed={done}
                  >
                    <span className="subtopic__box">{done && <Check />}</span>
                    <span className="subtopic__text">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="detail-section">
            <span className="eyebrow"><Play style={{ width: 13, height: 13, verticalAlign: -2 }} /> Watch &amp; learn — video explainers</span>
            <p className="detail-hint">Short, simple-English videos (a few minutes each) for this topic and every subtopic.</p>
            <div className="video-links">
              <a
                className="video-link video-link--primary"
                href={topic.videoUrl ?? videoSearchUrl(`${subject} ${topic.name}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play /> Watch “{topic.name}” explained
              </a>
              {topic.subtopics.map((s) => (
                <a
                  className="video-link"
                  key={s}
                  href={videoSearchUrl(`${subject} ${s}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play /> {s}
                </a>
              ))}
            </div>
          </div>

          <div className="detail-section detail-cols">
            <div>
              <span className="eyebrow"><Target style={{ width: 13, height: 13, verticalAlign: -2 }} /> Interview concepts</span>
              <ul className="pill-list pill-list--interview" style={{ marginTop: 9 }}>
                {topic.interviewConcepts.map((c) => (
                  <li key={c}><Target /> {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="eyebrow"><Alert style={{ width: 13, height: 13, verticalAlign: -2 }} /> Common mistakes</span>
              <ul className="pill-list pill-list--mistake" style={{ marginTop: 9 }}>
                {topic.commonMistakes.map((m) => (
                  <li key={m}><Alert /> {m}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="detail-section">
            <span className="eyebrow"><Note style={{ width: 13, height: 13, verticalAlign: -2 }} /> Your notes</span>
            <div className="note-box">
              <textarea
                placeholder="Jot down anything you want to remember about this topic…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={saveNote}
              />
              <div className="note-status">
                {saved ? (<><Check /> Saved</>) : draft !== note ? 'Unsaved changes — click away to save' : note ? 'Saved to this device' : 'Notes are saved automatically on this device'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
