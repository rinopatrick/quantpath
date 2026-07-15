'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, Bell, Sun, Moon, Cloud, CloudOff, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Overview of your learning progress' },
  '/roadmap': { title: 'Roadmap', description: 'Visual skill tree' },
  '/resources': { title: 'Resources', description: 'Curated curriculum library' },
  '/papers': { title: 'Research Papers', description: 'Essential quant finance papers' },
  '/books': { title: 'Book Recommendations', description: 'Essential quant finance reading' },
  '/certifications': { title: 'Certifications', description: 'Industry credentials' },
  '/reference': { title: 'Reference', description: 'Cheat sheets' },
  '/interview': { title: 'Interview', description: '90+ quant questions' },
  '/flashcards': { title: 'Flashcards', description: 'Spaced repetition practice' },
  '/practice': { title: 'Practice Tracker', description: 'Brainteasers & numerical problems' },
  '/leetcode': { title: 'LeetCode Tracker', description: '50 curated algorithm problems' },
  '/research': { title: 'Research Reports', description: 'Templates & guides' },
  '/review': { title: 'Weekly Review', description: 'Reflect & plan your progress' },
  '/projects': { title: 'Projects', description: 'CV-worthy projects' },
  '/competitions': { title: 'Competitions', description: 'Quant competitions' },
  '/networking': { title: 'Networking', description: 'Target firms & contacts' },
  '/pipeline': { title: 'Pipeline', description: 'Application tracker' },
  '/analytics': { title: 'Analytics', description: 'Progress & study insights' },
  '/notes': { title: 'Notes', description: 'Your learnings' },
  '/material': { title: 'Material', description: 'Convert to learning' },
  '/sync': { title: 'Sync', description: 'Sync devices' },
  '/profile': { title: 'Profile', description: 'Progress & skills' },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: 'QuantPath', description: '' };
  const [isDark, setIsDark] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('quantpath-theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('quantpath-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('quantpath-theme', 'light');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-14 md:h-16 items-center px-3 md:px-6 lg:px-8">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden mr-2 h-10 w-10" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Page Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-base md:text-lg font-bold text-foreground truncate">{page.title}</h1>
          {page.description && (
            <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block truncate">{page.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Sync Status */}
          {user ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-500 text-[10px] hidden md:flex">
              <Cloud className="h-3 w-3 mr-1" />
              Synced
            </Badge>
          ) : (
            <Link href="/login">
              <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px] hidden md:flex cursor-pointer hover:bg-muted/80">
                <CloudOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground h-9 w-9 md:h-10 md:w-10"
          >
            {isDark ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground h-9 w-9 md:h-10 md:w-10"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9 md:h-10 md:w-10" title="Sign in">
                <LogIn className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">Sign in</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
