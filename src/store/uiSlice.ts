import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  drawerOpen: boolean;
  searchOpen: boolean;
}

const initialState: UIState = {
  drawerOpen: false,
  searchOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload;
    },
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
    },
  },
});

export const { setDrawerOpen, toggleDrawer, setSearchOpen } = uiSlice.actions;
export default uiSlice.reducer;
