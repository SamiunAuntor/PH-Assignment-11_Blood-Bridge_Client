import axios from "axios";

// create instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || `https://blood-bridge-server-five.vercel.app`,
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;
