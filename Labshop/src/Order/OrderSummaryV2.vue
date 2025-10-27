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
                                {{ item.cost.toLocaleString('fr-FR') }} FCFA
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
const props = defineProps({
    showSummary: {
        type: Boolean,
        default: false
    },
    receptionType: {
        type: Number,
        default: 0
    },
    shippingInfos: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['update:shippingInfos']);

const CART = 'cart';
const ONE = 1;
const cart = ref([]);

const expeditionCosts = ref(0);
const shippingSrc = ref({ name: "Boutique dabadakondji", lat: 6.17370, lng: 1.27972, distance: null, address: "Rue dabadakondji, Lomé" });
const pricePerKm = ref(500);
const basicAmount = ref(2000);

const isExpedition = computed (() => {
    return props.receptionType === 0; // 0 -> Expédition 1 -> Cueillette
})
const shippingInfosAvailable = ref(false);
// const shippingInfosAvailable = computed(() => {
//     return props.shippingInfos && props.shippingInfos.coords && props.shippingInfos.coords.lat && props.shippingInfos.coords.lng ? true : false;
// });
// computed "bidirectionnel" mais qui n'émet que si la valeur change réellement
const localShippingInfos = computed({
  get: () => props.shippingInfos ?? {},
  set: (val) => {
    // simple comparaison (stringify) pour éviter émetter inutilement
    if (JSON.stringify(val) !== JSON.stringify(props.shippingInfos)) {
      // émet une copie pour éviter références partagées
      emit('update:shippingInfos', { ...val });
    }
  }
});

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
    let sum = 0;
    sum += subTotal.value;
    sum += isExpedition.value && expeditionCosts.value;
    return Math.round(sum * 0.18); // Arrondir à l'entier le plus près
});
async function getDrivingDistance(origin, destination) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
        const distanceMeters = data.routes[0].distance;
        return parseFloat((distanceMeters / 1000).toFixed(2)); // km
    } else {
        // alert('Aucun itinéraire trouvé pour effectuer la livraison à votre position actuelle en voiture. Choisissez un autre lieu.');
        throw new Error("Aucun itinéraire trouvé");
    }
}
// const expeditionCosts = computed(() => {
//     return Math.ceil(1000); // Arrondir à l'entier FCFA supérieur
// })
// Quand c'est une livraison, le calcul du total avec TVA se fait après disponibilité des données de livraison
const totalWithTVA = computed(() => {
  let total = subTotal.value;
  if (isExpedition.value && shippingInfosAvailable.value) {
    total += expeditionCosts.value;
    total += TVA.value;
  } else if (!isExpedition.value) {
    total += TVA.value;
  }
  return total;
});
const updateItemsQtySum = () => {
  let qtySum = 0;
  cart.value.forEach((item) => { qtySum += item.qte });
  itemsQtySum.value = qtySum;
};
async function calculateExpeditionCosts(shippingInfos) {
  try {
    const origin = { lat: shippingSrc.value.lat, lng: shippingSrc.value.lng };
    const destination = { lat: shippingInfos.coords.lat, lng: shippingInfos.coords.lng };
    const distance = await getDrivingDistance(origin, destination);

    let cost = Math.round(distance * pricePerKm.value);
    cost = Math.max(basicAmount.value, cost);
    expeditionCosts.value = cost;

    shippingInfosAvailable.value = true; // itinéraire trouvé
  } catch (err) {
    console.log("Erreur itinéraire :", err);
    expeditionCosts.value = 0;
    shippingInfosAvailable.value = false; // pas d’itinéraire → infos non dispo
    emit("update:shippingInfos", {}); // reset propre
  }
}
watch(
  () => props.shippingInfos,
  (newVal, oldVal) => {
    // Cas 1 : shippingInfos vides → reset
    if (!(newVal?.coords?.lat && newVal?.coords?.lng)) {
      if (oldVal && (oldVal.coords?.lat && oldVal.coords?.lng)) {
        // Seulement si ça change vraiment → sinon boucle
        emit('update:shippingInfos', {});
      }
      return;
    }
    // Cas 2 : appliquer la priorité. B -> localisation actuelle est toujours choisie, même si le géocodage vient après
    if (newVal.infoType === 'A' && oldVal?.infoType === 'B') {
      // Seulement si c'est différent → sinon boucle
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        emit('update:shippingInfos', oldVal);
      }
    }
  },
  { deep: true }
);
// Watcher qui fait le calcul du coût d'expédition au chargement/changement d'adresse d'expédition
watch(
    () => props.shippingInfos,
    async (newVal) => {
        try {
            if (newVal?.coords?.lat && newVal?.coords?.lng) {
                await calculateExpeditionCosts(newVal);
            } else {
                expeditionCosts.value = 0;
                shippingInfosAvailable.value = false;
                emit('update:shippingInfos', {});
            }
        } catch(err) {
                emit('update:shippingInfos', {});
        }
    },
    { deep: true, immediate: true }
);
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