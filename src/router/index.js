import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadDocs from '@/layouts/uploadDocs/UploadDocs.vue'
import TaskCreation from '@/layouts/taskCreation/TaskCreation.vue'
import Landing from '@/components/landing/Landing.vue'
import TaskList from '@/layouts/taskList/TaskList.vue'
import WorkflowList from '@/layouts/workflow/WorkflowList.vue'
import MyFiles from '@/layouts/myFiles/MyFiles.vue'
import ErpTaskList from '@/layouts/taskList/ErpTaskList.vue'

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
        // },
        {
          path: 'workflowlist',
          name: 'workflowlist',
          component: ErpTaskList,
          meta: {
            breadcrumb: [{
              label: "Workflow List"
            }, {
              label: "Workflow List",
              route: "/translanding/workflowList"
            }]
          }
        },
        // {
        //   path:'ErpTaskList',
        //   component: ErpTaskList,
        //   meta: {
        //     breadcrumb: [{
        //       label: "ErpTaskList"
        //     }, {
        //       label: "Erp Task List",
        //       route: "/translanding/ErpTaskList"
        //     }]
        //   }
        // },
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
