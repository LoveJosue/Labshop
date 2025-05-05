<template>
    <div class="ctn">
        <nav class="navbar">
          <h1 class="logo">LabStore</h1>
          <ul class="nav-links">
            <li><router-link to="/">Accueil <i class="pi pi-home"></i></router-link></li>
            <li><router-link to="/products">Produits</router-link></li>
            <div class="accountIcon">
              <i class="pi pi-bars" style="color: rgb(190, 187, 181); margin-left: 4px;"></i>
              <!-- <img src="@/images/user.png" alt="user_icon" class="user_icon"> -->
              <img v-if="connected" src="@/images/user.png" alt="user_icon" class="user_icon" @click="setConnexion">
              <img v-else src="@/images/josue_profil.jpg" alt="user_icon" class="user_icon" @click="setConnexion">
            </div>
          </ul>
        </nav>
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
    background: #007bff;
    color: white;
    padding: 1rem;
  }
 .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .nav-links {
    list-style: none;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .nav-links a {
    color: white;
    text-decoration: none;
  }

  .accountIcon:hover {
    box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 10px;
  }
  
  .accountIcon {
    background-color: white;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    gap: 0.8rem;
    display: flex;
    justify-content: center;
    width: 75px;
    height: 45px;
    padding: 1.2rem 2.4rem;
    align-items: center;
    cursor: pointer;
  }

  .accountIcon img {
    /* Empêche l'image de se redimensionner */
    flex-shrink: 0; 
  }

  .user_icon {
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 50%;
    object-fit: fill;
  }
  
  
</style>