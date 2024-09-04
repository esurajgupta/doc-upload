import endpoints from "../endpoints";
import { httpClient } from "../interceptor";

export const getUserTaskHistory = async (callback) => {
    await httpClient.get(endpoints.userTaskHistory).then((res) => {
        callback(res.data)
    }).catch((err) => {
        callback(err);
    })
};

export const getUserTasks = async (callback) => {
    await httpClient.get(endpoints.getUserTasks).then((res) => {
        callback(res.data)
    }).catch((err) => {
        callback(err);
    })
};

export const getEventList = async (callback) => {
    await httpClient.get(endpoints.evenntlist).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
}

export const fetchSingleInstance = async (id, callback) => {
    await httpClient.get(endpoints.getSingleInstanceById + "/" + id).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
}

export const fetchSingleInstanceForUsertasks = async (id, callback) => {
    await httpClient.get(endpoints.getSingleInstancefortasksById + "/" + id).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
}

export const fetchSingleWorkflowVersion = async (callback) => {
    await httpClient.get(endpoints.getSingleWorkFlowById).then((res) => {
        callback(res.data);
    }).catch((err) => {
        callback(err);
    })
}