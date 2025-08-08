<template>
    <div class="ctn">
        <div class="nav">
          <h4 class="logo">Labstore</h4>
          <ul class="links">
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/products">Produits</router-link></li>
            <li><router-link to="/about">À propos</router-link></li>
          </ul>
          <div class="icons">
            <img src="@/images/user-empty.svg">
            <img src="@/images/heart-empty.svg">
            <img src="@/images/shop-bag-empty.svg">
          </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const connected = ref(true);
const setConnexion = () => {
  connected.value = !connected.value;
  // alert("Changed!");
  setTimeout(() => {
    connected.value = !connected.value;
  }, 5000);
}

</script>

<style scoped>
.ctn {
  position: sticky;
  top: 0%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Support pour safari */
  background: rgba(255, 255, 255, 0.8);
  margin: auto;
  color :black;
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
  }
  .links a {
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
</style>