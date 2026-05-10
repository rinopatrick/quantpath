'use client';

import { usePathname } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { Badge } from '@/components/ui/badge';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Overview of your learning progress' },
  '/roadmap': { title: 'Learning Roadmap', description: 'Visual skill tree and learning path' },
  '/resources': { title: 'Resource Library', description: '200+ free learning resources' },
  '/projects': { title: 'Project Ideas', description: 'CV-worthy projects to build' },
  '/competitions': { title: 'Competition Tracker', description: 'Quant finance competitions' },
  '/profile': { title: 'Profile & Skills', description: 'Track your progress and skills' },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: 'QuantPath', description: '' };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-16 items-center px-4 md:px-6 lg:px-8">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden mr-2" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Page Title */}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground">{page.title}</h1>
          {page.description && (
            <p className="text-xs text-muted-foreground hidden sm:block">{page.description}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
