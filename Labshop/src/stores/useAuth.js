import { reactive, computed } from "vue";
import { apiUrl } from "@/config";
import axios from "axios";

const state = reactive({
    user: null,
    loading: true,
});
export async function register(playload) {
    const response = await axios.post(`${apiUrl}/auth/register`, playload);
    const { user } = response.data;
    state.user = user;
    return user;
}
export async function login(email, password) {
    try {
        const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
        const { user } = response.data;
        state.user = user;
        return user;
    } catch (error) {
        alert(error);
    } finally {
        state.loading = false;
    }
}
// export async function login(email, password) {
//     try {
//         const { user } = await axios.post(`${apiUrl}/auth/login`, { email, password });
//         console.log(user);
//         state.user = user;
//         return user;
//     } catch (error) {
//         alert(error);
//     } finally {
//         state.loading = false;
//     }
// }
export async function logout() {}
export function useAuth () {
    return {
        user: computed(() => state.user),
        isLoggedIn: computed(() => !!state.user),
        isAdmin: computed(() => state.user?.role === 'admin'),
        loading: computed(() => state.loading),
        login, logout, register,
    }
}