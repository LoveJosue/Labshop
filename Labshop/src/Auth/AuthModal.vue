<template>
    <Transition name="fade">
        <div v-if="isOpen" class="auth-overlay" @click.self="close">
            <div class="auth-modal" role="dialog" aria-modal="true">
                <button class="close-btn" @click="close" aria-label="Fermer">✕</button>
                <h2 class="logo-title">Labstore</h2>
                <h4>{{ mode === 'login' ? 'Connexion' : 'Créer votre compte' }}</h4>

                <form @submit.prevent="submit">
                    <template v-if="mode === 'register'">
                        <label>Nom complet
                            <input v-model="form.fullName" type="text" required autocomplete="name" />
                        </label>
                        <label>Téléphone
                            <input v-model="form.phone" type="tel" autocomplete="tel" />
                        </label>
                    </template>

                    <label>Email
                        <input v-model="form.email" type="email" required autocomplete="email" />
                    </label>

                    <label>Mot de passe
                        <div class="password-row">
                            <input
                                v-model="form.password"
                                :type="showPwd ? 'text' : 'password'"
                                required
                                :minlength="mode === 'register' ? 8 : null"
                                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                            />
                            <button type="button" class="eye" @click="showPwd = !showPwd">
                                {{ showPwd ? '🙈' : '👁' }}
                            </button>
                        </div>
                    </label>

                    <p v-if="error" class="error">{{ error }}</p>

                    <button type="submit" class="submit" :disabled="loading">
                        {{ loading ? '…' : (mode === 'login' ? 'Se connecter' : 'Créer mon compte') }}
                    </button>
                </form>

                <div class="switch">
                    <template v-if="mode === 'login'">
                        Pas encore de compte ?
                        <button type="button" @click="switchMode('register')">Créer un compte</button>
                    </template>
                    <template v-else>
                        Déjà client ?
                        <button type="button" @click="switchMode('login')">Se connecter</button>
                    </template>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useAuth } from '../stores/useAuth.js';

const props = defineProps({
    isOpen: Boolean,
    initialMode: { type: String, default: 'login' }, // 'login' | 'register'
});
const emit = defineEmits(['close', 'success']);

const { login, register } = useAuth();

const mode = ref(props.initialMode);
const showPwd = ref(false);
const loading = ref(false);
const error = ref('');
const form = reactive({ fullName: '', phone: '', email: '', password: '' });

watch(() => props.isOpen, (open) => {
    if (open) {
        mode.value = props.initialMode;
        error.value = '';
        form.fullName = ''; form.phone = ''; form.email = ''; form.password = '';
        showPwd.value = false;
    }
});

const switchMode = (m) => { mode.value = m; error.value = ''; };
const close = () => emit('close');

async function submit() {
    error.value = '';
    loading.value = true;
    try {
        if (mode.value === 'login') {
            await login(form.email, form.password);
        } else {
            // Convention : "Prénom Nom" — premier mot = prénom, le reste = nom
            const parts = (form.fullName || '').trim().split(/\s+/);
            const prename = parts.shift() || '';
            const name = parts.join(' ');
            await register({
                email:    form.email,
                password: form.password,
                prename, name,
                phone:    form.phone,
            });
        }
        emit('success');
        close();
    } catch (e) {
        error.value = e.message || 'Une erreur est survenue.';
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.auth-overlay {
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100lvh;
    background: rgba(17, 24, 39, 0.5);
    z-index: 10;
}
.auth-modal {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    width: min(420px, 92vw);
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    position: relative;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
}
.close-btn {
    position: absolute; top: 12px; right: 12px;
    background: none; border: 0; font-size: 1.1rem; cursor: pointer;
}
.logo-title { text-align: center; margin: 0 0 0.25rem; }
h4 { text-align: center; font-weight: 400; margin: 0 0 1.5rem; color: #555;}
label { display: block; margin-bottom: 1rem; font-size: 0.85rem; color: #555; }
input {
    display: block; width: 100%; padding: 0.6rem; margin-top: 0.25rem;
    border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem;
    box-sizing: border-box;
}
.password-row { display: flex; gap: 0.5rem; align-items: stretch; }
.password-row input { flex: 1; }
.eye {
    background: none; border: 1px solid #ddd; padding: 0 0.7rem;
    border-radius: 6px; cursor: pointer; margin-top: 0.25rem;
}
.error { color: #c00; font-size: 0.85rem; margin: 0 0 1rem; }
.submit {
    width: 100%; padding: 0.75rem; border: 0; border-radius: 6px;
    background: #111; color: #fff; cursor: pointer; font-size: 0.95rem;
}
.submit:disabled { opacity: 0.6; cursor: not-allowed; }
.switch { text-align: center; margin-top: 1.25rem; font-size: 0.85rem; color: #666; }
.switch button {
    background: none; border: 0; color: #111; text-decoration: underline; cursor: pointer;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>