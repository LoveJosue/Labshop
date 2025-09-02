<template>
    <!-- {{ calculateItemPrice(item).toLocaleString('fr-FR') }} FCFA -->
    <!-- <span class="item-qte">
        Qté : {{ item.qte }} {{ getPackaging(item) }}
    </span> -->
    <div class="ctn">
        <div class="cart-content" :class="[hasOverflow ? borderPosition : '', { 'hide-scroll': !showScrollbar }]" ref="cartContent">
            <div v-for="item in cart" :key="item.productId" class="cart-item">
                <!-- Image produit -->
                <img :src="item.imgUrl" :alt="item.name" />
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
        <!-- Summary footer -->
        <div></div>
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
let scrollTimeout;
let hideTimeout;

const loadCart = () => JSON.parse(localStorage.getItem(CART)) || [] ;
const calculateItemPrice = (item) => item.purchaseType === ONE ? (item.unitPrice * item.unitPerBox * item.qte) : item.unitPrice * item.qte;
const total = computed(() => {
    let sum = 0;
    cart.value.forEach((item) => {
        sum+= calculateItemPrice(item);
    })
    return sum;
});
const getPackaging = (item) => {
    if (item.purchaseType === ONE) {
        return item.qte > 1 ? 'cartons' : 'carton'
    } else {
        return item.qte > 1 ? `${item.unitType}s` : `${item.unitType}`
    }
}
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
});

</script>

<style scoped>
.ctn {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    justify-content: space-between;
}
.cart-content {
    position: relative; /* pour que le hint se place dedans */
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  justify-content: flex-start;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-gutter: stable;
  box-sizing: content-box;
  padding-right: 0;
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
.cart-item {
    display: grid;
    grid-template-columns: 64px auto;
    gap: 0.75rem;
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
</style>