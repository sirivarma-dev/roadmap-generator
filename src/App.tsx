import { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import type { RoadmapInput } from './types/roadmap';
import { Header } from './components/Header';
import { SetupForm } from './components/SetupForm';
import { Loading } from './components/Loading';
import { Dashboard } from './components/Dashboard';
import { SearchModal } from './components/SearchModal';
import './components/components.css';

export default function App() {
  const theme = useStore((s) => s.theme);
  const roadmap = useStore((s) => s.roadmap);
  const isGenerating = useStore((s) => s.isGenerating);
  const generate = useStore((s) => s.generate);
  const clearRoadmap = useStore((s) => s.clearRoadmap);

  const [searchOpen, setSearchOpen] = useState(false);
  const [pendingSubject, setPendingSubject] = useState('');

  // Apply theme to the document root.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global "/" shortcut opens search when a roadmap exists.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
      if (e.key === '/' && !typing && roadmap && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [roadmap, searchOpen]);

  async function handleGenerate(input: RoadmapInput) {
    setPendingSubject(input.subject);
    await generate(input);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleHome() {
    clearRoadmap();
    window.scrollTo({ top: 0 });
  }

  function jumpToTopic(topicId: string) {
    const el = document.getElementById(`topic-${topicId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.transition = 'box-shadow 0.3s ease';
      el.style.boxShadow = '0 0 0 3px var(--accent)';
      setTimeout(() => { el.style.boxShadow = ''; }, 1400);
    }
  }

  return (
    <div className="app-shell">
      <Header onSearch={() => setSearchOpen(true)} onHome={handleHome} />

      <main style={{ flex: 1 }}>
        {isGenerating ? (
          <div className="container"><Loading subject={pendingSubject || 'your'} /></div>
        ) : roadmap ? (
          <Dashboard roadmap={roadmap} onJumpToTopic={jumpToTopic} />
        ) : (
          <SetupForm onGenerate={handleGenerate} />
        )}
      </main>

      {searchOpen && roadmap && (
        <SearchModal
          roadmap={roadmap}
          onClose={() => setSearchOpen(false)}
          onSelectTopic={jumpToTopic}
        />
      )}

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>Pathwright — a roadmap planner and study organizer.</span>
          <span className="mono">Not a course platform · Plans stored locally on your device</span>
        </div>
      </footer>
    </div>
  );
}
