<template>
    <div class="cart">
        <div class="cart-header">
            <h4>Panier</h4>
            <svg @click="$emit('close')" class="w-6 h-6 text-gray-800 cursor-pointer" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
        </div>

        <div class="cart-content">
            <p class="empty">Votre panier est vide.</p>
        </div>
    </div>
    <div class="overlay" @click="$emit('close')"></div>

</template>

<script setup>
import { onMounted } from 'vue';


onMounted(() => {
    loadCart();
});
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart.length > 0) {
        return cart;
    } else {
        alert('Le panier est vide');
        return [];
    }
}

</script>

<style scoped>

.cart {
    position: absolute;
    top:0;
    right: 0;
    display: flex;
    flex-direction: column;
    height: 100lvh;
    width: var(--cartWidth);
    padding: 2rem;
    background-color: #fff;
    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
    z-index: 1;
}
.cart > * {
    padding: 0.5rem 0;
}
.cart-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.cart h4 {
    font-weight: lighter;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100lvh;
  width: calc(100% - var(--cartWidth));
  background-color: rgba(51, 51, 51, 0.62);
  transition: opacity 0.4s ease;
}
.empty {
    font-size: 1rem;
    font-weight: lighter;
    color: gray;
}
 /* Sur petits écrans */
@media(max-width: 549px) {
    .cart {
        width: 100%;
    }
    .overlay {
        display: none;
    }
}
</style>