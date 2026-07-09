import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

interface Profile {
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  notifications_enabled: boolean;
  address: string | null;
  business_hours: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
    },
  },
});

export const { setUser, setProfile, setAuthLoading, logout } = authSlice.actions;
export default authSlice.reducer;
