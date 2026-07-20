import { createClient, type Session, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
  },
});

export async function restoreSupabaseAuthSession(): Promise<{ user: User | null; session: Session | null }> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  if (!session?.user) {
    return { user: null, session: null };
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.warn('Supabase auth getUser warning:', userError.message);
      return { user: session.user, session };
    }

    return { user: userData?.user ?? session.user, session };
  } catch (error) {
    console.warn('Supabase auth getUser failed:', error);
    return { user: session.user, session };
  }
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, full_name, phone, avatar_url, role, notifications_enabled, address, business_hours')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Profile fetch error:', error);
    return null;
  }

  return data;
}

export async function ensureUserProfile(currentUser: User) {
  const existingProfile = await fetchUserProfile(currentUser.id);
  if (existingProfile) {
    return existingProfile;
  }

  const metadata = currentUser.user_metadata || {};
  const defaultProfile = {
    id: currentUser.id,
    full_name: metadata.full_name || metadata.name || currentUser.email?.split('@')[0] || null,
    phone: metadata.phone || null,
    avatar_url: metadata.avatar_url || metadata.picture || null,
    role: 'user',
    notifications_enabled: false,
    address: null,
    business_hours: null,
  };

  const { error: upsertError } = await supabase.from('user_profiles').upsert(defaultProfile, { onConflict: 'id' });
  if (upsertError) {
    console.warn('Profile upsert error:', upsertError);
    return null;
  }

  return defaultProfile;
}
