import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { accessThunk } from "./api.thunk";

export const userLoginThunk = createAsyncThunk("user/login", async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_B_API}/api/auth/login`, data, {
    withCredentials : true
  });

  return res.data;
});

export const userSignupThunk = createAsyncThunk("user/signup", async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_B_API}/api/auth/signup`, {data}, {withCredentials : true})

  return res.data;
});

const initialValue = {
  data : {
  userName: null,
  email: null,
  password: null,
  accessToken : null
  },
  status : {
    loading: true,
    auth : false
  },
};

const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    login: (state, action) => {},
    signup: (state, action) => {
      console.log(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // For login
      .addCase(userLoginThunk.pending, (state, action) => {
        console.log("pending");
      })
      .addCase(userLoginThunk.fulfilled, (state, action) => {
        console.log(action.payload)
      })
      .addCase(userLoginThunk.rejected, (state, action) => {
        console.log("rejected");
      })

      // For sign up

      .addCase(userSignupThunk.pending, (state, action) => {
        console.log("pending");
      })
      .addCase(userSignupThunk.fulfilled, (state, action) => {
        state.data = {...state.data, ...action.payload}
      })
      .addCase(userSignupThunk.rejected, (state, action) => {
        console.log("rejected");
      })

      // For Refreshing Tokens

      .addCase(accessThunk.pending, (state, action) => {
        console.log("pending accesss");
      })
      .addCase(accessThunk.fulfilled, (state, action) => {
        state.data = {...state.data, ...action.payload}
        state.status.loading = false
        state.status.auth = true
      })
      .addCase(accessThunk.rejected, (state, action) => {
        state.status.loading = false
      });
  },
});

export const { login, signup } = userSlice.actions;
export default userSlice.reducer;
