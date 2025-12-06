import axios from "axios"


export const api = axios.create({
    baseURL : `${import.meta.env.B_API}`,
    withCredentials : true
})

api.interceptors.request.use((config) => {
    const token = token;
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
})