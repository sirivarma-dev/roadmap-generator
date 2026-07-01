import { useState } from 'react';
import type { Topic } from '../types/roadmap';
import { useStore } from '../store/useStore';
import {
  Bookmark, BookmarkFilled, ChevronDown, Clock, Target, Alert, Note, Check,
} from './Icons';

interface Props {
  topic: Topic;
  defaultOpen?: boolean;
  scrollAnchorId?: string;
}

export function TopicCard({ topic, defaultOpen = false, scrollAnchorId }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const bookmarked = useStore((s) => !!s.bookmarks[topic.id]);
  const note = useStore((s) => s.notes[topic.id] ?? '');
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const setNote = useStore((s) => s.setNote);
  const [draft, setDraft] = useState(note);
  const [saved, setSaved] = useState(false);

  function saveNote() {
    setNote(topic.id, draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className={`topic ${open ? 'topic--open' : ''}`} id={scrollAnchorId}>
      <div className="topic__bar" onClick={() => setOpen((o) => !o)}>
        <span className="topic__name">{topic.name}</span>
        <div className="topic__tags">
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
            <span className="eyebrow">Subtopics — {topic.subtopics.length} to cover</span>
            <div className="subtopic-grid">
              {topic.subtopics.map((s) => (
                <div className="subtopic" key={s}><i /> {s}</div>
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
