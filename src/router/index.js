import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadDocs from '@/layouts/uploadDocs/UploadDocs.vue'
import TaskCreation from '@/layouts/taskCreation/TaskCreation.vue'
import Landing from '@/components/landing/Landing.vue'
import TaskList from '@/layouts/taskList/TaskList.vue'
import WorkflowList from '@/layouts/workflow/WorkflowList.vue'
import MyFiles from '@/layouts/myFiles/MyFiles.vue'
import ErpTaskList from '@/layouts/taskList/ErpTaskList.vue'
import InstanceList from '@/layouts/instanceList/InstanceList.vue'
import MyTasks from '@/layouts/myTasks/MyTasks.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/translanding', component: Landing,
      children: [
        {
          path: 'createWorkflow',
          name: 'createWorkflow',
          component: TaskCreation,
          meta: {
            breadcrumb: [{
              label: "CreateWorkflow"
            }, {
              label: "Request",
              route: "/translanding/createWorkflow"
            }]
          }
        },
        {
          path: 'uploadDocument',
          name: 'uploadDocument',
          component: UploadDocs,
          meta: {
            breadcrumb: [{
              label: "UploadDocuement"
            }, {
              label: "Upload Document",
              route: "/translanding/uploadDocument"
            }]
          }
        },
        // {
        //   path: 'taskList',
        //   name: 'taskList',
        //   component: TaskList,
        //   meta: {
        //     breadcrumb: [{
        //       label: "TaskList"
        //     }, {
        //       label: "Task List",
        //       route: "/translanding/taskList"
        //     }]
        //   }
        // },ErpTaskList
        {
          path: 'workflowlist',
          name: 'workflowlist',
          component: InstanceList,
          meta: {
            breadcrumb: [{
              label: "Workflow List"
            }, {
              label: "Running Instances",
              route: "/translanding/workflowList"
            }]
          }
        },
        {
          path: 'myFiles',
          name: 'myFiles',
          component: MyFiles,
          meta: {
            breadcrumb: [{
              label: "MyFiles"
            }, {
              label: "My Files",
              route: "/translanding/myFiles"
            }]
          }
        },
        {
          path: 'myTasks',
          name: 'myTasks',
          component: MyTasks,
          meta: {
            breadcrumb: [{
              label: "myTasks"
            }, {
              label: "My Tasks",
              route: "/translanding/myTasks"
            }]
          }
        },
        {
          path: 'instance',
          name: 'Instance',
          component: InstanceList,
          meta: {
            breadcrumb: [{
              label: "Instance"
            }, {
              label: "Instance",
              route: "/translanding/instance"
            }]
          }
        },
        { path: "", redirect: '/translanding/workflowList' }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../layouts/login/Login.vue')
    },
    { path: "", redirect: "/login" }
  ]
})

export default router
