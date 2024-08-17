import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import FirebaseService from 'services/FirebaseService';

export const initialState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  token: localStorage.getItem(AUTH_TOKEN) || null,
  userUID: localStorage.getItem('userUID') || null,
};

// Async action for sign-in
export const signIn = createAsyncThunk('auth/signIn', async (data, { rejectWithValue }) => {
  const { email, password } = data;
  try {
    const response = await FirebaseService.signInEmailRequest(email, password);
    if (response.user) {
      const token = response.user.refreshToken;
      const userUID = response.user.uid;
      localStorage.setItem(AUTH_TOKEN, token);
      localStorage.setItem('userUID', userUID); // Save userUID to local storage
      return { token, userUID }; // Return token and UID
    } else {
      return rejectWithValue(response.message?.replace('Firebase: ', ''));
    }
  } catch (err) {
    return rejectWithValue(err.message || 'Error');
  }
});

// Async action for sign-up
export const signUp = createAsyncThunk('auth/signUp', async (data, { rejectWithValue }) => {
  const { email, password } = data;
  try {
    const response = await FirebaseService.signUpEmailRequest(email, password);
    if (response.user) {
      const token = response.user.refreshToken;
      const userUID = response.user.uid;
      localStorage.setItem(AUTH_TOKEN, token);
      localStorage.setItem('userUID', userUID); // Save userUID to local storage
      return { token, userUID }; // Return token and UID
    } else {
      return rejectWithValue(response.message?.replace('Firebase: ', ''));
    }
  } catch (err) {
    return rejectWithValue(err.message || 'Error');
  }
});

// Async action for sign-out
export const signOut = createAsyncThunk('auth/signOut', async () => {
  const response = await FirebaseService.signOutRequest();
  localStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem('userUID');
  return response.data;
});

// Async action for Google sign-in
export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
  try {
    const response = await FirebaseService.signInGoogleRequest();
    if (response.user) {
      const token = response.user.refreshToken;
      const userUID = response.user.uid;
      localStorage.setItem(AUTH_TOKEN, token);
      localStorage.setItem('userUID', userUID); // Save userUID to local storage
      return { token, userUID }; // Return token and UID
    } else {
      return rejectWithValue(response.message?.replace('Firebase: ', ''));
    }
  } catch (err) {
    return rejectWithValue(err.message || 'Error');
  }
});

// Async action for Facebook sign-in
export const signInWithFacebook = createAsyncThunk('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
  try {
    const response = await FirebaseService.signInFacebookRequest();
    if (response.user) {
      const token = response.user.refreshToken;
      const userUID = response.user.uid;
      localStorage.setItem(AUTH_TOKEN, token);
      localStorage.setItem('userUID', userUID); // Save userUID to local storage
      return { token, userUID }; // Return token and UID
    } else {
      return rejectWithValue(response.message?.replace('Firebase: ', ''));
    }
  } catch (err) {
    return rejectWithValue(err.message || 'Error');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.loading = false;
      state.redirect = '/';
      state.token = action.payload.token;
      state.userUID = action.payload.userUID; // Set user UID
    },
    showAuthMessage: (state, action) => {
      state.message = action.payload;
      state.showMessage = true;
      state.loading = false;
    },
    hideAuthMessage: (state) => {
      state.message = '';
      state.showMessage = false;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.token = null;
      state.userUID = null; // Reset userUID
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem('userUID');
      state.redirect = '/';
    },
    showLoading: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.userUID = action.payload.userUID; // Set user UID
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.redirect = '/';
        state.token = action.payload.token;
        state.userUID = action.payload.userUID; // Set user UID
      })
      .addCase(signIn.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.userUID = null; // Reset userUID
        state.redirect = '/';
      })
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.userUID = null; // Reset userUID
        state.redirect = '/';
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.redirect = '/';
        state.token = action.payload.token;
        state.userUID = action.payload.userUID; // Set user UID
      })
      .addCase(signUp.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.redirect = '/';
        state.token = action.payload.token;
        state.userUID = action.payload.userUID; // Set user UID
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      })
      .addCase(signInWithFacebook.pending, (state) => {
        state.loading = true;
      })
      .addCase(signInWithFacebook.fulfilled, (state, action) => {
        state.loading = false;
        state.redirect = '/';
        state.token = action.payload.token;
        state.userUID = action.payload.userUID; // Set user UID
      })
      .addCase(signInWithFacebook.rejected, (state, action) => {
        state.message = action.payload;
        state.showMessage = true;
        state.loading = false;
      });
  },
});

export const {
  authenticated,
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  showLoading,
  signInSuccess
} = authSlice.actions;

export default authSlice.reducer;
