import { useState } from 'react';
import type { Phase, Roadmap } from '../types/roadmap';
import { TopicCard } from './TopicCard';
import { ChevronRight, Clock } from './Icons';

export function TimelineView({ roadmap }: { roadmap: Roadmap }) {
  return (
    <div>
      {roadmap.phases.map((phase, i) => (
        <PhaseBlock key={phase.id} phase={phase} index={i} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

function PhaseBlock({ phase, index, defaultOpen }: { phase: Phase; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`phase ${open ? 'phase--open' : ''}`}>
      <div className="phase__dot"><i /></div>
      <div className="phase__head" onClick={() => setOpen((o) => !o)}>
        <div className="phase__meta">
          <div className="phase__name">
            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>
              PHASE {String(index + 1).padStart(2, '0')}
            </span>
            {phase.name}
          </div>
          <p className="phase__obj">{phase.objective}</p>
          <div className="phase__tags">
            <span className="tag tag--days"><Clock style={{ width: 12, height: 12 }} /> {phase.estimatedDays} days</span>
            <span className={`tag tag--diff-${phase.difficulty}`}>{phase.difficulty}</span>
            <span className="tag">{phase.topics.length} topics</span>
          </div>
        </div>
        <span className="phase__caret"><ChevronRight /></span>
      </div>

      {open && (
        <>
          <div className="phase__topics">
            {phase.topics.map((t) => (
              <TopicCard key={t.id} topic={t} scrollAnchorId={`topic-${t.id}`} />
            ))}
          </div>

          <PhaseSummary phase={phase} />
        </>
      )}
    </div>
  );
}

function PhaseSummary({ phase }: { phase: Phase }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
      <div>
        <span className="eyebrow">Learning outcomes</span>
        <ul style={{ margin: '9px 0 0', paddingLeft: 18, display: 'grid', gap: 6 }}>
          {phase.learningOutcomes.map((o) => (
            <li key={o} style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{o}</li>
          ))}
        </ul>
      </div>
      <div>
        <span className="eyebrow">Common beginner mistakes in this phase</span>
        <ul style={{ margin: '9px 0 0', paddingLeft: 18, display: 'grid', gap: 6 }}>
          {phase.commonBeginnerMistakes.map((m) => (
            <li key={m} style={{ fontSize: '0.86rem', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TreeView({ roadmap }: { roadmap: Roadmap }) {
  return (
    <div className="tree">
      {roadmap.phases.map((phase, i) => (
        <div className="tree__phase" key={phase.id}>
          <div className="tree__phase-name">
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            {phase.name}
          </div>
          {phase.topics.map((t) => (
            <TreeTopic key={t.id} name={t.name} days={t.estimatedDays} subs={t.subtopics} />
          ))}
        </div>
      ))}
    </div>
  );
}

function TreeTopic({ name, days, subs }: { name: string; days: number; subs: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tree__topic">
      <div className="tree__topic-name" onClick={() => setOpen((o) => !o)}>
        {name} <span className="mono">· {days}d · {subs.length} subtopics</span>
      </div>
      {open && (
        <ul className="tree__subs">
          {subs.map((s) => <li key={s}>{s}</li>)}
        </ul>
      )}
    </div>
  );
}
