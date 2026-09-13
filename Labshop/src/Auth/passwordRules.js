// Règles de mot de passe partagées par la modale d'inscription (AuthModal.vue) et
// l'écran de réinitialisation (ResetPassword.vue).
// Elles doivent refléter validatePassword() côté backend (authController.js).
export function getPasswordRules(password) {
    const pwd = password ?? '';
    return [
        { key: 'length',  label: 'Au moins 8 caractères',      valid: pwd.length >= 8 },
        { key: 'upper',   label: 'Une lettre majuscule (A-Z)', valid: /[A-Z]/.test(pwd) },
        { key: 'lower',   label: 'Une lettre minuscule (a-z)', valid: /[a-z]/.test(pwd) },
        { key: 'digit',   label: 'Un chiffre (0-9)',           valid: /[0-9]/.test(pwd) },
        { key: 'special', label: 'Un caractère spécial',       valid: /[^A-Za-z0-9]/.test(pwd) },
    ];
}

export const isPasswordAcceptable = (password) => getPasswordRules(password).every(rule => rule.valid);
