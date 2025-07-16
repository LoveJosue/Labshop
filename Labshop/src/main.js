import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import {createRouter, createWebHistory} from 'vue-router'

import './assets/css/variables.css'
import './assets/css/index.css'
import 'primeicons/primeicons.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component:  () => import ('./Home/HomePage.vue') },
        { path: '/products', component:  () => import ('./Products/ProductsPage.vue') },
        { path: '/products/:id', component: () => import ('./Products/ProductDetail/ProductDetail.vue') }
    ]
})
const app = createApp(App)
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark'
        }
    }
})
app.mount('#app')

