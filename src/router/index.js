import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadDocs from '@/layouts/uploadDocs/UploadDocs.vue'
import TaskCreation from '@/layouts/taskCreation/TaskCreation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TaskCreation
    },
    {
      path: '/uploadDoc',
      name: 'document-upload',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../layouts/uploadDocs/UploadDocs.vue')
    },
    {
      path: '/taskList',
      name: 'task-list',
      component:  () => import('../layouts/taskList/TaskList.vue')
    }
  ]
})

export default router
