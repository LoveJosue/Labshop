<template>
  <div class="ctn">
        <div class="nav">
          <!-- <h4 class="logo"><router-link to="/">Labstore</router-link></h4> -->
           <div class="logo-ctn">
            <img class="logo" src="@/images/logo-1.svg" @click="goToHomePage"/>
            <img class="logo" src="@/images/logo-2.svg" @click="goToHomePage"/>
           </div>
          <ul class="links">
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/products">Produits</router-link></li>
            <li><router-link to="/about">À propos</router-link></li>
          </ul>
          <div class="icons">
            <img src="@/images/user-empty.svg">
            <img src="@/images/heart-empty.svg">
            <img v-if="isCartEmpty" src="@/images/shop-bag-empty.svg" @click="toggleCart()">
            <div v-else  class="full-shop-bag">
              <img src="@/images/shop-bag-full.svg" @click="toggleCart()">
              <div class="notif-icon">
                {{ itemsQtySum }}
              </div>
            </div>
            <img class="menu" src="@/images/menu.svg" alt="" @click="toggleSideBar()">
          </div>
        </div>
        
        
        <Cart v-if="isCardOpen" @close="isCardOpen = false"/>


        <div v-if="isSideBarVisible === true" class="side-bar">
          <ul @click="toggleSideBar()" class="side-bar-links">
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/products">Produits</router-link></li>
            <li><router-link to="/about">À propos</router-link></li>
          </ul>
          <svg class="w-6 h-6 text-gray-800 cursor-pointer" @click="toggleSideBar()" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
          </svg>
        </div>
        <div v-if="isSideBarVisible === true" class="overlay" @click="toggleSideBar()"></div>
    </div>
</template>

<script setup>
import Cart from './Cart.vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const ONE_SEC = 1000;

const router = useRouter();

const isCardOpen = ref(false);
const isSideBarVisible = ref(false);
const isCartEmpty = ref(true);
const itemsQtySum = ref(0);
let intervalID;

const screenWidth = ref(window.innerWidth);

const goToHomePage = () => {
  router.push('/')
}
const toggleCart = () => {
  isCardOpen.value = !isCardOpen.value;
}
const toggleSideBar = () => {
  isSideBarVisible.value = !isSideBarVisible.value;
}
const updateWidth = () => {
  const SM_SCREEN_WIDTH = 640;
  screenWidth.value = window.innerWidth;
  if (window.innerWidth > SM_SCREEN_WIDTH) {
    isSideBarVisible.value = false;
  }
};
const checkCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    isCartEmpty.value = cart.length === 0;
    !isCartEmpty.value && updateItemsQtySum(cart);
}
const updateItemsQtySum = (cart) => {
  let qtySum = 0;
  cart.forEach((item) => { qtySum += item.qte });
  itemsQtySum.value = qtySum;
}
onMounted(() => {
  window.addEventListener('resize', updateWidth);
  checkCart(); // Vérifie au montage
  intervalID = setInterval(checkCart, ONE_SEC); // Vérifie toutes les secondes
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
  clearInterval(intervalID);
});

</script>

<style scoped>
.ctn {
  position: sticky;
  font-size: smaller;
  font-weight: 300;
  top: 0%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Support pour safari */
  background: rgba(255, 255, 255, 0.8);
  margin: auto;
  color: #333;
  z-index: 2;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease-in-out, background 0.3s ease-in-out;
}
 .nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--website-max-width);
  width: var(--website-section-width);
  margin: 0 auto;
  height: 80px;
  }
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
.links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
  padding: 0;
}
.links li {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #333;
}
.links li:hover, .side-bar-links li:hover {
  color: black;
  transition: color 600ms ease;
}
.side-bar-links li:hover {
  text-decoration: underline;
}
.ctn a {
  color: inherit;
  text-decoration: none;
}
.icons {
  display: flex;
  align-items: center;
}
.icons img {
  width: 2rem;
  height: 1.2rem;
  cursor: pointer;
}
.icons .menu {
  display: none;
}
.full-shop-bag {
  position: relative;
}
.full-shop-bag .notif-icon {
  position: absolute;
  top: -8px;
  right: -8px;
  border: 1px solid black;
  width: 20px;
  height: 20px;
  background-color: black;
  border: transparent;
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 0 0 2px white;
}
.side-bar {
  position: absolute;
  top:0;
  right: 0;
  display: flex;
  justify-content: space-between;
  height: 100lvh;
  width: 70%;
  padding: 2rem;
  background-color: #fff;
  z-index: 1;
  transition: width 500ms ease;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100lvh;
  width: 100%;
  background-color: rgba(51, 51, 51, 0.8);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.side-bar + .overlay {
  opacity: 1;
  pointer-events: auto;
}
@media (max-width: 640px) {
  .links {
    display: none;
  }
  .icons .menu {
    display: block;
  }
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
  .icons > *:nth-child(2) {
    display: none;
  }
}
@media (max-width: 1000px) {

}
</style>