<template>
    <div class="main">
        <div class="left">
            <OrderForm />
        </div>
        <div class="right grid-row-1-position">
            <div class="wrap">
                <OrderSummary />
            </div>
        </div>
    </div>
</template>

<script setup>
import OrderForm from './OrderForm.vue';
import OrderSummary from './OrderSummary.vue';

import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isCartEmpty = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length === 0;
}
onMounted(() => {
    // Si le panier est vide, revenir à la page d'accueil
    isCartEmpty() && router.replace('/');
});
</script>

<style scoped>
.ctn {
    position: relative;
    width: 100%;
}
.main::before {
    content: "";
    position: fixed;
    top: 0;
    right: 0;
    width: 50vw;
    height: 100vh;
    background-color: var(--orderPageBackBgColor);
    z-index: -1;
    border-left: 1px solid lightgray;
 }
.main {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
}
.left {
    height: 100lvh;
    padding: 2.5rem 2.5rem 2.5rem 0;
}
.right {
    padding:2.5rem 0 2.5rem 2.5rem;
}
.wrap {
    position: sticky;
    top: 40px;
    background-color: var(--orderPageBackBgColor);
}
@media (max-width: 1000px) {
    .main::before {
        display: none;
        content: none;
    }
    .main {
        grid-template-columns: 1fr;
        width: 100%;
        padding: 0 5%;
        
    }
    .left {
        border-right: none;
        padding: 0;
        padding-top: 1rem;
    }
    .right {
        padding: 0;
    }
    .grid-row-1-position {
        grid-row-start: 1;
    }
}
</style>