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

// Async thunk to get OTP
export const handleGetOtp = createAsyncThunk(
  'auth/sendOTP',
  async({email}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/send-otp`,
        {email},
        { withCredentials: true}
      );
      return {user: response.data.otp}
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
)

// Async thunk to verify-OTP
export const handleVerifyOtp = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      return {
        tempToken: response.data.tempToken,
        message: response.data.message,
      };
    } catch (error) {
      console.error("OTP verification error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to verify OTP.");
    }
  }
);


// Async thunk to reset password
export const handleResetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ tempToken, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/reset-password`,
        { tempToken, newPassword },
        { withCredentials: true }
      );

      return { message: response.data.message };
    } catch (error) {
      console.error("Password reset error:", error);
      return rejectWithValue(error.response?.data?.message || "Failed to reset password.");
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


      // Send OTP
    builder.addCase(handleGetOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.otpSent = action.payload.otpSent;
    });
    builder.addCase(handleGetOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Verify OTP
    builder.addCase(handleVerifyOtp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleVerifyOtp.fulfilled, (state, action) => {
      state.loading = false;
      state.tempToken = action.payload.tempToken;
    });
    builder.addCase(handleVerifyOtp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reset Password
    builder.addCase(handleResetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleResetPassword.fulfilled, (state) => {
      state.loading = false;
      state.tempToken = null; // Clear tempToken after reset
    });
    builder.addCase(handleResetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
      
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
