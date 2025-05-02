<template>
    <div class="produit" @click="seeDetails">
         <img :src="images[0]" alt="" @click="photoClicked(imgUrl)">
        
         <div class="productInfos">
             <div style="display: flex; justify-content: space-between;">
                <p>{{ parseFloat(prix).toFixed(0) }} fcfa</p>
                <p class="pi pi-heart"></p>
            </div>
            <p>{{ nom }}</p>
         </div>
        
    </div>
</template>


<script setup>

import { useRouter } from 'vue-router';


const props = defineProps({
    nom: String,
    images: Array,
    prix: Number
})

const emit = defineEmits(['imgClicked']);
const photoClicked = (imgUrl) => {
    emit('imgClicked', imgUrl)
}

const router = useRouter();
const seeDetails = () => {
    router.push('/productDetail')
}

</script>

<style>
.produit {
    padding: 0 0 1px;
    width: 250px;
    border: 2px solid rgba(227, 221, 221, 0.468);;
    border-radius: 1px;
}

.produit img {
  width: 100%;
  position: relative;
  height: 200px;
  cursor: pointer;
  transform: translateX(-50%);
  left: 50%;
  object-fit: contain;
  mix-blend-mode: multiply;
  border-bottom: 1px solid black;
}

.productInfos {
    line-height: 1.0;
    margin: 0 10px;
}
</style>