import axios from "axios";

import {decryptEnv} from "../utils/decryptEnv";

const backUrl = decryptEnv(process.env.REACT_APP_BACKEND_URL);

const instance = axios.create({
  baseURL: backUrl,
  headers: {
    "Content-Type": "application/json",
    credentials: true,
  },
  withCredentials: true,
  timeout: 30000,
});

export default instance;
