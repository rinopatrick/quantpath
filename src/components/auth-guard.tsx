'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading, authorized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !authorized)) {
      router.replace('/login');
    }
  }, [user, loading, authorized, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !authorized) {
    return null;
  }

  return <>{children}</>;
}
