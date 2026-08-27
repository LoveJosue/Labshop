<template>
    <div class="view">
        <header class="view-header">
            <h1>Paramètres du compte</h1>
            <p class="subtitle">Vos informations personnelles et la sécurité de votre compte.</p>
        </header>

        <!-- Informations personnelles -->
        <section class="panel">
            <div class="panel-head">
                <h2>Informations personnelles</h2>
                <button type="button" class="btn btn-outlined" disabled title="Bientôt disponible">
                    Modifier
                </button>
            </div>
            <dl class="info-grid">
                <div v-for="field in personalFields" :key="field.label" class="info-row">
                    <dt>{{ field.label }}</dt>
                    <dd :class="{ empty: !field.value }">{{ field.value || 'Non renseigné' }}</dd>
                </div>
            </dl>
        </section>

        <!-- Sécurité -->
        <section class="panel">
            <div class="panel-head">
                <h2>Sécurité</h2>
            </div>
            <dl class="info-grid">
                <div class="info-row">
                    <dt>Mot de passe</dt>
                    <dd>••••••••</dd>
                </div>
            </dl>
            <div class="panel-actions">
                <button type="button" class="btn btn-outlined" disabled title="Bientôt disponible">
                    Changer le mot de passe
                </button>
                <p class="hint">
                    La modification du mot de passe déconnectera vos autres appareils.
                </p>
            </div>
        </section>

        <!-- Session -->
        <section class="panel">
            <div class="panel-head">
                <h2>Session</h2>
            </div>
            <p class="panel-text">
                Vous êtes connecté en tant que <strong>{{ user?.email }}</strong>.
                Fermez votre session si vous utilisez un appareil partagé.
            </p>
            <div class="panel-actions">
                <button type="button" class="btn btn-danger" @click="onLogout" :disabled="loggingOut">
                    {{ loggingOut ? 'Déconnexion…' : 'Se déconnecter' }}
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/useAuth.js';

const router = useRouter();
const { user, logout } = useAuth();

const loggingOut = ref(false);

const personalFields = computed(() => [
    { label: 'Prénom',    value: user.value?.prename },
    { label: 'Nom',       value: user.value?.name },
    { label: 'Email',     value: user.value?.email },
    { label: 'Téléphone', value: user.value?.phone },
]);

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

.panel {
    background: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 12px;
    padding: 1.5rem;
}
.panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
}
.panel-head h2 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
}
.panel-text {
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.6;
    color: #3f454b;
}
.panel-text strong {
    font-weight: 500;
}
.panel-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.25rem;
}
.hint {
    font-size: 0.8rem;
    color: #8b9096;
    font-weight: 300;
}

.info-grid {
    display: grid;
    gap: 0;
}
.info-row {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.9rem;
}
.info-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}
.info-row:first-child {
    padding-top: 0;
}
.info-row dt {
    color: #777;
    font-weight: 300;
}
.info-row dd {
    font-weight: 500;
    word-break: break-word;
}
.info-row dd.empty {
    color: #9aa0a6;
    font-weight: 300;
    font-style: italic;
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
    background: transparent;
    color: var(--primaryColor);
    transition: opacity 0.2s ease, background-color 0.2s ease;
}
.btn:hover:not(:disabled) {
    opacity: 0.85;
}
.btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}
.btn-danger {
    border-color: #b32424;
    color: #b32424;
}
.btn-danger:hover:not(:disabled) {
    background: #fdecec;
}

@media (max-width: 600px) {
    .view-header h1 {
        font-size: 1.35rem;
    }
    .panel {
        padding: 1.25rem;
    }
    .info-row {
        grid-template-columns: minmax(0, 1fr);
        gap: 0.15rem;
    }
}
</style>