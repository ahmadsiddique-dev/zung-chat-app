import { configureStore } from "@reduxjs/toolkit"
import userSlice  from "../features/userSlice.js"
import conversationSlice from "../features/conversationSlice.js"

export const userStore = configureStore({
    reducer : {
        user : userSlice,
        conversation : conversationSlice
    }
})