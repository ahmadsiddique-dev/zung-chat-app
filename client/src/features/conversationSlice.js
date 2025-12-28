import { createSlice, } from "@reduxjs/toolkit"

const intialValue = {
    list : [],
    activeConversation : null,
    loading : false
}

const conversationSlice = createSlice(
    "conversation",
    intialValue,
    reducer
)