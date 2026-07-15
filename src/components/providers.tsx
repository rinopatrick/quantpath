'use client';

import { AuthProvider, useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

const PUBLIC_PATHS = ['/login', '/auth/callback'];

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading, authorized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  useEffect(() => {
    if (!loading && !isPublicPath && (!user || !authorized)) {
      router.replace('/login');
    }
  }, [user, loading, authorized, isPublicPath, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Public paths (login, auth callback) - show without auth check
  if (isPublicPath) {
    return <>{children}</>;
  }

  // Protected paths - require auth
  if (!user || !authorized) {
    return null;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
