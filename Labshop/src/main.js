import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import {createRouter, createWebHistory} from 'vue-router';
import VueTelInput from 'vue3-tel-input'


import HomePage from './Home/HomePage.vue';
import ProductsPage from './Products/ProductsPage.vue';
import ProductDetail from './Products/ProductDetail/ProductDetail.vue';
import Order from './Order/Order.vue';
import OrderState from './Order/OrderState.vue';
import About from './Components/About.vue';
import NotFound from './Components/NotFound.vue';

import './assets/css/variables.css'
import './assets/css/index.css'
import 'primeicons/primeicons.css'
import 'vue3-tel-input/dist/vue3-tel-input.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component:  HomePage },
        { path: '/about', component: About},
        { path: '/products', component:  ProductsPage },
        { path: '/products/:id', component: ProductDetail },
        { path: '/order', name: 'order', component: Order },
        { path: '/checkOrder/:orderNumber', component: OrderState },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
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
});
app.use(VueTelInput, {
  mode: 'international',
  onlyCountries: [],
  autoDefaultCountry: true,
  inputOptions: {
    showDialCode: false,
  },
})
app.mount('#app')

