import axios from "axios";

const api = axios.create({
  baseURL: "https://100014.pythonanywhere.com/",
});

export default api;
