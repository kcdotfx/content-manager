import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Kanban, 
  CalendarDays, 
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ideas', label: 'Ideas', icon: Lightbulb },
  { path: '/kanban', label: 'Pipeline', icon: Kanban },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        data-testid="mobile-menu-btn"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-zinc-950/95 border-r border-white/5 transform transition-transform duration-300 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 mb-12"
            data-testid="logo-link"
          >
            <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg font-sans tracking-tight">ContentOS</h1>
              <p className="text-xs text-zinc-500 font-mono">CREATOR SUITE</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-lime-400/10 text-lime-400 nav-active" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  <Icon className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive && "text-lime-400"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime-400 to-cyan-400 flex items-center justify-center text-black font-bold text-sm">
                C
              </div>
              <div>
                <p className="text-sm font-medium">Creator</p>
                <p className="text-xs text-zinc-500 font-mono">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
