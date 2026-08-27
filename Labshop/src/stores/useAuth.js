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
    }
}