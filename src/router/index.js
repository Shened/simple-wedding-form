import { createRouter, createWebHistory } from 'vue-router'
import ConviteView from '../views/ConviteView.vue'
import AdminView from '../views/AdminView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: ConviteView },
        { path: '/admin', component: AdminView }
    ]
})

export default router