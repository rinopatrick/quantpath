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

const skillCategories = [
  { name: 'Mathematics', icon: Sigma, color: 'text-blue-400' },
  { name: 'Programming', icon: Code, color: 'text-green-400' },
  { name: 'Finance', icon: DollarSign, color: 'text-yellow-400' },
  { name: 'Machine Learning', icon: Brain, color: 'text-purple-400' },
  { name: 'Tools', icon: Wrench, color: 'text-orange-400' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <span className="text-lg font-bold text-foreground">QuantPath</span>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Nuclear → Quant</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Skill Categories Legend */}
        <div className="px-3 py-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-3 px-3 uppercase tracking-wider">
            Skill Categories
          </p>
          <div className="space-y-1.5">
            {skillCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-muted-foreground">
                <cat.icon className={cn("w-4 h-4", cat.color)} />
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border">
          <div className="px-3 py-3 rounded-xl bg-muted/50">
            <p className="text-xs font-medium text-foreground">24-Week Program</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Structured path to quant career
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
