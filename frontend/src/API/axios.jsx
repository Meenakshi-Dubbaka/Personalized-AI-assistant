import axios from "axios";


export const clientServer=axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
});