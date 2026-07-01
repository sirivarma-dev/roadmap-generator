import { Check } from './Icons';

const STEPS = [
  'Resolving the subject and prerequisites',
  'Ordering topics by dependency',
  'Estimating time from your pace',
  'Drafting your study schedule',
];

export function Loading({ subject }: { subject: string }) {
  return (
    <div className="loading-wrap">
      <div className="loading-compass">
        <svg viewBox="0 0 66 66" fill="none" stroke="var(--accent)" strokeWidth="2">
          <circle cx="33" cy="33" r="30" opacity="0.25" />
          <circle cx="33" cy="33" r="30" strokeDasharray="188" strokeDashoffset="130" strokeLinecap="round" />
          <g className="needle">
            <path d="M33 12 L38 33 L33 30 L28 33 Z" fill="var(--accent)" stroke="none" />
            <path d="M33 54 L28 33 L33 36 L38 33 Z" fill="var(--accent)" opacity="0.3" stroke="none" />
          </g>
          <circle cx="33" cy="33" r="2.5" fill="var(--accent)" stroke="none" />
        </svg>
      </div>
      <h3>Drafting your {subject} roadmap</h3>
      <p>Planning the correct learning order…</p>
      <div className="loading-steps">
        {STEPS.map((s, i) => (
          <div className="loading-step" key={s} style={{ animationDelay: `${i * 0.16}s` }}>
            <Check /> {s}
          </div>
        ))}
      </div>
    </div>
  );
}
