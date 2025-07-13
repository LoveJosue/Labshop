<template>
    <div class="elem" @click="seeDetails">
        <img :src="product.imgsUrl[0]" alt="" @click="photoClicked(imgsUrl[0])">
        <div>
            <h1>{{ product.name }}</h1>
            <p>{{ product.unitPerBox }} {{ product.unitType }}{{ product.unitPerBox > 1 ? 's' : ''  }} / carton</p>
            <p><u>Tarifs</u></p>
            <ul>
                <li>Prix de détail {{ getRetailPrice() }} F/unité</li>
                <li>Prix de gros : {{ getWholesalePriceRange()}} F/unité</li>
            </ul>
            <div class="actions">
                <button class="btn-1">Acheter</button>
                <button class="btn-2">Ajouter au panier</button>
            </div>
            <!-- <p class="pi pi-heart"></p> -->
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
const router = useRouter();
const props = defineProps({
    product: {
        type: Object,
        required: true,
        default: () => ({
            name: '',
            material: '',
            capacity: {
                volume: 0,
                unit: ''
            },
            unitType: '',
            qtyPerUnit: 0,
            unitPerBox: 0,
            category: '',
            imgsUrl: [],
            priceList: [],
            stock: {
                totalUnits: 0,
                wholesaleReserve: 0,
                retailReserve: 0
            },
            dateAdded: ''
        })
    }
})

const emit = defineEmits(['imgClicked']);
const photoClicked = (imgUrl) => { emit('imgClicked', imgUrl)}
const seeDetails = () => {router.push('/productDetail')}
const getRetailPrice = () => { 
    return props.product.priceList[props.product.priceList.length-1].unitPrice.toLocaleString('fr-FR');
}
const getWholesalePriceRange = () => {
    const priceList = props.product.priceList;
    const firstPricing = priceList[0];
    const beforeLastPricing = priceList[priceList.length - 2];
    return `${firstPricing.unitPrice.toLocaleString('fr-FR')} - ${beforeLastPricing.unitPrice.toLocaleString('fr-FR')}`;
}
</script>
