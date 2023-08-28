import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosPrivate from '../api/axiosPrivate';
import useRefreshToken from './useRefreshToken';

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const dispatch = useDispatch();
    const access_token = useSelector(state => state.appState.access_token);

    useEffect(() => {
        const reqInterseptor = axiosPrivate.interceptors.request.use(
            request => {
                if (!request.headers['Access-Token']) {
                    request.headers['Access-Token'] = `Bearer ${access_token}`;
                }

                return request;
            },
            error => {
                return Promise.reject(error);
            }
        );
        
        const resInterseptor = axiosPrivate.interceptors.response.use(
            response => {
                return response;
            },
            async error => {
                const prev_request = error?.config;
                
                if (error?.response?.status === 403 && !prev_request?.sent) {
                    prev_request.sent = true;
                    const { data } = await refresh();
                    
                    prev_request.headers['Access-Token'] = `Bearer ${data.access_token}`;
                    return axiosPrivate(prev_request);
                }
                return Promise.reject(error);
            }
        );
        
        return () => {
            axiosPrivate.interceptors.request.eject(reqInterseptor);
            axiosPrivate.interceptors.response.eject(resInterseptor);
        }
    }, [dispatch, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;