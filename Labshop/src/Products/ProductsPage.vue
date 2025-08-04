<template>
    <!-- <Filter @sortPriceAsc="onSortPriceAsc"
            @sortPriceDesc="onSortPriceDesc"/> -->
      <div v-if="productsResult && productsResult.length > 0" class="grid">
        <h1 class="grid-title">Nos produits</h1>
        <!-- <Filter 
            class="filter" 
            @sortPriceAsc="onSortPriceAsc"
            @sortPriceDesc="onSortPriceDesc"/> -->
        <!-- <Produit 
            v-for="p in productsResult" 
            @imgClicked="gererClickPhoto"
            :nom="p.name" 
            :images="p.imgsUrl"/> -->
        <Produit 
            v-for="p in productsResult" 
            :key="p._id"
            :product="p"/>
      </div>
      <div v-else>
        <p>Chargement ...</p>
      </div>
</template>



<script setup>
import { ref } from "vue"
import { onMounted } from "vue";
import Produit from './Produit.vue'
import axios from "axios";
import Filter from "./Filter.vue";
import "../../scss/custom.scss"
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

onMounted(async () => {
  axios.get(`${apiUrl}/products`)
  .then(res => {
    if (res.data) {
      productsResult.value = res.data;
    }
    })
    .catch(error => {
      console.log(error);
    })
});


</script>



<style>
.grid {
  display: grid;
  grid-template-columns: 1fr;
  max-width: 1200px;
  margin: 0 auto;
  gap: 1.5rem;
}

.grid-title {
  margin: 1.5rem 0 0;
  /* border: 1px solid red; */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid h1 {
    grid-column: 1 / 3;
  }
  .filter {
    grid-column: 1 / 3;
  }
}
</style>