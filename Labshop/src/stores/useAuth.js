import { reactive, computed } from 'vue';
import http from '../api/http.js';

const state = reactive({
    user: null,
    loading: true,
});

async function fetchMe() {
    try {
        const { user } = await http.get('/auth/me');
        state.user = user;
    } catch {
        state.user = null;
    } finally {
        state.loading = false;
    }
}

async function login(email, password) {
    const { user } = await http.post('/auth/login', { email, password });
    state.user = user;
    return user;
}

async function register(payload) {
    const { user } = await http.post('/auth/register', payload);
    state.user = user;
    return user;
}

async function logout() {
    await http.post('/auth/logout');
    state.user = null;
}

export function useAuth() {
    return {
        user:       computed(() => state.user),
        isLoggedIn: computed(() => !!state.user),
        isAdmin:    computed(() => state.user?.role === 'admin'),
        loading:    computed(() => state.loading),
        fetchMe, login, register, logout,
    };
}