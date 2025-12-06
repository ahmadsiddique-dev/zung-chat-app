import mongoose from "mongoose";
import customError from "./customError.js";

const dbConnetion = async () =>  {
    try {
        await mongoose.connect(`${process.env.DB_URI}/chatapp`)
    } catch (error) {
        throw new customError(error.message, 501);
    }
}

export default dbConnetion;