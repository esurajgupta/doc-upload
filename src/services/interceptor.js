import axios from 'axios';

let config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const httpClient = axios.create(config);

httpClient.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
httpClient.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response.status === 401 || error.response.status === '401' || error.response.status === '403' || error.response.status === 403) {
            localStorage.clear();
        }
        else{
            return error.response;
        }
        return Promise.reject(error);
    }
);

export {httpClient};
