import endpoints from "../endpoints"
import { httpClient } from "../interceptor"


export const getTokenForUser = async (payload, callback) => {

    await httpClient.get(endpoints.getTokenForSpecifiedUser, {
        params: {
            u: payload.userName,
            pw: payload.password
        }
    }).then((response) => {
        callback(response.data)
    }).catch((err) => {
        callback(err)
    })
};

export const uploadDocuments = async (params = {}, payload, callback) => {
    await httpClient.post(endpoints.uploadDocuments, payload, {
        params: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((response) => {
        callback(response.data);
    }).catch((err) => {
        callback(err);
    })
}