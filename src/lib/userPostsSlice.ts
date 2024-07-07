import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchUserPosts = createAsyncThunk(
  'userPosts/fetchUserPosts',
  async ({ userId, limit }) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`https://linked-posts.routemisr.com/users/${userId}/posts?limit=${limit}`, {
      method: 'GET',
      headers: {
        'token': token,
      },
    });
    const data = await response.json();
    return data.posts;
  }
);

export const createPost = createAsyncThunk(
  'userPosts/createPost',
  async ({ body, photoFile }) => {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('body', body);
    formData.append('image', photoFile);

    const response = await fetch('https://linked-posts.routemisr.com/posts', {
      method: 'POST',
      headers: {
        'token': token,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  }
);

export const updatePost = createAsyncThunk(
  'userPosts/updatePost',
  async ({ postId, body, photoFile }) => {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('body', body);
    if (photoFile) {
      formData.append('image', photoFile);
    }

    const response = await fetch(`https://linked-posts.routemisr.com/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'token': token,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  }
);

export const deletePost = createAsyncThunk(
  'userPosts/deletePost',
  async ({ postId }) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`https://linked-posts.routemisr.com/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'token': token,
      },
    });

    return { postId };
  }
);

const userPostsSlice = createSlice({
  name: 'userPosts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload.postId);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const userPostsReducer = userPostsSlice.reducer;
