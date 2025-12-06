import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const accessThunk = createAsyncThunk(
  "auth/accessToken",
  async (_, {getState, rejectWithValue}) => {
    try {

      const state = getState(); 
      const token = state.user.data.accessToken;

      const res = await axios.get(
        `${import.meta.env.VITE_B_API}/api/auth/refresh`,
        {
          headers: {
            Authorization : `Bearer ${token}`,
          }, 
          withCredentials : true  
        }
      );
      return res.data; 
    } catch (error) {
      return rejectWithValue({code: 401, message: "Unauthorized"});
    }
  }
);

