<template>
    <div class="state-centered">
        <div class="track-card">
            <h1 class="state-title">Suivi de commande</h1>
            <p class="state-message">
                Entrez votre numéro de commande pour en consulter l'état et les détails.
            </p>

            <form class="track-form" @submit.prevent="submit">
                <input
                    v-model="orderNumber"
                    type="text"
                    placeholder="CMD-AAAAMMJJ-XXXXXX"
                    autocomplete="off"
                    spellcheck="false"
                    :disabled="loading"
                />
                <p v-if="error" class="error">{{ error }}</p>
                <button type="submit" class="btn btn-filled" :disabled="loading || !orderNumber.trim()">
                    {{ loading ? '…' : 'Vérifier' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { apiUrl } from '@/config.js';

const router = useRouter();

const orderNumber = ref('');
const loading = ref(false);
const error = ref('');

const submit = async () => {
    const number = orderNumber.value.trim();
    if (!number) return;
    loading.value = true;
    error.value = '';
    try {
        await axios.get(`${apiUrl}/order/${encodeURIComponent(number)}`);
        router.push(`/checkOrder/${number}`);
    } catch (err) {
        if (err.response?.status === 404) {
            error.value = "Aucune commande ne correspond à ce numéro.";
        } else {
            error.value = "Une erreur est survenue. Réessayez plus tard.";
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.state-centered {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 80px);
    padding: 2rem;
}
.track-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    width: min(460px, 100%);
    background-color: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 12px;
    padding: 2.25rem;
    color: var(--primaryColor);
}
.state-title {
    font-size: 1.5rem;
    font-weight: 600;
}
.state-message {
    font-size: 0.95rem;
    color: #666;
    line-height: 1.55;
    font-weight: 300;
}
.track-form {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    width: 100%;
    margin-top: 0.5rem;
}
.track-form input {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 1px solid var(--lightgray);
    border-radius: 6px;
    font-size: 0.95rem;
    text-align: center;
    letter-spacing: 0.02em;
}
.track-form input:focus {
    outline: none;
    border-color: var(--primaryColor);
}
.error {
    color: #b32424;
    font-size: 0.85rem;
}
.btn {
    display: inline-block;
    padding: 0.7rem 1.4rem;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid var(--primaryColor);
    transition: opacity 0.2s ease;
}
.btn-filled {
    background-color: var(--primaryColor);
    color: #fff;
}
.btn:hover:not(:disabled) {
    opacity: 0.85;
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
