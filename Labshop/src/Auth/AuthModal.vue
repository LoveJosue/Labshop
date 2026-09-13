<template>
    <Transition name="fade">
        <div v-if="isOpen" class="auth-overlay" @click.self="close">
            <div class="auth-modal" role="dialog" aria-modal="true">
                <button class="close-btn" @click="close" aria-label="Fermer">✕</button>
                <h2 class="logo-title">Labstore</h2>
                <h4>{{ heading }}</h4>

                <p v-if="mode === 'forgot' && !resetRequested" class="hint">
                    Saisissez l'adresse e-mail de votre compte. Si elle nous est connue,
                    vous recevrez un lien pour choisir un nouveau mot de passe.
                </p>

                <p v-if="resetRequested" class="notice" role="status">{{ resetMessage }}</p>

                <form v-if="!resetRequested" @submit.prevent="submit">
                    <template v-if="mode === 'register'">
                        <div class="name-row">
                            <label>Nom
                                <input v-model="form.name" type="text" required autocomplete="family-name" />
                            </label>
                            <label>Prénom
                                <input v-model="form.prename" type="text" required autocomplete="given-name" />
                            </label>
                        </div>
                        <label>Téléphone <span class="optional">(optionnel)</span>
                            <input
                                v-model="form.phone"
                                type="tel"
                                autocomplete="tel"
                                :class="{ invalid: showPhoneError }"
                                @blur="phoneTouched = true"
                            />
                            <span v-if="showPhoneError" class="field-error">
                                Numéro invalide (8 à 15 chiffres ; +, -, espaces et parenthèses autorisés).
                            </span>
                        </label>
                    </template>

                    <label>Email
                        <input
                            v-model="form.email"
                            type="email"
                            required
                            autocomplete="email"
                            :class="{ invalid: showEmailError }"
                            @blur="emailTouched = true"
                        />
                        <span v-if="showEmailError" class="field-error">
                            Veuillez saisir une adresse e-mail valide (ex. nom@domaine.com).
                        </span>
                    </label>

                    <label v-if="mode !== 'forgot'">Mot de passe
                        <div class="password-row">
                            <input
                                v-model="form.password"
                                :type="showPwd ? 'text' : 'password'"
                                required
                                :minlength="mode === 'register' ? 8 : null"
                                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                            />
                            <button
                                type="button"
                                class="eye"
                                @click="showPwd = !showPwd"
                                :aria-label="showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                            >
                                <img
                                    :src="showPwd ? eyeOffIcon : eyeIcon"
                                    :alt="showPwd ? 'Masquer' : 'Afficher'"
                                />
                            </button>
                        </div>
                    </label>

                    <p v-if="mode === 'login'" class="forgot-row">
                        <button type="button" class="link-btn" @click="switchMode('forgot')">
                            Mot de passe oublié ?
                        </button>
                    </p>

                    <ul v-if="mode === 'register'" class="pwd-rules" aria-live="polite">
                        <li v-for="rule in passwordRules" :key="rule.key" :class="{ ok: rule.valid }">
                            <span class="rule-icon" aria-hidden="true">{{ rule.valid ? '✓' : '○' }}</span>
                            {{ rule.label }}
                        </li>
                    </ul>

                    <p v-if="error" class="error">{{ error }}</p>

                    <button type="submit" class="submit" :disabled="loading || !canSubmit">
                        {{ loading ? '…' : submitLabel }}
                    </button>
                </form>

                <div class="switch">
                    <template v-if="mode === 'login'">
                        Pas encore de compte ?
                        <button type="button" @click="switchMode('register')">Créer un compte</button>
                    </template>
                    <template v-else-if="mode === 'register'">
                        Déjà client ?
                        <button type="button" @click="switchMode('login')">Se connecter</button>
                    </template>
                    <template v-else>
                        <button type="button" @click="switchMode('login')">Retour à la connexion</button>
                    </template>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useAuth } from '../stores/useAuth.js';
import { getPasswordRules } from './passwordRules.js';
import eyeIcon from '@/images/eye.svg';
import eyeOffIcon from '@/images/eye-off.svg';

const GLOBAL_ERROR_MESSAGE = "Une erreur est survenue";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Téléphone souple : seuls chiffres, espaces, +, -, () ; 8 à 15 chiffres.
const PHONE_ALLOWED_REGEX = /^[\d\s+().-]+$/;
function isPhoneAcceptable(raw) {
    const v = String(raw).trim();
    if (!v) return true; // optionnel
    if (!PHONE_ALLOWED_REGEX.test(v)) return false;
    const digits = (v.match(/\d/g) || []).length;
    return digits >= 8 && digits <= 15;
}
const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

const props = defineProps({
    isOpen: Boolean,
    initialMode: { type: String, default: 'login' }, // 'login' | 'register' | 'forgot'
});
const emit = defineEmits(['close', 'success']);

const { login, register, requestPasswordReset } = useAuth();

const mode = ref(props.initialMode);
const showPwd = ref(false);
const loading = ref(false);
const error = ref('');
const emailTouched = ref(false);
const phoneTouched = ref(false);
const form = reactive({ prename: '', name: '', phone: '', email: '', password: '' });

// Accusé de réception de la demande de réinitialisation : il remplace le
// formulaire une fois la demande envoyée.
const resetRequested = ref(false);
const resetMessage = ref('');

const HEADINGS = {
    login:    'Connexion',
    register: 'Créer votre compte',
    forgot:   'Mot de passe oublié',
};
const SUBMIT_LABELS = {
    login:    'Se connecter',
    register: 'Créer mon compte',
    forgot:   'Recevoir le lien',
};
const heading = computed(() => HEADINGS[mode.value]);
const submitLabel = computed(() => SUBMIT_LABELS[mode.value]);

const isEmailValid = computed(() => EMAIL_REGEX.test(form.email.trim()));
const showEmailError = computed(() => emailTouched.value && form.email.trim() !== '' && !isEmailValid.value);

const isPhoneValid = computed(() => isPhoneAcceptable(form.phone));
const showPhoneError = computed(() => phoneTouched.value && form.phone.trim() !== '' && !isPhoneValid.value);

const passwordRules = computed(() => getPasswordRules(form.password));
const isPasswordValid = computed(() => passwordRules.value.every(r => r.valid));

// Valide le formulaire d'inscription. Retourne un message d'erreur (français) ou null si tout est valide.
// Les règles doivent refléter validateRegistration() côté backend (authController.js).
function validateRegistration() {
    if (!isNonEmptyString(form.name) || !isNonEmptyString(form.prename)) return 'Le nom et le prénom sont requis.';
    if (!isEmailValid.value)    return 'Veuillez saisir une adresse e-mail valide.';
    if (!isPhoneValid.value)    return 'Veuillez saisir un numéro de téléphone valide.';
    if (!isPasswordValid.value) return 'Votre mot de passe ne respecte pas les règles de sécurité.';
    return null;
}
const canSubmit = computed(() => {
    if (mode.value === 'forgot')   return isEmailValid.value;
    if (mode.value === 'register') return validateRegistration() === null;
    return true;
});

watch(() => props.isOpen, (open) => {
    if (open) {
        mode.value = props.initialMode;
        error.value = '';
        form.prename = ''; form.name = ''; form.phone = ''; form.email = ''; form.password = '';
        showPwd.value = false;
        emailTouched.value = false;
        phoneTouched.value = false;
        resetRequested.value = false;
        resetMessage.value = '';
    }
});

const switchMode = (m) => {
    mode.value = m;
    error.value = '';
    resetRequested.value = false;
    resetMessage.value = '';
};
const close = () => emit('close');

// Demande de lien de réinitialisation. La réponse est volontairement la même que
// l'adresse corresponde à un compte ou non : on l'affiche telle quelle.
async function submitForgotPassword() {
    if (!isEmailValid.value) {
        emailTouched.value = true;
        error.value = 'Veuillez saisir une adresse e-mail valide.';
        return;
    }
    loading.value = true;
    try {
        resetMessage.value = await requestPasswordReset(form.email.trim());
        resetRequested.value = true;
    } catch (e) {
        // Ici le message du serveur est utile (adresse invalide, trop de demandes).
        error.value = e.response?.data?.error ?? GLOBAL_ERROR_MESSAGE;
    } finally {
        loading.value = false;
    }
}

async function submit() {
    error.value = '';
    if (mode.value === 'forgot') return submitForgotPassword();
    if (mode.value === 'register') {
        const validationError = validateRegistration();
        if (validationError) {
            emailTouched.value = true;
            phoneTouched.value = true;
            error.value = validationError;
            return;
        }
    }
    loading.value = true;
    try {
        if (mode.value === 'login') {
            await login(form.email, form.password);
        } else {
            await register({
                email:    form.email,
                password: form.password,
                prename:  form.prename.trim(),
                name:     form.name.trim(),
                phone:    form.phone,
            });
        }
        emit('success');
        close();
    } catch (e) {
        error.value = GLOBAL_ERROR_MESSAGE;
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.auth-overlay {
    position: fixed;
    height: 100lvh;
    inset: 0;
    background: rgba(17, 24, 39, 0.5);
    z-index: 10;
    display: flex;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 1.5rem 1rem;
    box-sizing: border-box;
}
.auth-modal {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    width: min(420px, 100%);
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    position: relative;
    margin: auto;
}
@media (max-width: 420px) {
    .auth-overlay { padding: 1rem 0.75rem; }
    .auth-modal { padding: 1.75rem 1.25rem; }
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
.name-row { display: flex; gap: 0.75rem; }
.name-row label { flex: 1; margin-bottom: 1rem; }
@media (max-width: 420px) {
    .name-row { flex-direction: column; gap: 0; }
}
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
.hint { font-size: 0.85rem; line-height: 1.5; color: #666; margin: -0.75rem 0 1.25rem; text-align: center; }
.notice {
    font-size: 0.87rem; line-height: 1.5; color: #166534; text-align: center;
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;
    padding: 0.9rem 1rem; margin: -0.5rem 0 0.5rem;
}
.forgot-row { margin: -0.5rem 0 1rem; text-align: right; }
.link-btn {
    background: none; border: 0; padding: 0; cursor: pointer;
    color: #555; font-size: 0.8rem; text-decoration: underline;
}
.link-btn:hover { color: #111; }
.error { color: #c00; font-size: 0.85rem; margin: 0 0 1rem; }
input.invalid { border-color: #dc2626; }
input.invalid:focus { outline-color: #dc2626; }
.field-error { display: block; margin-top: 0.3rem; color: #dc2626; font-size: 0.78rem; }
.optional { color: #999; font-weight: 400; font-size: 0.75rem; }
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