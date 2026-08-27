<template>
    <Spinner v-if="authLoading" />

    <!-- Non connecté -->
    <div v-else-if="!isLoggedIn" class="state-centered">
        <div class="centered-content">
            <h1 class="state-title">Connectez-vous</h1>
            <p class="state-message">
                Vous devez être connecté pour accéder à votre espace client.
            </p>
            <div class="state-actions">
                <router-link to="/" class="btn btn-outlined">Retour à l'accueil</router-link>
            </div>
        </div>
    </div>

    <div v-else class="account">
        <!-- Menu -->
        <aside class="sidebar">
            <div class="identity">
                <div class="avatar" aria-hidden="true">{{ initials }}</div>
                <div class="identity-text">
                    <p class="identity-name">{{ fullName }}</p>
                    <p class="identity-email">{{ user?.email }}</p>
                </div>
            </div>

            <nav class="menu" aria-label="Navigation du compte">
                <router-link
                    v-for="item in menuItems"
                    :key="item.to"
                    :to="item.to"
                    class="menu-item"
                    active-class="is-active"
                >
                    <span class="menu-icon" :class="item.icon" aria-hidden="true"></span>
                    <span class="menu-label">{{ item.label }}</span>
                </router-link>
            </nav>

            <button class="logout" type="button" @click="onLogout" :disabled="loggingOut">
                <span class="menu-icon pi pi-sign-out" aria-hidden="true"></span>
                <span class="menu-label">{{ loggingOut ? 'Déconnexion…' : 'Déconnexion' }}</span>
            </button>
        </aside>

        <!-- Vue correspondante -->
        <section class="account-content">
            <router-view v-slot="{ Component }">
                <transition name="view-fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/useAuth.js';
import Spinner from '@/Components/Spinner.vue';

const router = useRouter();
const { user, isLoggedIn, loading: authLoading, logout } = useAuth();

const loggingOut = ref(false);

const menuItems = [
    { to: '/account/myOrders',    label: 'Mes commandes',       icon: 'pi pi-box' },
    { to: '/account/myComments', label: 'Mes commentaires',    icon: 'pi pi-comments' },
    { to: '/account/mySettings',   label: 'Paramètres du compte', icon: 'pi pi-cog' },
];

const fullName = computed(() => {
    const parts = [user.value?.prename, user.value?.name].filter(Boolean);
    return parts.length ? parts.join(' ') : 'Mon compte';
});

const initials = computed(() => {
    const source = [user.value?.prename, user.value?.name].filter(Boolean);
    if (!source.length) return (user.value?.email?.[0] || '?').toUpperCase();
    return source.map((part) => part[0].toUpperCase()).join('');
});

const onLogout = async () => {
    loggingOut.value = true;
    try {
        await logout();
    } finally {
        loggingOut.value = false;
        router.push('/');
    }
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.account {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    align-items: start;
    gap: 2rem;
    width: var(--website-section-width);
    max-width: var(--website-max-width);
    margin: 0 auto;
    padding: 2.5rem 0 4rem;
    color: var(--primaryColor);
}

/* ---------- Menu ---------- */
.sidebar {
    position: sticky;
    top: calc(80px + 2.5rem);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    background: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 12px;
    padding: 1.25rem 1rem;
}

.identity {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 0.25rem 1.25rem;
    border-bottom: 1px solid var(--lightgray);
    min-width: 0;
}
.avatar {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--primaryColor);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.02em;
}
.identity-text {
    min-width: 0;
}
.identity-name {
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.identity-email {
    font-size: 0.78rem;
    font-weight: 300;
    color: #777;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.menu-item,
.logout {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    width: 100%;
    padding: 0.65rem 0.75rem;
    border: 0;
    border-radius: 8px;
    background: none;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 400;
    color: #4b5158;
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
}
.menu-item:hover,
.logout:hover {
    background: #f4f5f6;
    color: var(--primaryColor);
}
/* Indicateur de l'élément courant */
.menu-item.is-active {
    background: var(--primaryColor);
    color: #fff;
    font-weight: 500;
}
.menu-item.is-active:hover {
    background: var(--primaryColor);
    color: #fff;
}
.menu-icon {
    font-size: 1rem;
    flex-shrink: 0;
}
.menu-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.logout {
    margin-top: auto;
    padding-top: 0.65rem;
    color: #b32424;
    border-top: 1px solid var(--lightgray);
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.logout:hover {
    background: #fdecec;
    color: #b32424;
}
.logout:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.account-content {
    min-width: 0;
    min-height: 60vh;
}
.view-fade-enter-active,
.view-fade-leave-active {
    transition: opacity 0.18s ease;
}
.view-fade-enter-from,
.view-fade-leave-to {
    opacity: 0;
}

/* ---------- Non connecté ---------- */
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
.btn-outlined {
    background-color: transparent;
    color: var(--primaryColor);
}
.btn:hover {
    opacity: 0.85;
}

/* ---------- Responsive : le menu passe en barre horizontale ---------- */
@media (max-width: 860px) {
    .account {
        grid-template-columns: minmax(0, 1fr);
        gap: 1.25rem;
        padding: 1.5rem 0 3rem;
    }
    .sidebar {
        position: static;
        gap: 1rem;
        padding: 1rem;
    }
    .menu {
        flex-direction: row;
        gap: 0.5rem;
        overflow-x: auto;
        scrollbar-width: none;
    }
    .menu::-webkit-scrollbar {
        display: none;
    }
    .menu-item {
        width: auto;
        flex-shrink: 0;
    }
    .logout {
        width: auto;
        align-self: flex-start;
        margin-top: 0;
        padding-top: 0.65rem;
        border-top: 0;
        border-radius: 8px;
    }
}
</style>