<template>
  <div class="ctn">
        <div class="nav">
          <h4 class="logo"><router-link to="/">Labstore</router-link></h4>
          <ul class="links">
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/products">Produits</router-link></li>
            <li><router-link to="/about">À propos</router-link></li>
          </ul>
          <div class="icons">
            <img src="@/images/user-empty.svg">
            <img src="@/images/heart-empty.svg">
            <img src="@/images/shop-bag-empty.svg">
            <img class="menu" src="@/images/menu.svg" alt="" @click="toggleSideBar()">
          </div>
        </div>
        <div v-if="sideBarVisible === true" class="side-bar">
          <ul @click="toggleSideBar()" class="side-bar-links">
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/products">Produits</router-link></li>
            <li><router-link to="/about">À propos</router-link></li>
          </ul>
          <svg class="w-6 h-6 text-gray-800 cursor-pointer" @click="toggleSideBar()" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
          </svg>
        </div>
        <div v-if="sideBarVisible === true" class="overlay" @click="toggleSideBar()"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const sideBarVisible = ref(false);
const toggleSideBar = () => {
  sideBarVisible.value = !sideBarVisible.value;
}
const screenWidth = ref(window.innerWidth);

const updateWidth = () => {
  const SM_SCREEN_WIDTH = 640;
  screenWidth.value = window.innerWidth;
  if (window.innerWidth > SM_SCREEN_WIDTH) {
    sideBarVisible.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
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
  /* color :rgb(102, 97, 97); */
  color: #333;
  z-index: 2;
  /* Ombre douce et étalée */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  /* Petite bordure fine pour mieux détacher du fond */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease-in-out, background 0.3s ease-in-out;
}
 .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1300px;
    width: 95%;
    margin: 0 auto;
    height: 70px;
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
}
</style>