<template>
    <div class="main">
        <div class="left">
            <OrderForm v-model:shippingInfos="shippingInfos" @receptionTypeChanged="updateReceptionType"/>
        </div>
        <div class="right grid-row-1-position">
            <div class="wrap">
                <!-- <OrderSummary v-model:shippingInfos="shippingInfos" :receptionType="receptionType" /> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OrderForm from './OrderForm.vue';
import OrderSummary from './OrderSummary.vue';

const router = useRouter();

const receptionType = ref(0);
const shippingInfos = ref({});

const isCartEmpty = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length === 0;
}
function updateReceptionType(value) {
    receptionType.value = value;
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
    border-top: 1px solid lightgray;
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
        border-top: none;
    }
    .left {
        border-right: none;
        padding: 0;
        padding-top: 1rem;
    }
    .right {
        padding: 0;
        /* border-top: 1px solid lightgray; */
    }
    .grid-row-1-position {
        grid-row-start: 1;
    }
    .left, .right {
        padding-left: 5%;
        padding-right: 5%;
    }
}
@media (min-width: 1001px) {
    .left {
        padding-left: 2.5rem; 
        padding-right: 2.5rem;
    }
    .right {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
    }
    .nav {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
    }
}
</style>