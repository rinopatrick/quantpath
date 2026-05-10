'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/roadmap': 'Learning Roadmap',
  '/resources': 'Resource Library',
  '/projects': 'Project Ideas',
  '/competitions': 'Competition Tracker',
  '/profile': 'Profile & Skills',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'QuantPath';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-6 w-6 text-slate-400" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-slate-900">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Page Title */}
        <div className="flex-1 ml-4 md:ml-0">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
