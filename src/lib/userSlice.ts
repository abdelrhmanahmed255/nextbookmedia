import { createAsyncThunk, createSlice , PayloadAction } from "@reduxjs/toolkit";

export const signUpUser = createAsyncThunk(
  'userSlice/signUpUser',
  async (formData : User) => {
    try {
      let response = await fetch('https://linked-posts.routemisr.com/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      let data = await response.json();
      console.log('Data received from server:', data);
      return data;
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
);

const userSignUpState: User = {
  name: "",
  email: "",
  password: "",
  rePassword: "",
  dateOfBirth: "",
  gender: "",
  
};

const userSignUpSlice = createSlice({
  name: 'userSignUpSlice',
  initialState:userSignUpState,
  reducers: {
    resetSignUpForm: (state) => {
      Object.assign(state, userSignUpState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.fulfilled, (state:any, action) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.rePassword = action.payload.rePassword;
        state.dateOfBirth = action.payload.dateOfBirth;
        state.gender = action.payload.gender;
        state.error = null;  
      })
      .addCase(signUpUser.rejected, (state, action:any ) => {
        state.error = action.payload.error; 
      });
  }
});
export const signInUser = createAsyncThunk(
  'userSlice/signInUser',
  async (formData : User ) => {
    try {
      let response = await fetch('https://linked-posts.routemisr.com/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to sign In');
      }
      let data = await response.json();
      localStorage.setItem('userToken',data.token)
      return data;
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
);

let userLoginState: UserLoginState = {
  email: "",
  password: "",
};

const userSignInSlice = createSlice({
  name: 'userSignInSlice',
  initialState:userLoginState,
  reducers: {
    resetLoginForm: (state) => {
      Object.assign(state, userLoginState); 
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.error = null;  
      })
      .addCase(signInUser.rejected, (state, action:any) => {
        if (action.payload) {
          state.error = action.payload.error; 
        } else {
          state.error = "Unknown error occurred"; 
        }
      });
  }
});

export const { resetSignUpForm } = userSignUpSlice.actions;
export const { resetLoginForm } = userSignInSlice.actions;

export const userSignUpReducer = userSignUpSlice.reducer;
export const userSignInReducer = userSignInSlice.reducer;
