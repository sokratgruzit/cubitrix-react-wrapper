import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers = {
    "Content-Type": "application/json",
    credentials: true
};

export default axios;