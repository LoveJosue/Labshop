<template>
    <!-- <div class="card" @click="seeDetails">
         <img :src="images[0]" alt="" @click="photoClicked(imgUrl)">
        
         <div class="productInfos">
             <div style="display: flex; justify-content: space-between;">
                <p>{{ parseFloat(prix).toFixed(0) }} fcfa</p>
                <p class="pi pi-heart"></p>
            </div>
            <p>{{ nom }}</p>
         </div>
        
    </div> -->
    <div class="elem" @click="seeDetails">
        <img :src="images[0]" alt="" @click="photoClicked(imgUrl)">
        <div>
            <h1>EDTA Tube</h1>
            <p>12 palettes / carton</p>
            <p>Tarifs</p>
            <ul>
                <li>Prix de détail 3 500F/unité</li>
                <li>Prix de gros 2 500F/unité </li>
            </ul>
            <div class="actions">
                <button class="btn-1">Acheter maintenant</button>
                <button class="btn-2">Ajouter au panier</button>
            </div>
        </div>
    </div>
</template>

<style>
.elem{
    display: grid;
    grid-template-columns: 1fr 2fr;
    column-gap: 1.5rem;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.elem img {
    display: block;
    height: 200px;
    cursor: pointer;
    object-fit: contain;
    mix-blend-mode: multiply;
    cursor: pointer;
    object-fit: contain;
}
.elem .actions {
    display: flex;
    gap: 1rem;
}
.elem button {
    all:inherit;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.elem .btn-1 {
    background: black;
    color: white;
}


</style>


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

