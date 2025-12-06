import { configureStore } from "@reduxjs/toolkit"
import userSlice  from "../features/userSlice.js"

export const userStore = configureStore({
    reducer : {
        user : userSlice
    }
})