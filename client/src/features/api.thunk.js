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

// Fetch all conversations for the current user
export const fetchConversationsThunk = createAsyncThunk(
  "conversation/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.data.accessToken;

      const res = await axios.get(
        `${import.meta.env.VITE_B_API}/api/messages/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch conversations" });
    }
  }
);

// Fetch messages for a specific conversation
export const fetchMessagesThunk = createAsyncThunk(
  "conversation/fetchMessages",
  async (conversationId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.data.accessToken;

      const res = await axios.get(
        `${import.meta.env.VITE_B_API}/api/messages/conversations/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return {
        conversationId,
        messages: res.data.messages
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch messages" });
    }
  }
);

// Create a new conversation
export const createConversationThunk = createAsyncThunk(
  "conversation/create",
  async (memberId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.data.accessToken;

      const res = await axios.post(
        `${import.meta.env.VITE_B_API}/api/messages/conversations/create`,
        { memberId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to create conversation" });
    }
  }
);

// Fetch all users
export const fetchUsersThunk = createAsyncThunk(
  "users/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.data.accessToken;

      const res = await axios.get(
        `${import.meta.env.VITE_B_API}/api/auth/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return res.data.users;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch users" });
    }
  }
);

// Logout thunk
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_B_API}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Logout failed" });
    }
  }
);
