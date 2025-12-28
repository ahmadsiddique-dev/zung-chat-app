import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { accessThunk, logoutThunk } from "./api.thunk";

export const userLoginThunk = createAsyncThunk("user/login", async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_B_API}/api/auth/login`, data, {
    withCredentials : true
  });

  return res.data;
});

export const userSignupThunk = createAsyncThunk("user/signup", async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_B_API}/api/auth/signup`, data, {withCredentials : true})

  return res.data;
});

const initialValue = {
  data : {
  _id: null,
  userName: null,
  email: null,
  accessToken : null
  },
  status : {
    loading: false,
    auth : false,
    logLoadingBtn : false,
    signLoadingBtn : false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  extraReducers: (builder) => {
    builder

      // For login

      .addCase(userLoginThunk.pending, (state, action) => {
        state.status.logLoadingBtn = true
      })
      .addCase(userLoginThunk.fulfilled, (state, action) => {
        state.status.logLoadingBtn = false
        state.data = {
          _id: action.payload._id,
          userName: action.payload.userName,
          email: action.payload.email,
          accessToken: action.payload.accessToken
        };
        state.status.auth = true;
        state.status.loading = false;
      })
      .addCase(userLoginThunk.rejected, (state, action) => {
        state.status.logLoadingBtn = false
      })

      // For sign up

      .addCase(userSignupThunk.pending, (state, action) => {
        state.status.signLoadingBtn = true
      })
      .addCase(userSignupThunk.fulfilled, (state, action) => {
        state.status.signLoadingBtn = false
        state.data = {
          _id: action.payload._id,
          userName: action.payload.userName,
          email: action.payload.email,
          accessToken: action.payload.accessToken
        };
        state.status.auth = true;
        state.status.loading = false;
      })
      .addCase(userSignupThunk.rejected, (state, action) => {
        state.status.signLoadingBtn = false
      })

      // For Refreshing Tokens

      .addCase(accessThunk.pending, (state, action) => {
        state.status.loading = true
      })
      .addCase(accessThunk.fulfilled, (state, action) => {
        state.data = {...state.data, ...action.payload}
        state.status.loading = false
        state.status.auth = true
      })
      .addCase(accessThunk.rejected, (state, action) => {
        state.status.loading = false
      })
      
      // For logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.data = {
          userName: null,
          email: null,
          accessToken: null
        };
        state.status.auth = false;
        state.status.loading = false;
      });
  },
});

export const { login, signup } = userSlice.actions;
export default userSlice.reducer;
