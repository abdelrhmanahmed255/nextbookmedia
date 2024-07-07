import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { userSignInReducer, userSignUpReducer } from './userSlice';
import { postsReducer } from './postsSlice';
import { userPostsReducer } from './userPostsSlice';
import { userProfileReducer } from './userProfileSlice';
import { userCommentsReducer } from './commentSlice';

export const store = configureStore({
  reducer: {
    userSignUp: userSignUpReducer,
    userSignIn: userSignInReducer,
    auth: authReducer,
    posts: postsReducer,
    userProfile: userProfileReducer,
    userPosts: userPostsReducer,
    userComments:userCommentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
