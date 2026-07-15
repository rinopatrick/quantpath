'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const ALLOWED_EMAILS: string[] = [
  'patrickrinoh0910@gmail.com',
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authorized: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  authorized: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const isAuthorized = (email: string | undefined): boolean => {
    if (!email) return false;
    if (ALLOWED_EMAILS.length === 0) return true; // Jika allowlist kosong, izinkan semua (development mode)
    return ALLOWED_EMAILS.includes(email.toLowerCase());
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const u = session?.user ?? null;
      setUser(u);
      
      if (u && !isAuthorized(u.email)) {
        // Email tidak diizinkan → force logout
        supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setAuthorized(false);
      } else {
        setAuthorized(!!u);
      }
      
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      
      if (u && !isAuthorized(u.email)) {
        // Email tidak diizinkan → force logout
        supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setAuthorized(false);
      } else {
        setAuthorized(!!u);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setAuthorized(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, authorized, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
