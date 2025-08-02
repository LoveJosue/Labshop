<template>
    <div class="elem">
        <img :src="product.imgsUrl[0]" alt="" @click="photoClicked(imgsUrl[0])">
        <div>
            <h1>{{ product.name }}</h1>
            <p>{{ product.unitPerBox }} {{ product.unitType }}{{ product.unitPerBox > 1 ? 's' : ''  }} / carton</p>
            <p><u>Tarifs</u></p>
            <ul>
                <li>Détail : {{ getRetailPrice() }} F/{{ product.unitType }}</li>
                <li>Gros : {{ getWholesalePriceRange()}} F/{{ product.unitType }}</li>
            </ul>
            <div class="actions">
                <button class="btn-1" @click="seeDetails">Voir</button>
                <button class="btn-2">Ajouter au panier</button>
            </div>
            <!-- <p class="pi pi-heart"></p> -->
        </div>
    </div>
</template>

<style>
 .elem {
    display: grid;
    grid-template-columns: 1fr 2fr;
    column-gap: 2rem;
    background: #ffffff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    align-items: center;
    max-width: 900px;
    margin: auto;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.elem:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}
.elem img {
    display: block;
    max-width: 100%;
    height: 200px;
    object-fit: contain;
    mix-blend-mode: multiply;
}
.elem h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}
.elem p {
    margin: 0.25rem 0;
    color: #555;
}
.elem ul {
    padding-left: 5%;
    list-style-type: none;
}
.elem ul li {
    margin-bottom: 0.25rem;
}
.elem .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}
.elem button {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    height: 100%;
}
.elem .btn-1 {
    background: #1a1a1a;
    color: #fff;
}
.elem .btn-2 {
    background: #f0f0f0;
    color: #333;
}
.elem button:hover {
    transform: scale(1.03);
}
.elem .btn-2:hover {
    background-color: #e2e2e2;
}

@media(max-width: 768px) {
    .elem {
        grid-template-columns: 1fr;
        text-align: center;
    }
    .elem .actions {
        flex-direction: column;
        align-items: center;
    }
    .elem img {
        margin: 0 auto 1rem
    }
    .elem ul {
        padding-left: 0;
        list-style-type: none; 
    }
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
            infos: [],
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
const seeDetails = () => {router.push(`products/${props.product._id}`)};
const getRetailPrice = () => {
    return props.product.priceList[props.product.priceList.length-1].unitPrice.toLocaleString('fr-FR');
}
const getWholesalePriceRange = () => {
    const priceList = props.product.priceList;
    const firstPricing = priceList[0];
    const beforeLastPricing = priceList[priceList.length - 2];
    if(firstPricing.unitPrice === beforeLastPricing.unitPrice) {
        return `${firstPricing.unitPrice.toLocaleString('fr-FR')}`;
    }
    return `${firstPricing.unitPrice.toLocaleString('fr-FR')} - ${beforeLastPricing.unitPrice.toLocaleString('fr-FR')}`;
}
</script>
