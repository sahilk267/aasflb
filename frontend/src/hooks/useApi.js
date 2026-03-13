import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCallback, useMemo } from 'react';

const useApi = () => {
    const { logout } = useAuth();

    const request = useCallback(async (config) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
            }
            throw error;
        }
    }, [logout]);

    return useMemo(() => ({
        get: (url, config) => request({ ...config, method: 'GET', url }),
        post: (url, data, config) => request({ ...config, method: 'POST', url, data }),
        put: (url, data, config) => request({ ...config, method: 'PUT', url, data }),
        delete: (url, config) => request({ ...config, method: 'DELETE', url }),
    }), [request]);
};

export default useApi;
