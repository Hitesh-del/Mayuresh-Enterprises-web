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
    const syncUserProfile = async (activeUser: { id: string; email?: string | null } | null) => {
      if (!activeUser) {
        dispatch(setProfile(null));
        dispatch(setAuthLoading(false));
        return;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, phone, avatar_url, role, notifications_enabled, address, business_hours')
        .eq('id', activeUser.id)
        .maybeSingle();

      if (data) {
        dispatch(setProfile(data));
      } else {
        const defaultProfile = {
          id: activeUser.id,
          full_name: activeUser.email?.split('@')[0] || null,
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
    };

    const syncAuthState = async () => {
      const [{ data: { session } }, { data: { user: fetchedUser } }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.auth.getUser(),
      ]);

      const activeUser = session?.user ?? fetchedUser ?? null;
      dispatch(setUser(activeUser));
      await syncUserProfile(activeUser);
    };

    void syncAuthState();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void supabase.auth.getUser().then(({ data: { user: fetchedUser } }) => {
        const activeUser = session?.user ?? fetchedUser ?? null;
        dispatch(setUser(activeUser));
        void syncUserProfile(activeUser);
      });
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
