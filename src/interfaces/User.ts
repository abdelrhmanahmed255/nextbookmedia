
interface User {
    name?: string;
    email?: string;
    password?: string;
    rePassword?: string;
    dateOfBirth?: string;
    gender?: string;
    error?: string;
  }
  
  interface UserSignUpState {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
    error?: string | null;
  }
  
  interface UserLoginState {
    email: string;
    password: string;
    error?: string | null;
  }
  interface Post {
    _id: string;
    body: string;
    image: string;
    user: User;
    createdAt: string;
    comments: Comment[];
  }
  
  interface PostsState {
    allposts: Post[];
    loading: boolean;
    error: string | null;
  }
  interface Post {
    id: string;
    body: string;
    photoUrl: string;
  
  }
  
  interface UserPostsState {
    posts: Post[];
    loading: boolean;
    error: string | null;
  }
  interface UserProfileState {
    userInfo:  null;
    loading: boolean;
    error: string | null;
  }