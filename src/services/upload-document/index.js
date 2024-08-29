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
        callback(response);
    }).catch((err) => {
        callback(err);
    })
}

export const createNewProcess = async (payload, callback) => {
    await httpClient.post(endpoints.createProcessInstance, payload, {
        auth: {
            username: 'admin',
            password: 'admin'
        }
    }).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
}

export const assignDocToProcess = async (payload, callback) => {
    await httpClient.post(endpoints.aassignDocToProcess + `${payload.taskId}/items`, {
        id: payload.id
    }, {
        auth: {
            username: 'admin',
            password: 'admin'
        }
    }).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
};


export const uploadDocsInfoToDB = async (payload, callback) => {
    await httpClient.post(endpoints.uploadDocumentDetails, payload).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
}