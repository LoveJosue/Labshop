<template>
    <Transition name="fade">
        <div v-if="isOpen" class="auth-overlay" @click.self="close">
            <div class="auth-modal" role="dialog" aria-modal="true">
                <button class="close-btn" @click="close" aria-label="Fermer">✕</button>
                <h2 class="logo-title">Labstore</h2>
                <h4>{{ mode === 'login' ? 'Connexion' : 'Créer votre compte' }}</h4>

                <form @submit.prevent="submit">
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

                    <label>Mot de passe
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

                    <ul v-if="mode === 'register'" class="pwd-rules" aria-live="polite">
                        <li v-for="rule in passwordRules" :key="rule.key" :class="{ ok: rule.valid }">
                            <span class="rule-icon" aria-hidden="true">{{ rule.valid ? '✓' : '○' }}</span>
                            {{ rule.label }}
                        </li>
                    </ul>

                    <p v-if="error" class="error">{{ error }}</p>

                    <button type="submit" class="submit" :disabled="loading || !canSubmit">
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
import { ref, reactive, computed, watch } from 'vue';
import { useAuth } from '../stores/useAuth.js';
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
    initialMode: { type: String, default: 'login' }, // 'login' | 'register'
});
const emit = defineEmits(['close', 'success']);

const { login, register } = useAuth();

const mode = ref(props.initialMode);
const showPwd = ref(false);
const loading = ref(false);
const error = ref('');
const emailTouched = ref(false);
const phoneTouched = ref(false);
const form = reactive({ prename: '', name: '', phone: '', email: '', password: '' });

const isEmailValid = computed(() => EMAIL_REGEX.test(form.email.trim()));
const showEmailError = computed(() => emailTouched.value && form.email.trim() !== '' && !isEmailValid.value);

const isPhoneValid = computed(() => isPhoneAcceptable(form.phone));
const showPhoneError = computed(() => phoneTouched.value && form.phone.trim() !== '' && !isPhoneValid.value);

const passwordRules = computed(() => {
    const pwd = form.password;
    return [
        { key: 'length',  label: 'Au moins 8 caractères',        valid: pwd.length >= 8 },
        { key: 'upper',   label: 'Une lettre majuscule (A-Z)',   valid: /[A-Z]/.test(pwd) },
        { key: 'lower',   label: 'Une lettre minuscule (a-z)',   valid: /[a-z]/.test(pwd) },
        { key: 'digit',   label: 'Un chiffre (0-9)',             valid: /[0-9]/.test(pwd) },
        { key: 'special', label: 'Un caractère spécial',         valid: /[^A-Za-z0-9]/.test(pwd) },
    ];
});
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
const canSubmit = computed(() => mode.value === 'login' || validateRegistration() === null);

watch(() => props.isOpen, (open) => {
    if (open) {
        mode.value = props.initialMode;
        error.value = '';
        form.prename = ''; form.name = ''; form.phone = ''; form.email = ''; form.password = '';
        showPwd.value = false;
        emailTouched.value = false;
        phoneTouched.value = false;
    }
});

const switchMode = (m) => { mode.value = m; error.value = ''; };
const close = () => emit('close');

async function submit() {
    error.value = '';
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