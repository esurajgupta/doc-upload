import endpoints from "../endpoints"
import { httpClient } from "../interceptor"

export const getUserList = async (callback) => {
    await httpClient.get(endpoints.getUserlistURL).then((res) => {
        console.log(res);
        callback(res.data);
    }).catch((err) => {
        console.log(err, "error");
        callback(err);
    })

};

export const getWorkflowList = async (callback) => {
    await httpClient.get(endpoints.getworkflowtypeURL).then((res) => {
        console.log(res);
        callback(res.data)
    }).catch((err) => {
        console.log(err, "error");
        callback(err)
    })
};

export const createNewTask = async (payload, callback) => {
    await httpClient.post(endpoints.createTaskURL, payload).then((res) => {
        console.log(res);
        callback(res.data)
    }).catch((err) => {
        console.log(err, "error");
        callback(err)
    })
};

export const fetchTaskDocuments = async (id, callback) => {
    await httpClient.get(endpoints.fetchDocsLinkedWithTask + id).then((res) => {
        console.log(res);
        callback(res.data)
    }).catch((err) => {
        console.log(err, "error");
        callback(err)
    })
}

export const createTaskInERP = async (payload, callback) => {
    await httpClient.post(endpoints.createERPWorkflow, payload).then((res) => {
        console.log(res);
        callback(res.data)
    }).catch((err) => {
        console.log(err, "error");
        callback(err)
    })
};