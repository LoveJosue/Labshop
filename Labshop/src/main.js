import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import {createRouter, createWebHistory} from 'vue-router'

import HomePage from './Home/HomePage.vue';
import ProductsPage from './Products/ProductsPage.vue';
import ProductDetail from './Products/ProductDetail/ProductDetail.vue';

import './assets/css/variables.css'
import './assets/css/index.css'
import 'primeicons/primeicons.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component:  HomePage },
        { path: '/products', component:  ProductsPage },
        { path: '/products/:id', component: ProductDetail }
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

