<template>
    <div class="ctn">
        <div class="nav">
            <div class="logo-ctn">
            <img class="logo" src="@/images/logo-1.svg" @click="goToHomePage"/>
            <img class="logo" src="@/images/logo-2.svg" @click="goToHomePage"/>
           </div>
           <img src="@/images/shop-bag-full.svg" @click="toggleCart()">
        </div>
        <Cart v-if="isCardOpen" @close="isCardOpen = false"/>
    </div>
</template>

<script setup>
import Cart from './Cart.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();
const isCardOpen = ref(false);

const toggleCart = () => {
  isCardOpen.value = !isCardOpen.value;
}
const goToHomePage = () => {
  router.push('/');
}
</script>

<style scoped>
.ctn {
    position: relative;
    width: 100%;
    top: 0%;
    font-size: smaller;
    font-weight: 300;
    background: #fff;
    z-index: 10;
    color: #333;
}
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    height: 70px;
    padding: 0 2.5rem;
}
/* .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 75%;
    max-width: 1000px;
    margin: 0 auto;
    height: 70px;

    
} */
.logo-ctn {
    height: 100%;
    width: 120px;
    display: flex;
    align-items: center;
}
.logo-ctn .logo:first-child {
    height: 100%;
    width: auto;
    object-fit: contain;
}
.logo-ctn img {
    cursor: pointer;
}
.logo-ctn .logo:last-child {
    display: none;
}
.nav img {
  width: 2rem;
  height: 1.2rem;
  cursor: pointer;
}
@media (max-width: 640px) {
    .nav {
        height: 60px;
    }
    .logo-ctn .logo:first-child {
        display: none;
    }
    .logo-ctn .logo:last-child {
        display: block;
        width: auto;
        object-fit: contain;
        width: 25px;
        height: 25px;
    }
}
@media (max-width: 1000px) {
    .nav {
        width: 100%;
        max-width: none;
        margin: 0;
        height: 60px;
        padding-left: 5%;
        padding-right: 5%;
    }
    
}
</style>