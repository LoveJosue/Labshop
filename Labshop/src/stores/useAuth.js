import { reactive, computed } from "vue";
import { apiUrl } from "@/config";
import axios from "axios";
const api = axios.create({ baseURL: apiUrl, withCredentials: true });

const state = reactive({
    user: null,
    loading: true,
});
export async function register(playload) {
    const response = await api.post(`/auth/register`, playload);
    const { user } = response.data;
    state.user = user;
    return user;
}
export async function login(email, password) {
    const response = await api.post(`/auth/login`, { email, password });
    const { user } = response.data;
    state.user = user;
    return user;
}
// Demande l'envoi d'un lien de réinitialisation. Le backend répond la même chose
// que l'adresse existe ou non — ne rien en déduire côté interface.
export async function requestPasswordReset(email) {
    const response = await api.post(`/auth/forgot-password`, { email });
    return response.data.message;
}

// Vérifie un lien avant d'afficher le formulaire de nouveau mot de passe.
export async function verifyResetToken(token) {
    const response = await api.post(`/auth/reset-password/verify`, { token });
    return response.data.valid === true;
}

// Applique le nouveau mot de passe. Le backend révoque toutes les sessions
// existantes : on remet donc l'état local à l'état déconnecté.
export async function resetPassword(token, password) {
    await api.post(`/auth/reset-password`, { token, password });
    state.user = null;
}

// Rétablit la session depuis le cookie httpOnly au démarrage de l'app.
export async function fetchMe() {
    try {
        const response = await api.get(`/auth/me`);
        state.user = response.data.user;
    } catch {
        state.user = null;
    } finally {
        state.loading = false;
    }
}

// Même appel que fetchMe, mais mémoïsé : App.vue et les gardes de route se
// partagent une seule requête /auth/me, et les gardes peuvent l'attendre au lieu
// de décider sur un état encore en cours de chargement.
let sessionPromise = null;
export function ensureSession() {
    if (!sessionPromise) sessionPromise = fetchMe();
    return sessionPromise;
}

// L'état courant, sans passer par les computed (utilisable hors composant).
export const isAuthenticated = () => !!state.user;
export async function logout() {
    try {
        await api.post(`/auth/logout`);
    } finally {
        state.user = null;
    }
}
export function useAuth () {
    return {
        user: computed(() => state.user),
        isLoggedIn: computed(() => !!state.user),
        isAdmin: computed(() => state.user?.role === 'admin'),
        loading: computed(() => state.loading),
        login, logout, register, fetchMe,
        requestPasswordReset, verifyResetToken, resetPassword,
    }
}