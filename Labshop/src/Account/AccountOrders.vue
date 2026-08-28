<template>
    <div class="view">
        <header class="view-header">
            <h1>Mes commandes</h1>
            <p class="subtitle">Retrouvez l'historique et le suivi de vos commandes.</p>
        </header>

        <!-- Chargement -->
        <div v-if="loading" class="skeleton-list">
            <div v-for="n in 3" :key="n" class="skeleton-card"></div>
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="panel panel-empty">
            <span class="panel-icon pi pi-exclamation-triangle" aria-hidden="true"></span>
            <p class="panel-title">Une erreur est survenue</p>
            <p class="panel-text">Impossible de charger vos commandes pour le moment.</p>
            <button class="btn btn-filled" @click="fetchOrders">Réessayer</button>
        </div>

        <!-- Aucune commande -->
        <div v-else-if="!orders.length" class="panel panel-empty">
            <span class="panel-icon pi pi-box" aria-hidden="true"></span>
            <p class="panel-title">Aucune commande</p>
            <p class="panel-text">Vous n'avez pas encore passé de commande.</p>
            <router-link to="/products" class="btn btn-filled">Découvrir nos produits</router-link>
        </div>

        <!-- Liste -->
        <div v-else class="order-list">
            <article
                v-for="order in orders"
                :key="order.orderNumber"
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

                    <div class="actions">
                        <button
                            type="button"
                            class="actions-trigger"
                            :class="{ 'is-open': openedMenu === order.orderNumber }"
                            aria-haspopup="menu"
                            :aria-expanded="openedMenu === order.orderNumber"
                            :aria-label="`Actions pour la commande ${order.orderNumber}`"
                            @click.stop="toggleMenu(order.orderNumber)"
                        >
                            <span class="pi pi-ellipsis-v" aria-hidden="true"></span>
                        </button>

                        <Transition name="menu-fade">
                            <div v-if="openedMenu === order.orderNumber" class="actions-menu" role="menu">
                                <!-- target="_blank" : le suivi s'ouvre dans un onglet dédié, l'historique reste affiché. -->
                                <router-link
                                    :to="`/checkOrder/${order.orderNumber}`"
                                    target="_blank"
                                    class="actions-item"
                                    role="menuitem"
                                    @click="closeMenu"
                                >
                                    <span class="pi pi-external-link" aria-hidden="true"></span>
                                    Consulter
                                </router-link>
                            </div>
                        </Transition>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { apiUrl } from '@/config.js';

const orders = ref([]);
const loading = ref(true);
const error = ref(false);

// Numéro de la commande dont le menu d'actions est ouvert (un seul à la fois).
const openedMenu = ref(null);
const toggleMenu = (orderNumber) => {
    openedMenu.value = openedMenu.value === orderNumber ? null : orderNumber;
};
const closeMenu = () => { openedMenu.value = null; };

// Fermeture au clic extérieur : le clic sur le déclencheur est arrêté par @click.stop.
const onEscape = (event) => { if (event.key === 'Escape') closeMenu(); };
onMounted(() => {
    document.addEventListener('click', closeMenu);
    document.addEventListener('keydown', onEscape);
});
onBeforeUnmount(() => {
    document.removeEventListener('click', closeMenu);
    document.removeEventListener('keydown', onEscape);
});

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

// La session est déjà garantie par AccountLayout.
onMounted(fetchOrders);

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

.view {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    color: var(--primaryColor);
}
.view-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.view-header h1 {
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: -0.01em;
}
.subtitle {
    font-size: 0.95rem;
    color: #666;
    font-weight: 300;
}

.order-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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

/* États vides / erreur */
.panel {
    background: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 12px;
}
.panel-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    padding: 3rem 1.5rem;
}
.panel-icon {
    font-size: 1.6rem;
    color: #9aa0a6;
    margin-bottom: 0.25rem;
}
.panel-title {
    font-size: 1.05rem;
    font-weight: 600;
}
.panel-text {
    font-size: 0.9rem;
    color: #666;
    font-weight: 300;
    margin-bottom: 0.75rem;
}

.btn {
    display: inline-block;
    padding: 0.55rem 1.3rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid var(--primaryColor);
    transition: opacity 0.2s ease;
}
.btn-filled {
    background-color: var(--primaryColor);
    color: #fff;
}
.btn:hover {
    opacity: 0.85;
}

/* Menu d'actions (⋮) */
.actions {
    position: relative;
    flex-shrink: 0;
}
.actions-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: rgba(0, 0, 0, 0.45);
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.18s ease, color 0.18s ease;
}
.actions-trigger:hover,
.actions-trigger.is-open {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--primaryColor);
}

.actions-menu {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 20;
    min-width: 168px;
    padding: 0.35rem;
    background: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
.actions-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.7rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: var(--primaryColor);
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 0.15s ease;
}
.actions-item:hover {
    background-color: rgba(0, 0, 0, 0.04);
}
.actions-item .pi {
    font-size: 0.85rem;
    color: rgba(0, 0, 0, 0.45);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}
.menu-fade-enter-from,
.menu-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* Chargement */
.skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.skeleton-card {
    height: 86px;
    border-radius: 10px;
    border: 1px solid var(--lightgray);
    background: linear-gradient(90deg, #f6f7f8 25%, #eeeff1 37%, #f6f7f8 63%);
    background-size: 400% 100%;
    animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
    from { background-position: 100% 0; }
    to   { background-position: 0 0; }
}

@media (max-width: 600px) {
    .order-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
    .order-meta {
        justify-content: flex-start;
        gap: 0.85rem;
    }
    .view-header h1 {
        font-size: 1.35rem;
    }
}
</style>