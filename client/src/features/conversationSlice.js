import { createSlice } from "@reduxjs/toolkit"
import { fetchConversationsThunk, fetchMessagesThunk, createConversationThunk, fetchUsersThunk } from "./api.thunk";

const initialValue = {
    list : [],
    activeConversation : null,
    loading : false,
    messages: {}, // Store messages by conversation ID
    users: [],
    usersLoading: false
}

const conversationSlice = createSlice({
    name: "conversation",
    initialState: initialValue,
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        addConversation: (state, action) => {
            state.list.push(action.payload);
        },
        setConversations: (state, action) => {
            state.list = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }
            state.messages[conversationId].push(message);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch conversations
            .addCase(fetchConversationsThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || [];
            })
            .addCase(fetchConversationsThunk.rejected, (state) => {
                state.loading = false;
            })
            // Fetch messages
            .addCase(fetchMessagesThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { conversationId, messages } = action.payload;
                state.messages[conversationId] = messages || [];
            })
            .addCase(fetchMessagesThunk.rejected, (state) => {
                state.loading = false;
            })
            // Create conversation
            .addCase(createConversationThunk.fulfilled, (state, action) => {
                const exists = state.list.find(c => c._id === action.payload._id);
                if (!exists) {
                    state.list.unshift(action.payload);
                }
                state.activeConversation = action.payload;
            })
            // Fetch users
            .addCase(fetchUsersThunk.pending, (state) => {
                state.usersLoading = true;
            })
            .addCase(fetchUsersThunk.fulfilled, (state, action) => {
                state.usersLoading = false;
                state.users = action.payload || [];
            })
            .addCase(fetchUsersThunk.rejected, (state) => {
                state.usersLoading = false;
            });
    }
})

export const { setActiveConversation, addConversation, setConversations, setLoading, addMessage } = conversationSlice.actions;
export default conversationSlice.reducer;