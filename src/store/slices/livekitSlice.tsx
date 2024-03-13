import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LivekitState {
  tokenLivekit: string | null;
}

const initialState: LivekitState = {
  tokenLivekit: null,
};

export const livekitSlice = createSlice({
  name: 'livekit',
  initialState,
  reducers: {
    setTokenLivekit: (state, action: PayloadAction<string | null>) => {
      state.tokenLivekit = action.payload;
    },
  },
});

export const { setTokenLivekit } = livekitSlice.actions;

export default livekitSlice.reducer;