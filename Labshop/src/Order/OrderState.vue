<template>
    <Spinner v-if="loading" />

    <div v-else-if="error" class="state-error">
        <div class="error-content">
            <p class="error-code">404</p>
            <h1 class="error-title">Commande introuvable</h1>
            <p class="error-message">
                Nous n'avons trouvé aucune commande avec le numéro
                <strong>{{ $route.params.orderNumber }}</strong>.<br />
                Vérifiez le numéro et essayez de nouveau.
            </p>
            <div class="error-actions">
                <button class="btn btn-filled" @click="retry">Réessayer</button>
                <router-link to="/" class="btn btn-outlined">Retour à l'accueil</router-link>
            </div>
        </div>
    </div>

    <div v-else class="page">
        <header class="page-header">
            <h1>Aperçu de votre commande</h1>
            <p class="subtitle">Suivez l'état et les détails de votre commande.</p>
        </header>

        <!-- Section 1: Aperçu -->
        <section class="card overview">
            <div class="overview-grid">
                <div class="info-block">
                    <p class="label">Numéro de commande</p>
                    <p class="value highlight">{{ order.orderNumber }}</p>
                </div>
                <div class="info-block">
                    <p class="label">Date de commande</p>
                    <p class="value">{{ formattedDate }}</p>
                </div>
                <div class="info-block">
                    <p class="label">Mode de récupération</p>
                    <p class="value">{{ receptionMode }}</p>
                </div>
                <div class="info-block">
                    <p class="label">État de la commande</p>
                    <p class="value">
                        <span class="status-badge" :class="statusClass">{{ order.statut }}</span>
                    </p>
                </div>
                <div class="info-block">
                    <p class="label">Facturé à</p>
                    <p class="value">{{ billingFullName }}</p>
                </div>
                <div v-if="order.expedition" class="info-block">
                    <p class="label">Expédié à</p>
                    <p class="value">{{ expeditionFullName }}</p>
                </div>
            </div>
        </section>

        <!-- Section 2: Contenu -->
        <section class="card order-content">
            <h2 class="section-title">Contenu</h2>

            <ul class="items-list">
                <li v-for="(item, index) in order.items" :key="item.itemCartId ?? index" class="cart-item">
                    <div class="item-img-box">
                        <img :src="item.imgUrl" :alt="item.name" />
                        <div class="notif-icon">{{ item.qte }}</div>
                    </div>
                    <div class="item-details">
                        <div class="item-infos">
                            <span class="item-name">{{ item.name }}</span>
                            <span class="item-type">
                                En {{ item.purchaseType === ONE ? 'gros' : 'détail' }}
                                · {{ item.qte }}
                                {{ getQtyLabel(item) }}
                            </span>
                        </div>
                        <p class="item-price">{{ formatAmount(item.cost) }} FCFA</p>
                    </div>
                </li>
            </ul>

            <div class="divider"></div>

            <div class="bill-ctn">
                <div class="flex-element">
                    <p>Sous-total</p>
                    <p>{{ formatAmount(order.subTotal) }} FCFA</p>
                </div>
                <div v-if="isExpedition" class="flex-element">
                    <p>Frais d'expédition</p>
                    <p>{{ formatAmount(order.expeditionCosts) }} FCFA</p>
                </div>
                <div v-else class="flex-element">
                    <p>Cueillette en boutique</p>
                    <p>GRATUIT</p>
                </div>
                <div class="flex-element">
                    <p>Taxes</p>
                    <p>{{ formatAmount(order.tva) }} FCFA</p>
                </div>
            </div>

            <div class="total-ctn">
                <p>Total</p>
                <div class="total-amout">
                    <p class="currenty">XOF</p>
                    <p class="value">{{ formatAmount(order.totalWithTVA) }} FCFA</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { apiUrl } from '@/config.js';
import Spinner from '@/Components/Spinner.vue';

const ONE = 1;
const route = useRoute();

const order = ref(null);
const loading = ref(true);
const error = ref(false);

const fetchOrder = async () => {
    loading.value = true;
    error.value = false;
    try {
        const { data } = await axios.get(`${apiUrl}/order/${route.params.orderNumber}`);
        order.value = data;
        console.log(order.value);
    } catch (err) {
        error.value = true;
    } finally {
        loading.value = false;
    }
};

const retry = () => fetchOrder();

const isExpedition = computed(() => !!order.value?.expedition);

const receptionMode = computed(() => isExpedition.value ? 'Livraison' : 'Cueillette en boutique');

const formattedDate = computed(() => {
    if (!order.value?.orderDate) return '—';
    return new Date(order.value.orderDate).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

const billingFullName = computed(() => {
    const b = order.value?.billing || {};
    return `${b.prename ?? ''} ${b.name ?? ''}`.trim() || '—';
});
const expeditionFullName = computed(() => {
    const e = order.value?.expedition || {};
    return `${e.prename ?? ''} ${e.name ?? ''}`.trim() || '—';
});

const statusClass = computed(() => {
    const map = {
        'en attente': 'status-pending',
        'payée': 'status-paid',
        'expédiée': 'status-shipped',
        'livrée': 'status-delivered',
        'annulée': 'status-cancelled'
    };
    return map[order.value?.statut] || 'status-pending';
});

const formatAmount = (value) => (value ?? 0).toLocaleString('fr-FR');

const getQtyLabel = (item) => {
    if (item.purchaseType === ONE) {
        return `carton${item.qte > 1 ? 's' : ''}`;
    }
    const unit = item.unitType || 'unité';
    return `${unit}${item.qte > 1 ? 's' : ''}`;
};

onMounted(fetchOrder);
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.page {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2.5rem 2.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    color: var(--primaryColor);
}

.page-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
}
.page-header h1 {
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: -0.01em;
}
.subtitle {
    font-size: 0.95rem;
    color: #666;
    font-weight: 300;
}

.card {
    background-color: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 10px;
    padding: 1.75rem;
}

.section-title {
    font-size: 1.15rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    letter-spacing: -0.01em;
}

/* Overview */
.overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem 1.25rem;
}
.info-block {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
}
.label {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.56);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}
.value {
    font-size: 0.95rem;
    color: var(--primaryColor);
    font-weight: 500;
    word-break: break-word;
}
.value.highlight {
    color: #137a3b;
    font-weight: 700;
    letter-spacing: -0.01em;
}

.status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    border: 1px solid transparent;
}
.status-pending  { background: #fff7e6; color: #b25b00;  border-color: #ffe2b8; }
.status-paid     { background: #eaf4ff; color: #0b66c2;  border-color: #cbe3ff; }
.status-shipped  { background: #ede7ff; color: #5a32c8;  border-color: #d8caff; }
.status-delivered{ background: #e7f7ec; color: #137a3b;  border-color: #bfe6cc; }
.status-cancelled{ background: #fdecec; color: #b32424;  border-color: #f5c7c7; }

/* Content - items */
.items-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}
.cart-item {
    display: grid;
    grid-template-columns: 72px auto;
    gap: 1rem;
    align-items: center;
}
.item-img-box {
    position: relative;
}
.cart-item img {
    width: 72px;
    height: 72px;
    object-fit: contain;
    border-radius: 0.5rem;
    border: 1px solid var(--lightgray);
    padding: 0.4rem;
    mix-blend-mode: multiply;
    background: #fff;
}
.notif-icon {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    transform: translate(50%, -50%);
}
.item-details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    min-width: 0;
}
.item-infos {
    display: flex;
    flex-direction: column;
    min-width: 0;
}
.item-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.item-type {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.56);
}
.item-price {
    font-size: 0.95rem;
    font-weight: 500;
    text-align: right;
    white-space: nowrap;
}

.divider {
    height: 1px;
    background-color: var(--lightgray);
    margin: 1.5rem 0 1.25rem;
}

.bill-ctn {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
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
    padding-top: 1rem;
    border-top: 1px solid var(--lightgray);
    font-size: 1.15rem;
    font-weight: 800;
}
.total-ctn .total-amout {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}
.total-ctn .currenty {
    font-size: 0.75rem;
    color: rgba(0, 0, 0, 0.56);
    font-weight: 400;
    transform: translateY(15%);
}

/* Error state */
.state-error {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px);
    padding: 2rem;
}
.error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    max-width: 520px;
}
.error-code {
    font-size: clamp(4rem, 14vw, 7rem);
    font-weight: 700;
    color: var(--lightgray);
    line-height: 1;
    letter-spacing: -0.04em;
}
.error-title {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--primaryColor);
}
.error-message {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    font-weight: 300;
}
.error-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
}
.btn {
    display: inline-block;
    padding: 0.6rem 1.4rem;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid var(--primaryColor);
    transition: opacity 0.2s ease;
}
.btn-filled {
    background-color: var(--primaryColor);
    color: #fff;
}
.btn-outlined {
    background-color: transparent;
    color: var(--primaryColor);
}
.btn:hover {
    opacity: 0.85;
}

@media (max-width: 800px) {
    .overview-grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 600px) {
    .page {
        padding: 1.5rem 1rem 3rem;
    }
    .card {
        padding: 1.25rem;
    }
    .overview-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    .page-header h1 {
        font-size: 1.4rem;
    }
    .item-name {
        white-space: normal;
    }
    .error-actions {
        flex-direction: column;
        width: 100%;
    }
    .btn {
        width: 100%;
        text-align: center;
    }
}
</style>