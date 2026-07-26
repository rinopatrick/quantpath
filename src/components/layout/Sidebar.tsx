'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  GitBranch, 
  BookOpen, 
  Award,
  Lightbulb, 
  Trophy, 
  User,
  FileText,
  StickyNote,
  Brain,
  Sparkles,
  RefreshCw,
  Sigma,
  Code,
  DollarSign,
  Wrench,
  Globe,
  Target,
  Layers,
  BarChart3,
  PenLine,
  BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Roadmap', href: '/roadmap', icon: GitBranch },
  { title: 'Resources', href: '/resources', icon: BookOpen },
  { title: 'Papers', href: '/papers', icon: FileText },
  { title: 'Projects', href: '/projects', icon: Lightbulb },
  { title: 'Competitions', href: '/competitions', icon: Trophy },
  { title: 'Networking', href: '/networking', icon: Globe },
  { title: 'Pipeline', href: '/pipeline', icon: Target },
  { title: 'Interview', href: '/interview', icon: Brain },
  { title: 'Practice', href: '/practice', icon: Target },
  { title: 'Mock Tests', href: '/mock-tests', icon: Layers },
  { title: 'LeetCode', href: '/leetcode', icon: Code },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'Profile', href: '/profile', icon: User },
];

const skillCategories = [
  { name: 'Mathematics', icon: Sigma, color: 'text-blue-400' },
  { name: 'Programming', icon: Code, color: 'text-green-400' },
  { name: 'Finance', icon: DollarSign, color: 'text-yellow-400' },
  { name: 'Machine Learning', icon: Wrench, color: 'text-purple-400' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <div>
              <span className="text-lg font-bold text-foreground">QuantPath</span>
              <p className="text-[10px] text-primary/60 font-medium -mt-0.5">Nuclear → Quant</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-border">
          <div className="px-3 py-3 rounded-xl bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground">32-Week Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
