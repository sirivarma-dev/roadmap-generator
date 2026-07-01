import { useState } from 'react';
import type {
  DailyStudyTime,
  KnowledgeLevel,
  LearningGoal,
  LearningSpeed,
  RoadmapInput,
} from '../types/roadmap';
import { useStore } from '../store/useStore';
import { Check, Route, Alert, Compass, Target, Clock } from './Icons';

const SPEEDS: LearningSpeed[] = ['Very Slow', 'Slow', 'Average', 'Above Average', 'Fast'];
const HOURS: DailyStudyTime[] = ['1 Hour', '2 Hours', '3 Hours', '4 Hours', '5+ Hours'];
const LEVELS: KnowledgeLevel[] = ['Beginner', 'Basic', 'Intermediate', 'Advanced'];
const GOALS: LearningGoal[] = [
  'Interview Preparation',
  'Job Preparation',
  'College',
  'Skill Development',
  'Career Switch',
  'General Knowledge',
];
const SUGGESTIONS = [
  'Python', 'JavaScript', 'React', 'Machine Learning', 'Data Structures & Algorithms',
  'Web Development', 'SQL', 'Docker', 'System Design', 'Java', 'C++', 'Cybersecurity',
];

interface Props {
  onGenerate: (input: RoadmapInput) => void;
}

export function SetupForm({ onGenerate }: Props) {
  const isGenerating = useStore((s) => s.isGenerating);
  const [subject, setSubject] = useState('');
  const [speed, setSpeed] = useState<LearningSpeed>('Average');
  const [hours, setHours] = useState<DailyStudyTime>('2 Hours');
  const [knowledge, setKnowledge] = useState<KnowledgeLevel>('Beginner');
  const [goal, setGoal] = useState<LearningGoal>('Interview Preparation');
  const [error, setError] = useState('');

  function submit() {
    if (subject.trim().length < 2) {
      setError('Enter a subject to plan — for example, Python or Machine Learning.');
      return;
    }
    setError('');
    onGenerate({ subject: subject.trim(), speed, dailyHours: hours, knowledge, goal });
  }

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="eyebrow">Roadmap planner &amp; study organizer</span>
            <h1 className="hero__title">
              Plan the <em>right order</em> to learn any technical subject.
            </h1>
            <p className="hero__lead">
              Tell Pathwright what you want to learn and how you study. It drafts a
              dependency-ordered path from where you are now to professional level —
              with time estimates, a study schedule, and interview-focused notes.
            </p>
            <ul className="hero__points">
              <li><Check /> Topics in correct dependency order — nothing important skipped</li>
              <li><Check /> Realistic time estimates tuned to your pace and daily hours</li>
              <li><Check /> Interview concepts and common mistakes for every topic</li>
              <li><Check /> Bookmarks, personal notes, and PDF / Markdown export</li>
            </ul>
          </div>

          <div className="blueprint-sketch" aria-hidden="true">
            <div className="blueprint-sketch__head">
              <span>Roadmap draft</span>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-faint)' }}>rev. A</span>
            </div>
            {[
              ['Foundations', 78],
              ['Core Concepts', 62],
              ['Intermediate', 48],
              ['Advanced', 34],
              ['Mastery', 20],
            ].map(([label, w]) => (
              <div className="sketch-row" key={label as string}>
                <div className="sketch-node" />
                <div className="sketch-bar"><i style={{ width: `${w}%` }} /></div>
                <div className="sketch-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="setup-form">
          <div className="form-card">
            <div className="field">
              <div className="field__label">
                <span className="field__num">01</span>
                <b>What do you want to learn?</b>
              </div>
              <input
                className="text-input"
                placeholder="e.g. Python, React, Machine Learning, System Design…"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                autoFocus
              />
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setSubject(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field__label">
                <span className="field__num">02</span>
                <b>How fast do you learn?</b>
              </div>
              <div className="chip-row">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    className={`chip ${speed === s ? 'chip--active' : ''}`}
                    onClick={() => setSpeed(s)}
                  >{s}</button>
                ))}
              </div>
              <p className="field__hint">Slower pace stretches the calendar; it never removes topics.</p>
            </div>

            <div className="field">
              <div className="field__label">
                <span className="field__num">03</span>
                <b>How much time can you study each day?</b>
              </div>
              <div className="chip-row">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    className={`chip ${hours === h ? 'chip--active' : ''}`}
                    onClick={() => setHours(h)}
                  >{h}</button>
                ))}
              </div>
            </div>

            <div className="field">
              <div className="field__label">
                <span className="field__num">04</span>
                <b>Where are you starting from?</b>
              </div>
              <div className="chip-row">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    className={`chip ${knowledge === l ? 'chip--active' : ''}`}
                    onClick={() => setKnowledge(l)}
                  >{l}</button>
                ))}
              </div>
              <p className="field__hint">Higher starting levels skip the basics you already know.</p>
            </div>

            <div className="field">
              <div className="field__label">
                <span className="field__num">05</span>
                <b>What are you aiming for?</b>
              </div>
              <div className="chip-row">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    className={`chip ${goal === g ? 'chip--active' : ''}`}
                    onClick={() => setGoal(g)}
                  >{g}</button>
                ))}
              </div>
              <p className="field__hint">Interview and job goals weight high-yield topics more heavily.</p>
            </div>

            {error && (
              <div className="form-error" style={{ marginBottom: 20 }}>
                <Alert /> {error}
              </div>
            )}

            <button className="btn btn--primary" onClick={submit} disabled={isGenerating} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
              <Route /> Generate my roadmap
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <MiniFeature icon={<Compass />} title="Correct order" text="Every topic lists its prerequisites and appears after them." />
            <MiniFeature icon={<Clock />} title="Honest timing" text="Estimates in days, based on difficulty and your real pace." />
            <MiniFeature icon={<Target />} title="Interview-ready" text="Key concepts, tricky areas, and common mistakes per topic." />
          </div>
        </div>
      </section>
    </>
  );
}

function MiniFeature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="form-card" style={{ padding: 20 }}>
      <div style={{ color: 'var(--accent)', marginBottom: 10, width: 22, height: 22 }}>{icon}</div>
      <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>{text}</p>
    </div>
  );
}
