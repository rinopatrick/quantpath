'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GitBranch, 
  BookOpen, 
  Lightbulb, 
  Trophy, 
  User,
  Sigma,
  Code,
  DollarSign,
  Brain,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Learning Roadmap',
    href: '/roadmap',
    icon: GitBranch,
  },
  {
    title: 'Resources',
    href: '/resources',
    icon: BookOpen,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: Lightbulb,
  },
  {
    title: 'Competitions',
    href: '/competitions',
    icon: Trophy,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-slate-900 border-r border-slate-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold text-white">QuantPath</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Skill Categories Legend */}
        <div className="px-4 py-4 border-t border-slate-800">
          <p className="text-xs font-medium text-slate-500 mb-3">SKILL CATEGORIES</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sigma className="w-4 h-4 text-blue-400" />
              <span>Mathematics</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Code className="w-4 h-4 text-green-400" />
              <span>Programming</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <DollarSign className="w-4 h-4 text-yellow-400" />
              <span>Finance</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Machine Learning</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Wrench className="w-4 h-4 text-orange-400" />
              <span>Tools</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            Nuclear Engineering → Quant
          </p>
        </div>
      </div>
    </div>
  );
}
