import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadDocs from '@/layouts/uploadDocs/UploadDocs.vue'
import TaskCreation from '@/layouts/taskCreation/TaskCreation.vue'
import Landing from '@/components/landing/Landing.vue'
import TaskList from '@/layouts/taskList/TaskList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/translanding', component: Landing,
      children: [
        {
          path: 'createTask',
          name: 'createTask',
          component: TaskCreation,
          meta: {
            breadcrumb: [{
              label: "CreateTask"
            }, {
              label: "CreateTask",
              route: "/translanding/createTask"
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
              label: "taskList"
            }, {
              label: "taskList",
              route: "/translanding/taskList"
            }]
          }
        },
        { path: "", redirect: '/translanding/taskList' }
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
