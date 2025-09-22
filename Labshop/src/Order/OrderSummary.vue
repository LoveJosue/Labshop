<template>
    <div class="ctn">
        <div class="order-summary" @click="toggleSummary">
            <div class="order-bg"></div>
            <p>
                Résumé d'achat
                <!-- Flèche SVG -->
                <svg
                    class="arrow"
                    :class="{ open: showSummary }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </p>            
            <p class="amout">{{ totalWithTVA.toLocaleString('fr-FR') }} FCFA</p>
        </div>
        <Transition :name="viewPortWidth < 1000 ? 'slide' : ''">
            <div v-if="showSummary || viewPortWidth >= 1000" class="summary-ctn">
                <div class="cart-content" :class="[hasOverflow ? borderPosition : '', { 'hide-scroll': !showScrollbar }]" ref="cartContent">
                    <div class="bg"></div>
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
                    <div v-if="hasOverflow && !isAtBottom" class="scroll-hint">
                        Faites défiler pour voir plus ↓
                    </div>
                </div>
                <!-- Bill summary-->
                <div class="bill-ctn">
                    <div class="bg"></div>
                    <div class="flex-element">
                        <p>Sous-total · <span>{{ itemsQtySum }}</span> article{{ itemsQtySum > 1 ? 's' : '' }}</p>
                        <p>{{ subTotal.toLocaleString('fr-FR') }} FCFA</p>
                    </div>
                    <div v-if="isExpedition" class="flex-element">
                        <p>Expédition</p>
                        <p>{{ shippingInfosAvailable ? `${expeditionCosts.toLocaleString('fr-FR')} FCFA` : 'Entrez une adresse de livraison' }}</p>
                    </div>
                    <div v-if="!isExpedition" class="flex-element">
                        <p>Récupération en boutique</p>
                        <p>GRATUIT</p>
                    </div>
                    <div v-if="!isExpedition" class="flex-element">
                        <p>Taxes</p>
                        <p>{{ TVA.toLocaleString('fr-FR') }} FCFA</p>
                    </div>
                    <div v-else-if="isExpedition && shippingInfosAvailable" class="flex-element">
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
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';

const props = defineProps({
    receptionType: {
        type: Number,
        default: 0
    }
})

const CART = 'cart';
const ONE = 1;

const cart = ref([]);
const borderPosition = ref('bottom');
const cartContent = ref(null);
const hasOverflow = ref(false);
const showScrollbar = ref(true);
const isAtBottom = ref(false);
const itemsQtySum = ref(0);
const showSummary = ref(false);
const viewPortWidth = ref(window.innerWidth);

const isExpedition = computed (() => {
    return props.receptionType === 0; // 0 -> Expédition 1 -> Cueillette
})
const shippingInfosAvailable = ref(false);

let scrollTimeout;
let hideTimeout;

const toggleSummary = () => showSummary.value = !showSummary.value;
const loadCart = () => JSON.parse(localStorage.getItem(CART)) || [];
const updateViewPortWidth = () => {
    viewPortWidth.value = window.innerWidth;
};
const calculateItemPrice = (item) => item.purchaseType === ONE ? (item.unitPrice * item.unitPerBox * item.qte) : item.unitPrice * item.qte;
const subTotal = computed(() => {
    let sum = 0;
    cart.value.forEach((item) => {
        sum+= calculateItemPrice(item);
    })
    return sum;
});
const TVA = computed(() => {
    let sum = 0;
    sum += subTotal.value;
    sum += isExpedition.value && expeditionCosts.value;
    return Math.ceil(sum * 0.18); // Arrondir à l'entier FCFA supérieur
});
const expeditionCosts = computed(() => {
    return Math.ceil(1000); // Arrondir à l'entier FCFA supérieur
})
// Quand c'est une livraison, le calcul du total avec TVA se fait après disponibilité des données de livraison
const totalWithTVA = computed(() => {
    let total = 0;
    total += subTotal.value;
    total += (isExpedition.value && shippingInfosAvailable.value) ? expeditionCosts.value : 0;
    total += (isExpedition.value && shippingInfosAvailable.value) ? TVA.value : 0;
    total += !isExpedition.value && TVA.value;
    return total;
});
const updateItemsQtySum = () => {
  let qtySum = 0;
  cart.value.forEach((item) => { qtySum += item.qte });
  itemsQtySum.value = qtySum;
};
function checkOverflow() {
  nextTick(() => {
    if (cartContent.value) {
      hasOverflow.value = 
        cartContent.value.scrollHeight > cartContent.value.clientHeight;
    }
  });
}
function handleScroll() {
  if (!cartContent.value) return;
  const el = cartContent.value;

  // afficher la scrollbar pendant le scroll
  showScrollbar.value = true;
  clearTimeout(hideTimeout);

  hideTimeout = setTimeout(() => {
    showScrollbar.value = false;
  }, 1000);

  // gestion des bordures et état bottom
  const atTop = el.scrollTop === 0;
  const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

  isAtBottom.value = atBottom;

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (atTop) borderPosition.value = 'bottom';
    else if (atBottom) borderPosition.value = 'top';
  }, 500);
}

onMounted(() => {
    cart.value = loadCart();
    checkOverflow();
    if (cartContent.value) {
        cartContent.value.addEventListener('scroll', handleScroll);
    }
    updateItemsQtySum();
    window.addEventListener('resize', updateViewPortWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateViewPortWidth);
})

</script>

<style scoped>
* {
  margin: 0;  
  padding: 0;
}
.ctn {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: space-between;
    letter-spacing: -0.01em;
}
.order-summary {
    display: none;
}
.summary-ctn {
    transition: .5s;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: space-between;
    letter-spacing: -0.01em;
    }
.cart-content {
    position: relative; /* pour que le hint se place dedans */
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
    .summary-ctn {
        transition: .5s;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: space-between;
        letter-spacing: -0.01em;
    }
    .ctn {
        gap: 1.2rem;
    }
    .cart-content {
        overflow-y:unset;
    }
    .scroll-hint {
        display: none;
    }
    .order-summary {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        /* height: 64px; */
        height: var(--order-sumary-box-height);
        /* border-bottom: 1px solid lightgray; */
        background-color: #F5F5F5;
    }
    .order-summary .arrow {
        margin-left: 8px;
        transition: transform 0.3s ease;
        display: inline-block;
        vertical-align: middle;
    }

    .order-summary .arrow.open {
        transform: rotate(180deg); /* flèche vers le haut */
    }
    .order-summary .amout {
        font-size: 19px;
        font-weight: 900;
        color: black;
    }
    .order-bg {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 100vw;
        height: 100%;
        background-color: #F5F5F5;
        z-index: -1;
    }
    .total-ctn {
        padding-bottom: 12px;
    }
    /* Styles  clés*/
    .bg {
        position: absolute;
        left: 50%;
        top: var(--order-sumary-box-height-minus-1-px);
        transform: translateX(-50%);
        width: 100vw;
        height: calc(100% - var(--order-sumary-box-height-minus-1-px));
        background-color:rgb(237, 237, 237);
        z-index: -1;
        /* border-top: 1px solid lightgray; */
    }
}
@media (min-width: 1001px) {
    .cart-content {
        max-height: 300px;
        overflow-y: auto;
        scrollbar-gutter: stable;
    }
    .cart-content::-webkit-scrollbar {
        position: absolute;
        width: 6px;
    }
    .cart-content::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
    }
    .cart-content.top {
        border-top: 1px solid lightgray;
    }
    .cart-content.bottom {
        /* border-bottom: 1px solid lightgray; */
    }
    .cart-content.hide-scroll::-webkit-scrollbar {
        display: none;
    }
    .cart-content.hide-scroll {
        scrollbar-width: none; /* Firefox */
    }
    .scroll-hint {
        position: sticky;       
        bottom: 8px;            
        display: inline-block;  
        align-self: center;     
        background: #ccc;
        color: #333;
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        pointer-events: none;
        white-space: nowrap;
    }
}
</style>