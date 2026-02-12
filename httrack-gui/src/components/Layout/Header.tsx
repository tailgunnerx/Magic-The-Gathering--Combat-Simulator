import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/theme';
import { Button } from '../ui/Button';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-16 bg-slate-900/30 backdrop-blur-lg border-b border-slate-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-white">Welcome to HTTrack</h2>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-9 h-9 p-0"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
