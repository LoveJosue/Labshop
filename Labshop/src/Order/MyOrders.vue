<template>
    <Spinner v-if="authLoading || loading" />

    <!-- Non connecté -->
    <div v-else-if="!isLoggedIn" class="state-centered">
        <div class="centered-content">
            <h1 class="state-title">Connectez-vous</h1>
            <p class="state-message">
                Vous devez être connecté pour consulter l'historique de vos commandes.
            </p>
            <div class="state-actions">
                <router-link to="/" class="btn btn-outlined">Retour à l'accueil</router-link>
            </div>
        </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="state-centered">
        <div class="centered-content">
            <h1 class="state-title">Une erreur est survenue</h1>
            <p class="state-message">Impossible de charger vos commandes pour le moment.</p>
            <div class="state-actions">
                <button class="btn btn-filled" @click="fetchOrders">Réessayer</button>
            </div>
        </div>
    </div>

    <!-- Aucune commande -->
    <div v-else-if="!orders.length" class="state-centered">
        <div class="centered-content">
            <h1 class="state-title">Aucune commande</h1>
            <p class="state-message">Vous n'avez pas encore passé de commande.</p>
            <div class="state-actions">
                <router-link to="/products" class="btn btn-filled">Découvrir nos produits</router-link>
            </div>
        </div>
    </div>

    <!-- Liste -->
    <div v-else class="page">
        <header class="page-header">
            <h1>Mes commandes</h1>
            <p class="subtitle">Retrouvez l'historique et le suivi de vos commandes.</p>
        </header>

        <router-link
            v-for="order in orders"
            :key="order.orderNumber"
            :to="`/checkOrder/${order.orderNumber}`"
            class="order-card"
        >
            <div class="order-main">
                <p class="order-number">{{ order.orderNumber }}</p>
                <p class="order-date">{{ formatDate(order.orderDate) }}</p>
            </div>
            <div class="order-meta">
                <span class="item-count">{{ itemCount(order) }} article{{ itemCount(order) > 1 ? 's' : '' }}</span>
                <span class="status-badge" :class="statusClass(order.statut)">{{ order.statut }}</span>
                <span class="order-total">{{ formatAmount(order.totalWithTVA) }} FCFA</span>
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { apiUrl } from '@/config.js';
import { useAuth } from '@/stores/useAuth.js';
import Spinner from '@/Components/Spinner.vue';

const { isLoggedIn, loading: authLoading } = useAuth();

const orders = ref([]);
const loading = ref(false);
const error = ref(false);

const fetchOrders = async () => {
    loading.value = true;
    error.value = false;
    try {
        const { data } = await axios.get(`${apiUrl}/orders`, { withCredentials: true });
        orders.value = data;
    } catch (err) {
        error.value = true;
    } finally {
        loading.value = false;
    }
};

// Charge dès que la session est confirmée (au montage ou après rétablissement de session).
watch(isLoggedIn, (loggedIn) => {
    if (loggedIn) fetchOrders();
});
onMounted(() => {
    if (isLoggedIn.value) fetchOrders();
});

const itemCount = (order) =>
    (order.items || []).reduce((sum, item) => sum + (item.qte || 0), 0);

const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatAmount = (value) => (value ?? 0).toLocaleString('fr-FR');

const statusClass = (statut) => {
    const map = {
        'en attente': 'status-pending',
        'payée': 'status-paid',
        'expédiée': 'status-shipped',
        'livrée': 'status-delivered',
        'annulée': 'status-cancelled'
    };
    return map[statut] || 'status-pending';
};
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
    gap: 1rem;
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

.order-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    background-color: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.order-card:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.order-main {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
}
.order-number {
    font-size: 0.95rem;
    font-weight: 700;
    color: #137a3b;
    letter-spacing: -0.01em;
}
.order-date {
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.56);
}

.order-meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
    justify-content: flex-end;
}
.item-count {
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.56);
}
.order-total {
    font-size: 1rem;
    font-weight: 700;
    white-space: nowrap;
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

/* États centrés (non connecté / erreur / vide) */
.state-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px);
    padding: 2rem;
}
.centered-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    max-width: 520px;
}
.state-title {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--primaryColor);
}
.state-message {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    font-weight: 300;
}
.state-actions {
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

@media (max-width: 600px) {
    .page {
        padding: 1.5rem 1rem 3rem;
    }
    .order-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
    .order-meta {
        justify-content: flex-start;
        gap: 0.85rem;
    }
    .page-header h1 {
        font-size: 1.4rem;
    }
}
</style>
