
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';




const initialState: PostsState = { allposts: [], loading: false, error: null,};


let headers ={
  token:`${localStorage.getItem('userToken')}`
}

export const fetchPosts = createAsyncThunk('posts/fetchAllPosts', async () => {
  const response = await fetch('https://linked-posts.routemisr.com/posts?limit=100', {
    method: 'GET',
    headers: headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const data = await response.json();
  return data; 
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.allposts = action.payload.posts; 
      state.error = null;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? 'Failed to fetch posts';
    });
  },
});

export const postsReducer = postsSlice.reducer;
