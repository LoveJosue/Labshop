<template>
  <Header></Header>
  <div class="section">
    <h1>Voici les produits que nous proposons</h1>
    <Filter @sortPriceAsc="onSortPriceAsc"
            @sortPriceDesc="onSortPriceDesc"/>
    
    <div class="container">

      <div v-if="productsResult && productsResult.length > 0">
        <Produit v-for="p in productsResult" 
                      @imgClicked="gererClickPhoto"
                      :nom="p.nom" 
                      :images="p.images" 
        :prix="p.prix"/>
      </div>
      <div v-else>
        <p>Il n'y a pas de produits dans la BD</p>
      </div>
  
      
    </div>
  </div>
  <Footer></Footer>
  
</template>



<script setup>
import { ref } from "vue"
import { onMounted } from "vue";
import Produit from './Produit.vue'
// import { produits } from '../utils';
import axios from "axios";
import Filter from "./Filter.vue";
import "../../scss/custom.scss"
import Header from "@/Components/Header.vue";
import Footer from "@/Components/Footer.vue";

import { apiUrl } from '@/config';

let produits = [];
let productsResult = ref(produits)

const gererClickPhoto = (message) => {
  // Aller sur une page qui affiche en détail la description du produit
}

const onSortPriceAsc = () => {
  productsResult.value = productsResult.value.toSorted((a,b) => a.prix < b.prix ? -1 : 1)
}
const onSortPriceDesc = () => {
  productsResult.value = productsResult.value.toSorted((a,b) => a.prix > b.prix ? -1 : 1)
}

onMounted(() => {
  axios.get(`${apiUrl}/products`)
    .then(res => {
      productsResult.value = res.data;
    })
    .catch(error => {
      console.log(error);
    })
});


</script>



<style>
h1 {
  text-align: center;
}

.section {
  text-align: center;
  padding: 2rem;
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.a {
  border: 1px solid black;
}
</style>