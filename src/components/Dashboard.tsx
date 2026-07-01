import type { Roadmap } from '../types/roadmap';
import { useStore } from '../store/useStore';
import { TimelineView, TreeView } from './RoadmapViews';
import { Sidebar, SchedulePanel, RevisionPanel } from './Sidebar';
import { Timeline, Tree, Download, Printer, Layers, Clock, Target, Route } from './Icons';
import { downloadPDF, downloadMarkdown, printRoadmap } from '../utils/exporters';

interface Props {
  roadmap: Roadmap;
  onJumpToTopic: (topicId: string) => void;
}

export function Dashboard({ roadmap, onJumpToTopic }: Props) {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const notes = useStore((s) => s.notes);

  const weeks = Math.max(1, Math.round(roadmap.totalDays / 5));
  const criticalCount = roadmap.phases
    .flatMap((p) => p.topics)
    .filter((t) => t.interviewImportance === 'Critical').length;

  return (
    <div className="dash">
      <div className="container">
        <div className="dash__top">
          <div>
            <span className="eyebrow"><Route style={{ width: 13, height: 13, verticalAlign: -2 }} /> Roadmap for {roadmap.input.goal}</span>
            <h1 className="dash__title" style={{ marginTop: 8 }}>
              <span>{roadmap.subjectLabel}</span> learning path
            </h1>
            <p className="dash__sub">{roadmap.summary}</p>
          </div>
          <div className="dash__actions">
            <button className="btn btn--ghost" onClick={() => downloadPDF(roadmap, notes)}><Download /> PDF</button>
            <button className="btn btn--ghost" onClick={() => downloadMarkdown(roadmap, notes)}><Download /> Markdown</button>
            <button className="btn btn--ghost" onClick={printRoadmap}><Printer /> Print</button>
          </div>
        </div>

        <div className="stat-grid">
          <Stat k="Total time" v={`${roadmap.totalDays}`} unit="days" icon={<Clock />} />
          <Stat k="Duration" v={`~${weeks}`} unit="weeks" icon={<Timeline />} />
          <Stat k="Topics" v={`${roadmap.totalTopics}`} unit={`in ${roadmap.phases.length} phases`} icon={<Layers />} />
          <Stat k="Critical for interviews" v={`${criticalCount}`} unit="topics" icon={<Target />} />
        </div>

        <div className="dash__layout">
          <div>
            <div className="panel">
              <div className="panel__head">
                <h3>{view === 'timeline' ? 'Roadmap timeline' : 'Topic tree'}</h3>
                <div className="view-toggle">
                  <button className={view === 'timeline' ? 'active' : ''} onClick={() => setView('timeline')}>
                    <Timeline /> Timeline
                  </button>
                  <button className={view === 'tree' ? 'active' : ''} onClick={() => setView('tree')}>
                    <Tree /> Tree
                  </button>
                </div>
              </div>
              <div className="panel__body" style={{ paddingTop: 18 }}>
                {view === 'timeline'
                  ? <TimelineView roadmap={roadmap} />
                  : <TreeView roadmap={roadmap} />}
              </div>
            </div>
          </div>

          <div>
            <Sidebar roadmap={roadmap} onJumpToTopic={onJumpToTopic} />
            <SchedulePanel roadmap={roadmap} />
            <RevisionPanel roadmap={roadmap} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ k, v, unit, icon }: { k: string; v: string; unit: string; icon: React.ReactNode }) {
  return (
    <div className="stat">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="stat__k">{k}</div>
        <div style={{ color: 'var(--accent)', width: 16, height: 16, opacity: 0.7 }}>{icon}</div>
      </div>
      <div className="stat__v">{v}<small>{unit}</small></div>
    </div>
  );
}
