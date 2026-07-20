import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { store } from '@/store';
import { queryClient } from '@/lib/queryClient';
import { supabase, restoreSupabaseAuthSession, ensureUserProfile } from '@/lib/supabase';
import { setUser, setProfile, setAuthLoading } from '@/store/authSlice';
import { useBrowserNotifications } from '@/hooks/useBrowserNotifications';
import type { RootState } from '@/store';

import { routes } from './routes';

import type { User } from '@supabase/supabase-js';

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('full_name, phone, avatar_url, role, notifications_enabled, address, business_hours')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Profile fetch error:', error);
    return null;
  }
  return data;
};

const createDefaultProfile = async (currentUser: User) => {
  return ensureUserProfile(currentUser);
};

const AuthListener: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  useBrowserNotifications(user?.id);

  useEffect(() => {
    let isMounted = true;

    const applyAuthState = async (currentUser: User | null) => {
      if (!isMounted) return;

      if (!currentUser) {
        dispatch(setUser(null));
        dispatch(setProfile(null));
        dispatch(setAuthLoading(false));
        return;
      }

      const { user: validatedUser } = await restoreSupabaseAuthSession();
      const resolvedUser = validatedUser ?? currentUser;
      dispatch(setUser(resolvedUser));

      const profileData = await fetchProfile(resolvedUser.id);
      if (!isMounted) return;

      if (profileData) {
        dispatch(setProfile(profileData));
      } else {
        const createdProfile = await createDefaultProfile(resolvedUser);
        if (createdProfile) {
          dispatch(setProfile(createdProfile));
        }
      }

      dispatch(setAuthLoading(false));
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      if (!isMounted) return;
      void applyAuthState(currentUser);
    });

    const loadSessionAndProfile = async () => {
      try {
        const { user: currentUser } = await restoreSupabaseAuthSession();
        if (!isMounted) return;
        await applyAuthState(currentUser);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          dispatch(setUser(null));
          dispatch(setProfile(null));
          dispatch(setAuthLoading(false));
        }
      }
    };

    dispatch(setAuthLoading(true));
    void loadSessionAndProfile();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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
