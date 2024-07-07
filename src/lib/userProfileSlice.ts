'use client';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';



const initialState: UserProfileState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
    'userProfile/fetchUserProfile',
    async (token: string) => {
      try {
        const response = await fetch('https://linked-posts.routemisr.com/users/profile-data', {
          method: 'GET',
          headers: {
            'token': token,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user profile data');
        }
  
        const data = await response.json();
        return data.user;
      } catch (error:any) {
        throw new Error(error.message);
      }
    }
  ); 
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user profile data';
      });
  },
});

export const { } = userProfileSlice.actions;

export let userProfileReducer= userProfileSlice.reducer;
