import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ content, postId, token }) => {
    try {
      const response = await fetch('https://linked-posts.routemisr.com/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ content, post: postId })
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      throw new Error('Failed to create comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content, token }) => {
    try {
      const response = await fetch(`https://linked-posts.routemisr.com/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      throw new Error('Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ commentId, token }) => {
    try {
      const response = await fetch(`https://linked-posts.routemisr.com/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      return { commentId };
    } catch (error) {
      throw new Error('Failed to delete comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload); 
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to create comment';
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        state.comments = state.comments.map(comment =>
          comment._id === updatedComment._id ? updatedComment : comment
        );
        state.loading = false;
        state.error = null;
      })
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to update comment';
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedCommentId = action.payload.commentId;
        state.comments = state.comments.filter(comment => comment._id !== deletedCommentId);
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to delete comment';
      });
  }
});



export let userCommentsReducer = commentsSlice.reducer;
