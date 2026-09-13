<template>
    <div class="reset-page">
        <div class="reset-card">
            <h2 class="logo-title">Labstore</h2>

            <!-- 1. Vérification du lien -->
            <template v-if="status === 'checking'">
                <h4>Vérification du lien…</h4>
                <p class="hint">Merci de patienter un instant.</p>
            </template>

            <!-- 2. Lien mort : on ne montre pas le formulaire pour rien -->
            <template v-else-if="status === 'invalid'">
                <h4>Lien invalide ou expiré</h4>
                <p class="hint">{{ invalidMessage }}</p>
                <button type="button" class="submit" @click="goToLogin">
                    Demander un nouveau lien
                </button>
            </template>

            <!-- 3. Saisie du nouveau mot de passe -->
            <template v-else-if="status === 'ready'">
                <h4>Choisissez un nouveau mot de passe</h4>

                <form @submit.prevent="submit">
                    <label>Nouveau mot de passe
                        <div class="password-row">
                            <input
                                v-model="password"
                                :type="showPwd ? 'text' : 'password'"
                                required
                                minlength="8"
                                autocomplete="new-password"
                            />
                            <button
                                type="button"
                                class="eye"
                                @click="showPwd = !showPwd"
                                :aria-label="showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                            >
                                <img :src="showPwd ? eyeOffIcon : eyeIcon" :alt="showPwd ? 'Masquer' : 'Afficher'" />
                            </button>
                        </div>
                    </label>

                    <ul class="pwd-rules" aria-live="polite">
                        <li v-for="rule in passwordRules" :key="rule.key" :class="{ ok: rule.valid }">
                            <span class="rule-icon" aria-hidden="true">{{ rule.valid ? '✓' : '○' }}</span>
                            {{ rule.label }}
                        </li>
                    </ul>

                    <label>Confirmer le mot de passe
                        <input
                            v-model="confirmation"
                            :type="showPwd ? 'text' : 'password'"
                            required
                            autocomplete="new-password"
                            :class="{ invalid: showMismatch }"
                            @blur="confirmationTouched = true"
                        />
                        <span v-if="showMismatch" class="field-error">
                            Les deux mots de passe ne correspondent pas.
                        </span>
                    </label>

                    <p v-if="error" class="error">{{ error }}</p>

                    <button type="submit" class="submit" :disabled="loading || !canSubmit">
                        {{ loading ? '…' : 'Enregistrer le nouveau mot de passe' }}
                    </button>
                </form>
            </template>

            <!-- 4. Terminé -->
            <template v-else>
                <h4>Mot de passe modifié</h4>
                <p class="notice" role="status">
                    Votre mot de passe a bien été changé. Par sécurité, toutes vos sessions ont été
                    déconnectées : reconnectez-vous avec votre nouveau mot de passe.
                </p>
                <button type="button" class="submit" @click="goToLogin">Se connecter</button>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../stores/useAuth.js';
import { getPasswordRules, isPasswordAcceptable } from './passwordRules.js';
import eyeIcon from '@/images/eye.svg';
import eyeOffIcon from '@/images/eye-off.svg';

const GLOBAL_ERROR_MESSAGE = 'Une erreur est survenue';
const DEFAULT_INVALID_MESSAGE =
    "Ce lien de réinitialisation n'est plus valable. Les liens expirent après 10 minutes et ne servent qu'une fois.";

const route = useRoute();
const router = useRouter();
const { verifyResetToken, resetPassword } = useAuth();

// 'checking' → 'invalid' | 'ready' → 'done'
const status = ref('checking');
const invalidMessage = ref(DEFAULT_INVALID_MESSAGE);
const password = ref('');
const confirmation = ref('');
const confirmationTouched = ref(false);
const showPwd = ref(false);
const loading = ref(false);
const error = ref('');

// Le jeton reste dans l'URL de l'onglet ; il n'est envoyé à l'API que dans le
// corps des requêtes, jamais en query string (les URL finissent dans les journaux).
const token = String(route.query.token ?? '');

const passwordRules = computed(() => getPasswordRules(password.value));
const passwordsMatch = computed(() => password.value === confirmation.value);
const showMismatch = computed(() => confirmationTouched.value && confirmation.value !== '' && !passwordsMatch.value);
const canSubmit = computed(() => isPasswordAcceptable(password.value) && passwordsMatch.value);

// On vérifie le lien avant d'afficher le formulaire : inutile de faire saisir un
// mot de passe pour annoncer ensuite que le lien était mort.
onMounted(async () => {
    if (!token) {
        status.value = 'invalid';
        return;
    }
    try {
        status.value = (await verifyResetToken(token)) ? 'ready' : 'invalid';
    } catch (e) {
        status.value = 'invalid';
        invalidMessage.value = e.response?.data?.error ?? GLOBAL_ERROR_MESSAGE;
    }
});

async function submit() {
    error.value = '';
    if (!canSubmit.value) {
        confirmationTouched.value = true;
        error.value = passwordsMatch.value
            ? 'Votre mot de passe ne respecte pas les règles de sécurité.'
            : 'Les deux mots de passe ne correspondent pas.';
        return;
    }
    loading.value = true;
    try {
        await resetPassword(token, password.value);
        status.value = 'done';
    } catch (e) {
        error.value = e.response?.data?.error ?? GLOBAL_ERROR_MESSAGE;
    } finally {
        loading.value = false;
    }
}

// `redirect` est le signal que le Header attend pour ouvrir la modale de connexion.
const goToLogin = () => router.replace({ path: '/', query: { redirect: '/' } });
</script>

<style scoped>
.reset-page {
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
    box-sizing: border-box;
}
.reset-card {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    width: min(440px, 100%);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    border: 1px solid #eee;
}
@media (max-width: 420px) {
    .reset-page { padding: 2rem 0.75rem; }
    .reset-card { padding: 1.75rem 1.25rem; }
}
.logo-title { text-align: center; margin: 0 0 0.25rem; }
h4 { text-align: center; font-weight: 400; margin: 0 0 1.5rem; color: #555; }
label { display: block; margin-bottom: 1rem; font-size: 0.85rem; color: #555; }
input {
    display: block; width: 100%; padding: 0.6rem; margin-top: 0.25rem;
    border: 1px solid #ddd; border-radius: 6px; font-size: 0.95rem;
    box-sizing: border-box;
}
.password-row { display: flex; gap: 0.5rem; align-items: stretch; }
.password-row input { flex: 1; }
.eye {
    display: flex; align-items: center; justify-content: center;
    background: none; border: 1px solid #ddd; padding: 0 0.7rem;
    border-radius: 6px; cursor: pointer; margin-top: 0.25rem;
    color: #555;
}
.eye img { width: 20px; height: 20px; display: block; }
.pwd-rules {
    list-style: none; margin: -0.25rem 0 1.25rem; padding: 0.75rem 0.9rem;
    background: #f7f8fa; border: 1px solid #eee; border-radius: 8px;
    display: grid; gap: 0.35rem;
}
.pwd-rules li {
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.8rem; color: #888; transition: color 0.2s ease;
}
.pwd-rules li.ok { color: #16a34a; }
.rule-icon {
    display: inline-flex; align-items: center; justify-content: center;
    width: 1.1rem; height: 1.1rem; flex-shrink: 0;
    font-size: 0.75rem; font-weight: 700;
    border-radius: 50%; border: 1px solid currentColor;
    transition: color 0.2s ease, border-color 0.2s ease;
}
.hint { font-size: 0.87rem; line-height: 1.6; color: #666; text-align: center; margin: 0 0 1.5rem; }
.notice {
    font-size: 0.87rem; line-height: 1.6; color: #166534; text-align: center;
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
    padding: 0.9rem 1rem; margin: 0 0 1.5rem;
}
.error { color: #c00; font-size: 0.85rem; margin: 0 0 1rem; }
input.invalid { border-color: #dc2626; }
input.invalid:focus { outline-color: #dc2626; }
.field-error { display: block; margin-top: 0.3rem; color: #dc2626; font-size: 0.78rem; }
.submit {
    width: 100%; padding: 0.75rem; border: 0; border-radius: 6px;
    background: #111; color: #fff; cursor: pointer; font-size: 0.95rem;
}
.submit:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
