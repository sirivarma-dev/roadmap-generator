import { useEffect, useMemo, useRef, useState } from 'react';
import type { Roadmap } from '../types/roadmap';
import { Search, X, Layers, Target } from './Icons';

interface Props {
  roadmap: Roadmap;
  onClose: () => void;
  onSelectTopic: (topicId: string) => void;
}

type Result =
  | { kind: 'Topic'; topicId: string; title: string; sub: string }
  | { kind: 'Subtopic'; topicId: string; title: string; sub: string }
  | { kind: 'Interview'; topicId: string; title: string; sub: string };

export function SearchModal({ roadmap, onClose, onSelectTopic }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Result[] = [];
    for (const phase of roadmap.phases) {
      for (const t of phase.topics) {
        if (t.name.toLowerCase().includes(q)) {
          out.push({ kind: 'Topic', topicId: t.id, title: t.name, sub: `${phase.name} · ${t.estimatedDays} days` });
        }
        for (const s of t.subtopics) {
          if (s.toLowerCase().includes(q)) {
            out.push({ kind: 'Subtopic', topicId: t.id, title: s, sub: `in ${t.name}` });
          }
        }
        for (const c of t.interviewConcepts) {
          if (c.toLowerCase().includes(q)) {
            out.push({ kind: 'Interview', topicId: t.id, title: c, sub: `interview concept · ${t.name}` });
          }
        }
      }
    }
    return out.slice(0, 40);
  }, [query, roadmap]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      if (e.key === 'Enter' && results[active]) { onSelectTopic(results[active].topicId); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [results, active, onSelectTopic, onClose]);

  const grouped = useMemo(() => {
    const g: Record<string, Result[]> = { Topic: [], Subtopic: [], Interview: [] };
    results.forEach((r) => g[r.kind].push(r));
    return g;
  }, [results]);

  let flatIndex = -1;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <Search />
          <input
            ref={inputRef}
            placeholder="Search topics, subtopics, and interview concepts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={onClose} aria-label="Close search"><X /></button>
        </div>

        <div className="search-results">
          {query.trim() === '' ? (
            <div className="search-empty">Type to search across your entire roadmap.</div>
          ) : results.length === 0 ? (
            <div className="search-empty">No matches for “{query}”. Try a different term.</div>
          ) : (
            (['Topic', 'Subtopic', 'Interview'] as const).map((kind) =>
              grouped[kind].length > 0 ? (
                <div key={kind}>
                  <div className="search-group-label">{kind === 'Interview' ? 'Interview concepts' : `${kind}s`}</div>
                  {grouped[kind].map((r) => {
                    flatIndex += 1;
                    const idx = flatIndex;
                    return (
                      <div
                        key={`${r.kind}-${r.topicId}-${r.title}`}
                        className={`search-result ${idx === active ? 'active' : ''}`}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => { onSelectTopic(r.topicId); onClose(); }}
                      >
                        <div className="search-result__icon">
                          {r.kind === 'Interview' ? <Target /> : <Layers />}
                        </div>
                        <div className="search-result__main">
                          <div className="search-result__title">{r.title}</div>
                          <div className="search-result__sub">{r.sub}</div>
                        </div>
                        <span className="search-result__type">{r.kind}</span>
                      </div>
                    );
                  })}
                </div>
              ) : null,
            )
          )}
        </div>
      </div>
    </div>
  );
}
