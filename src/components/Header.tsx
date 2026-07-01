import { useStore } from '../store/useStore';
import { Sun, Moon, Search, Route } from './Icons';

interface Props {
  onSearch: () => void;
  onHome: () => void;
}

export function Header({ onSearch, onHome }: Props) {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const roadmap = useStore((s) => s.roadmap);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="brand" onClick={onHome} role="button" tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onHome()}>
          <div className="brand__mark"><span /></div>
          <div className="brand__name">Path<b>wright</b></div>
        </div>
        <div className="header-spacer" />
        <div className="header-actions">
          {roadmap && (
            <button className="icon-btn" onClick={onSearch} aria-label="Search roadmap" title="Search (press /)">
              <Search />
            </button>
          )}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
          {roadmap && (
            <button className="btn btn--ghost" onClick={onHome}>
              <Route /> New roadmap
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
