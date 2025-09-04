<template>
    <div class="back-color"></div>
        <div class="main">
            <div class="left"></div>
            <div class="right grid-row-1-position">
                <OrderSummary />
            </div>
        </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OrderSummary from './OrderSummary.vue';
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
.back-color {
    top: 71px;
    right: 0;
    position: absolute;
    width: 50%;
    height: calc(100%);
    background-color: rgb(237, 237, 237);
    z-index: -1;
}
.main {
    width: 75%;
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
}
.left {
    height: 100lvh;
    border-right: 1px solid lightgray;
    padding: 2.5rem 2.5rem 2.5rem 0;
}
.right {
    background-color: rgb(237, 237, 237);
    padding:2.5rem 0 2.5rem 2.5rem;
}
@media (max-width: 1000px) {
    .main {
        grid-template-columns: 1fr;
    }
    .back-color {
        display: none;
    }
    .left {
        border-right: none;
    }
    .right {
        padding: 0;
    }
    .main {
        display: grid;
        grid-row: 1fr;
        grid-template-rows: auto;
    }
    .grid-row-1-position {
        grid-row-start: 1;
    }
}
</style>