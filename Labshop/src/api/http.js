import { apiUrl } from '../config.js';

async function request(path, { method = 'GET', body } = {}) {
    const res = await fetch(`${apiUrl}${path}`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
    return data;
}

export default {
    get:  (path)       => request(path),
    post: (path, body) => request(path, { method: 'POST', body }),
};