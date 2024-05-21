import axios from "axios";

const loginAxiosInstance = axios.create({
    baseURL: "https://100014.pythonanywhere.com/api"
})


export const getUserInfoFromLogin = async (session_id) => {
    return await loginAxiosInstance.post("/userinfo/", { 
        session_id 
    })
};
