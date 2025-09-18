<!-- 
    MENTION IMPORTANTE !!
    1 - CE COMPOSANT DÉRIVE DU COMPOSANT "OrderSummary.vue"
    2 - TOUTE MODIFICATION D'ORDRE FONCTIONNELLE CONCERNANT LES DONNÉES EFFECTUÉE 
        DANS LE COMPOSANT MAIRE DOIT S'EFFECTUER ICI ÉGALEMENT ET VICE-VERSA
    3 - CE N'EST STRICTEMENT QUE LE STYLE D'AFFICHAGE QUI PEUT DIFFÉRER
    4 - CETTE SYMÉTRIE FONCTIONNELLE EST ÉTABLIE JUSQU'À NOUVELLE ORDRE
 -->

<template>
    <div class="ctn">
        <div class="summary-ctn">
            <Transition name="slide">
                <div v-if="props.showSummary || cartHasOneItem" class="cart-content">
                    <div v-for="item in cart" :key="item.productId" class="cart-item">
                        <!-- Image produit -->
                        <div class="item-img-box">
                            <img :src="item.imgUrl" :alt="item.name" />
                            <div class="notif-icon">
                                {{ item.qte }}
                            </div>
                        </div>
                        <div class="item-details">
                            <div class="item-infos">
                                <div class="chld-1">
                                    <span class="item-name">{{ item.name }}</span>
                                    <span class="item-type">
                                        En {{ item.purchaseType === ONE ? 'gros' : 'détail' }}
                                    </span>
                                </div>
                            </div>
                            <p class="item-price">
                                {{ calculateItemPrice(item).toLocaleString('fr-FR') }} FCFA
                            </p>
                        </div>
                    </div>
                </div>
            </Transition>
            <!-- Bill summary-->
            <div class="bill-ctn">
                <div class="flex-element">
                    <p>Sous-total · <span>{{ itemsQtySum }}</span> article{{ itemsQtySum > 1 ? 's' : '' }}</p>
                    <p>{{ subTotal.toLocaleString('fr-FR') }} FCFA</p>
                </div>
                <div class="flex-element">
                    <p>Récupération en boutique</p>
                    <p>GRATUIT</p>
                </div class="flex-element">
                <div class="flex-element">
                    <p>Taxes</p>
                    <p>{{ TVA.toLocaleString('fr-FR') }} FCFA</p>
                </div>
            </div>
            <!-- Purchase total -->
            <div class="total-ctn">
                <p>Total</p>
                <div class="total-amout gap-x-2">
                    <p class="currenty">XOF</p>
                    <p class="value">{{ totalWithTVA.toLocaleString('fr-FR') }} FCFA</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
const props = defineProps({
    showSummary: {
        type: Boolean,
        default: false
    }
})

const CART = 'cart';
const ONE = 1;
const cart = ref([]);

const itemsQtySum = ref(0);

const loadCart = () => JSON.parse(localStorage.getItem(CART)) || [];
const cartHasOneItem = computed(() => cart.value.length === 1);
const calculateItemPrice = (item) => item.purchaseType === ONE ? (item.unitPrice * item.unitPerBox * item.qte) : item.unitPrice * item.qte;
const subTotal = computed(() => {
    let sum = 0;
    cart.value.forEach((item) => {
        sum+= calculateItemPrice(item);
    })
    return sum;
});
const TVA = computed(() => {
    return Math.ceil(subTotal.value * 0.18); // Arrondir à l'entier FCFA supérieur
});
const totalWithTVA = computed(() => {
    return subTotal.value + TVA.value;
});
const updateItemsQtySum = () => {
  let qtySum = 0;
  cart.value.forEach((item) => { qtySum += item.qte });
  itemsQtySum.value = qtySum;
};

onMounted(() => {
    cart.value = loadCart();
    updateItemsQtySum();
});

</script>

<style scoped>
* {
  margin: 0;  
  padding: 0;
}
.summary-ctn {
    transition: .5s;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
    letter-spacing: -0.01em;
}
.cart-content {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    justify-content: flex-start;
    box-sizing: content-box;
    padding-right: 0;
    padding-top: 10px;
}
.cart-item {
    display: grid;
    grid-template-columns: 64px auto;
    gap: 0.75rem;
    overflow: visible;
}
.item-img-box {
    position: relative;
    overflow: visible;
}
.cart-item img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    padding: 1.2rem 0.01rem 0.01rem 0.01rem;
    mix-blend-mode: multiply;
}
.notif-icon {
    position: absolute;
    top: 0px;      
    right: 0px;    
    width: 30%;
    height: 30%;
    min-width: 18px;
    min-height: 18px;
    background-color: rgba(0, 0, 0, 0.672);
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transform: translate(50%, -50%);
    
}
.item-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
    align-items: center;
}
.item-infos .chld-1 {
    display: flex;
    flex-direction: column;
    word-break: break-word;   /* coupe les mots longs */
    overflow-wrap: anywhere;  /* force à passer à la ligne */
}
.item-name {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.item-infos {
  flex: 1;
  min-width: 0;
}
.item-type, .item-qte {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.56);
}
.item-price {
    font-weight: 450;
    font-size: 14px;
    text-align: right;
    letter-spacing: -0.01em;
    color: rgb(0, 0, 0);
}
.bill-ctn {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    font-size: 14px;
}
.flex-element {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.total-ctn {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 19px;
    font-weight: 900;
    color: black;
}
.total-ctn .currenty {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.56);
    height: fit-content;
    transform: translateY(12.5%);
    font-weight: lighter;
}
.total-ctn .total-amout {
    display: flex;
    flex-direction: row;
    align-items: center;
}
.total-amout .value {
    align-content: start;
    align-content: start;
    height: 100%;
}
@media (max-width: 1000px) {
    .slide-enter-active,
    .slide-leave-active {
        transition: max-height 0.4s ease, opacity 0.3s ease;
        overflow: hidden;
    }
    .slide-enter-from, 
    .slide-leave-to {
        opacity: 0;
        max-height: 0;
    }
    .slide-enter-to,
    .slide-leave-from {
        max-height: 2000px;
        opacity: 1;
    }
}
</style>