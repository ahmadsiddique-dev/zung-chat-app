import axios from "axios"
import { userStore } from "../store/user.js"


export const api = axios.create({
    baseURL : `${import.meta.env.VITE_B_API}`,
    withCredentials : true
})

api.interceptors.request.use((config) => {
    const state = userStore.getState();
    const token = state?.user?.data?.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})