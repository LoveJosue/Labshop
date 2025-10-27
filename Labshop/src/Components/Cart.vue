<template>
    <div class="cart">
        <!-- Header -->
        <div class="cart-header">
            <h4>🛒 Panier</h4>
            <svg @click="$emit('close')" class="w-6 h-6 text-gray-600 hover:text-red-500 transition cursor-pointer" 
                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" 
                 viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                      stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
        </div>

        <!-- Contenu -->
        <div class="cart-content">
            <p v-if="cart.length < 1" class="empty">Votre panier est vide.</p>

            <div v-else v-for="item in cart" :key="item.productId" class="cart-item">
                <!-- Image produit -->
                <RouterLink :key="$route.fullPath" :to="item.productUrl">
                    <img :src="item.imgUrl" :alt="item.name" @click="imgClicked(item)" />
                </RouterLink>
                
                 
                <!-- Infos produit -->
                <div class="item-infos">
                    <div class="chld-1">
                        <span class="item-name">{{ item.name }}</span>
                        <span class="item-type">
                            Achat en {{ item.purchaseType === ONE ? 'gros' : 'détail' }}
                        </span>
                        <span class="item-qte">
                            Qté : {{ item.qte }} {{ getPackaging(item) }}
                        </span>
                        <span class="item-price">
                            {{ calculateItemPrice(item).toLocaleString('fr-FR') }} FCFA
                        </span>
                    </div>
                </div>

                <!-- Bouton supprimer -->
                <button class="delete-btn" @click="removeItem(item.itemCartId)">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" 
                         viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 
                                 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a1 1 
                                 0 011 1v2H9V4a1 1 0 011-1z"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Footer Panier -->
        <div v-if="cart.length > 0" class="cart-footer">
            <div class="total">
                <span>Total :</span>
                <span class="total-price">{{ total.toLocaleString('fr-FR') }} FCFA</span>
            </div>
            <button v-if="!isOrderPage()" class="checkout-btn" @click="order()">Commander</button>
        </div>
    </div>

    <!-- Overlay -->
    <!-- <div class="overlay" @click="$emit('close')"></div> -->
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const CART = 'cart';

const ONE = 1 // Achat en gros
const TWO = 2 // Achat en détail

const cart = ref([]);

const emit = defineEmits(['close']);

const getPackaging = (item) => {
    if (item.purchaseType === ONE) {
        return item.qte > 1 ? 'cartons' : 'carton'
    } else {
        return item.qte > 1 ? `${item.unitType}s` : `${item.unitType}`
    }
}

// Calcule le coût de l'item en fonction du type d'achat
const calculateItemPrice = (item) => item.purchaseType === ONE ? (item.unitPrice * item.unitPerBox * item.qte) : item.unitPrice * item.qte;

const imgClicked = (item) => {
    emit('close');
    goProductPage(item);
}
const goProductPage = (item) => {
    console.log(item.productUrl)
    router.push(item.productUrl);
}
const order = () => {
    router.push('/order');
}
const isOrderPage = () => {
    return route.name === 'order';
}
function loadCart() {
    return JSON.parse(localStorage.getItem(CART)) || [];
}
function removeItem(itemId) {
    cart.value = cart.value.filter(item => item.itemCartId !== itemId);
    localStorage.setItem(CART, JSON.stringify(cart.value));
}
const total = computed(() => {
    let sum = 0;
    cart.value.forEach((item) => {
        item.purchaseType === ONE ? sum += (item.unitPrice * item.unitPerBox * item.qte) : sum += (item.unitPrice * item.qte);
    })
    return sum;
});

onMounted(() => {
    cart.value = loadCart();
});
</script>

<style scoped>
.cart {
    position: fixed;
    top:0;
    right: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: var(--cartWidth);
    padding: 1.5rem;
    background-color: #fdfdfd;
    box-shadow: -4px 0 15px rgba(0,0,0,0.1);
    z-index: 3;
}
.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}
.cart h4 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #111827;
}
.cart-content {
    margin-top: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
}
.empty {
    font-size: 1rem;
    font-weight: 400;
    text-align: center;
    color: #6b7280;
}
.cart-item {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 1rem;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.cart-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
}
.item-infos .chld-1 {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.item-name {
    font-weight: 600;
    color: #111827;
}
.item-type, .item-qte {
    font-size: 0.85rem;
    color: #6b7280;
}
.item-price {
    margin-top: 0.25rem;
    font-weight: 600;
    color: var(--primaryColor);
}
.delete-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    transition: color 0.2s ease;
}
.delete-btn:hover {
    color: #ef4444;
}

/* Footer panier */
.cart-footer {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.total {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 500;
    color: #111827;
}
.total-price {
    font-weight: 700;
    color: var(--primaryColor);
}
.checkout-btn {
    width: 100%;
    /* background: linear-gradient(to right, #10b981, #059669); */
    background: linear-gradient(to right, #339dff, #007bff);
    color: white;
    padding: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
}
.checkout-btn:hover {
    transform: scale(1.02);
    /* background: linear-gradient(to right, #059669, #047857); */
    background: linear-gradient(to right, #007bff, #0062cc)
}

/* .overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: calc(100% - var(--cartWidth));
  background-color: rgba(17, 24, 39, 0.5);
  transition: opacity 0.4s ease;
} */
@media(max-width: 549px) {
    .cart {
        width: 100%;
        border-radius: 0;
    }
    .overlay {
        display: none;
    }
}
</style>
