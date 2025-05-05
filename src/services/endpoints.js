const baseURL = '/baseURL'
const alfrescoURL = '/alfrescoURL'

const endpoints = {
  getUserlistURL: '/api/v1/user',
  getworkflowtypeURL: '/api/v1/workFlow',
  createTaskURL: '/api/v1/task',
  getTasklistURL: '/api/v1/fetchTask',
  uploadDocuments: '/alfresco/api/-default-/public/alfresco/versions/1/nodes/-my-/children',
  getTokenForSpecifiedUser: '/alfresco/s/api/login',
  getDocuments: '/alfresco/api/-default-/public/alfresco/versions/1/nodes/-my-/children',
  deleteDocument: '/alfresco/api/-default-/public/alfresco/versions/1/nodes',
  deleteDocumentHistory: '/alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes',
  restoreDocument: '/alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes',

  createProcessInstance: '/alfresco/api/-default-/public/workflow/versions/1/processes',
  aassignDocToProcess: '/alfresco/api/-default-/public/workflow/versions/1/processes/',
  getAlfrescoTaskListURL: '/alfresco/api/-default-/public/workflow/versions/1/tasks',
  documentApproveURL: '/alfresco/api/-default-/public/workflow/versions/1/tasks/',
  uploadDocumentDetails: '/api/v1/uploadDocument',
  fetchDocsLinkedWithTask: '/api/v1/fetchDocument/',
  getActiveTaskList: '/alfresco/api/-default-/public/workflow/versions/1/tasks?state=completed',
  createERPWorkflow: '/api/workflowApis/initiateWorkflow',
  updateERPWorkflow: '/api/workflowApis/updateTask',
  erpTaskList: '/api/processInstances',
  getTaskByInstanceID: '/api/user-tasks',
  erpTaskHistory: '/api/processInstanceHistories',
  updateInstanceData: '/api/workflowApis/updateInstanceData',
  versions: '/alfresco/api/-default-/public/alfresco/versions/1/nodes',
  getFileUsingVersion: '/alfresco/api/-default-/public/alfresco/versions/1/nodes',
  userTaskHistory: '/api/user-task-histories',
  evenntlist: '/api/events',
  getSingleInstanceById: '/api/processInstance-histories',
  getSingleWorkFlowById: '/api/workflow-versions',
  getUserTasks: '/api/user-tasks',
  getSingleInstancefortasksById: '/api/process-instances'
}

export default endpoints
