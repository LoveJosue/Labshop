<template>
    <!-- {{ calculateItemPrice(item).toLocaleString('fr-FR') }} FCFA -->
    <!-- <span class="item-qte">
        Qté : {{ item.qte }} {{ getPackaging(item) }}
    </span> -->
    <div class="ctn">
        <div class="order-summary">
            <p>Résumé d'achat</p>
            <p class="amout">{{ totalWithTVA.toLocaleString('fr-FR') }} FCFA</p>
        </div>
        <div class="cart-content" :class="[hasOverflow ? borderPosition : '', { 'hide-scroll': !showScrollbar }]" ref="cartContent">
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
                                Achat en {{ item.purchaseType === ONE ? 'gros' : 'détail' }}
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
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const CART = 'cart';
const ONE = 1;
const cart = ref([]);
const borderPosition = ref('bottom');
const cartContent = ref(null);
const hasOverflow = ref(false);
const showScrollbar = ref(true);
const isAtBottom = ref(false);
const itemsQtySum = ref(0);
let scrollTimeout;
let hideTimeout;

const loadCart = () => JSON.parse(localStorage.getItem(CART)) || [] ;
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
})
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
});

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
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        height: 64px;
        border-bottom: 1px solid lightgray;
    }
    .order-summary .amout {
        font-size: 19px;
        font-weight: 900;
        color: black;
    }
    .total-ctn {
        padding-bottom: 12px;
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
        border-bottom: 1px solid lightgray;
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