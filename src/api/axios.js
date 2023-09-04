import axios from "axios";

//Urls for getting data from server
const BASE_URL = "https://cubitrix-node-server.onrender.com";
//const BASE_URL = "http://localhost:4000";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    credentials: true,
  },
  withCredentials: true,
  timeout: 30000,
});

export default instance;
