import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadDocs from '@/layouts/uploadDocs/UploadDocs.vue'
import TaskCreation from '@/layouts/taskCreation/TaskCreation.vue'
import Landing from '@/components/landing/Landing.vue'
import TaskList from '@/layouts/taskList/TaskList.vue'
import WorkflowList from '@/layouts/workflow/WorkflowList.vue'

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
              label: "CreateWorkflow",
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
              label: "UploadDocument",
              route: "/translanding/uploadDocument"
            }]
          }
        },
        {
          path: 'taskList',
          name: 'taskList',
          component: TaskList,
          meta: {
            breadcrumb: [{
              label: "TaskList"
            }, {
              label: "TaskList",
              route: "/translanding/taskList"
            }]
          }
        },
        {
          path: 'workflowlist',
          name: 'workflowlist',
          component: WorkflowList,
          meta: {
            breadcrumb: [{
              label: "WorkflowList"
            }, {
              label: "WorkflowList",
              route: "/translanding/workflowList"
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
