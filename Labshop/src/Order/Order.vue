<template>
    <div class="color"></div>
        <div class="main">
            <div class="left">1</div>
            <div class="right">2</div>
        </div>
</template>

<script setup>
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
})
</script>

<style scoped>
.color {
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
    /* grid-template-columns: 7fr 6fr; */
    grid-template-columns: 1fr 1fr;
    height: 100%;
}
.left {
    height: 100lvh;
    border-right: 1px solid lightgray;
}
.right {
    background-color: rgb(237, 237, 237);
}
@media (max-width: 1000px) {
    .main {
        grid-template-columns: 1fr;
    }
}
</style>