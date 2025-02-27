import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import API_URL from '../../utils/config';

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      return response.data; // assuming { message: "Doctor registered successfully" }
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      // Return the user data sent from the backend
      return { user: response.data.user || { name: email.split('@')[0], email } };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/auth/logout`,
        { withCredentials: true }
      );
      return response.data; // expecting { message: "Logout successful" }
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchUserProfile',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(
          `${API_URL}/api/auth/profile`,
          { withCredentials: true }
        );
        return response.data.user;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Registration
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });


    //profile
    builder.addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      });
      builder.addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
