import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			redirect: '/main',
		},
		{
			path: '/main',
			name: 'main',
			component: () => import('../views/Main.vue'),
		},
	],
})

export default router
