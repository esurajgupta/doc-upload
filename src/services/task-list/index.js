import endpoints from "../endpoints"
import { httpClient } from "../interceptor"

export const getAlfrescoTaskList = async (callback) => {
    await httpClient.get(endpoints.getActiveTaskList, {
        auth: {
            username: localStorage.getItem("userName"),
            password: 'admin'
        },
    }).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
};

export const approveDocument = async (payload, callback) => {
    await httpClient.put(endpoints.documentApproveURL + `${payload.taskId}?select=state`, payload.payload, {
        auth: {
            username: localStorage.getItem("userName"),
            password: 'admin'
        }
    }).then((res) => {
        callback(res);
    }).catch((err) => {
        callback(err);
    })
};

export const fetchDBTaskList = async (callback) => {
    await httpClient.get(endpoints.getTasklistURL).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
};


export const onApproveDocument = async (payload, callback) => {
    await httpClient.post(endpoints.updateERPWorkflow, payload).then((res) => {
        callback(res?.data);
    }).catch((err) => {
        callback(err);
    })
}

export const getTaskForInstance = async (payload, callback) => {
    await httpClient.get(endpoints.getTaskByInstanceID).then((res) => {
        console.log(res?.data);
        const response = res?.data.find((item) => item?.processInstanceId === payload);
        console.log(payload, response);

        callback(response);
    }).catch((err) => {
        callback(err);
    })
}