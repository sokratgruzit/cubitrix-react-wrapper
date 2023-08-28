import axios from "../api/axios";
import { useDispatch } from "react-redux";

const REFRESH_URL = "api/accounts/refresh";

const useRefreshToken = () => {
    const dispatch = useDispatch();

    const refresh = async () => {
        const { data } = await axios.get(REFRESH_URL);

        dispatch({
            type: "SET_NEW_ACCESS_TOKEN",
            payload: data.access_token
        });
    };

    return refresh;
}

export default useRefreshToken;