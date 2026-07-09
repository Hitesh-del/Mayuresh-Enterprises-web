import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { store } from '@/store';
import { queryClient } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import { setUser, setProfile, setAuthLoading } from '@/store/authSlice';
import { useBrowserNotifications } from '@/hooks/useBrowserNotifications';
import type { RootState } from '@/store';

import { routes } from './routes';

const AuthListener: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  useBrowserNotifications(user?.id);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setUser(session?.user ?? null));
      if (session?.user) {
        supabase
          .from('user_profiles')
          .select('full_name, phone, avatar_url, role, notifications_enabled, address, business_hours')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(async ({ data, error }) => {
            if (data) {
              dispatch(setProfile(data));
            } else {
              // Auto-create profile if missing
              const defaultProfile = {
                id: session.user.id,
                full_name: session.user.email?.split('@')[0] || null,
                phone: null,
                avatar_url: null,
                role: 'user',
                notifications_enabled: false,
                address: null,
                business_hours: null,
              };
              const { error: upsertError } = await supabase.from('user_profiles').upsert(defaultProfile, { onConflict: 'id' });
              if (!upsertError) {
                dispatch(setProfile(defaultProfile));
              }
            }
            if (error) console.warn('Profile fetch error:', error);
            dispatch(setAuthLoading(false));
          });
      } else {
        dispatch(setAuthLoading(false));
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
      if (session?.user) {
        supabase
          .from('user_profiles')
          .select('full_name, phone, avatar_url, role, notifications_enabled, address, business_hours')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(async ({ data, error }) => {
            if (data) {
              dispatch(setProfile(data));
            } else {
              const defaultProfile = {
                id: session.user.id,
                full_name: session.user.email?.split('@')[0] || null,
                phone: null,
                avatar_url: null,
                role: 'user',
                notifications_enabled: false,
                address: null,
                business_hours: null,
              };
              const { error: upsertError } = await supabase.from('user_profiles').upsert(defaultProfile, { onConflict: 'id' });
              if (!upsertError) {
                dispatch(setProfile(defaultProfile));
              }
            }
            if (error) console.warn('Profile fetch error:', error);
          });
      } else {
        dispatch(setProfile(null));
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AuthListener />
            <IntersectObserver />
            <div className="flex flex-col min-h-screen w-full bg-background">
              <main className="flex-grow w-full">
                <Routes>
                  {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </Router>
        </QueryClientProvider>
      </Provider>
    </HelmetProvider>
  );
};

export default App;
