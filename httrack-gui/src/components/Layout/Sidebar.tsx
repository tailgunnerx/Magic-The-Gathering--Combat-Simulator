import { NavLink } from 'react-router-dom';
import { Home, Settings, FolderOpen, Download, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Downloads', href: '/downloads', icon: Download },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'About', href: '/about', icon: Info },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-lg border-r border-slate-700 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          HTTrack v2
        </h1>
        <p className="text-xs text-slate-400 mt-1">Website Copier</p>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-purple-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">
          <p>Version 2.0.0</p>
          <p className="mt-1">© 2026 HTTrack</p>
        </div>
      </div>
    </aside>
  );
}
