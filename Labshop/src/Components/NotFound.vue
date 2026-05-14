<template>
  <div class="not-found">
    <div class="not-found-content">
      <p class="code">404</p>
      <h1 class="title">Page introuvable</h1>
      <p class="message">
        Pas de panique ! La page que vous recherchez n'existe pas ou a été déplacée.<br />
        Retournez vers une page familière.
      </p>
      <div class="actions">
        <router-link to="/" class="btn btn-filled">Accueil</router-link>
        <router-link to="/products" class="btn btn-outlined">Voir les produits</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background-color: var(--bg);
  font-family: Arial, sans-serif;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  max-width: 520px;
}

.code {
  font-size: clamp(5rem, 20vw, 9rem);
  font-weight: 700;
  color: var(--lightgray);
  line-height: 1;
  margin: 0;
  letter-spacing: -0.04em;
}

.title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--primaryColor);
  margin: 0;
}

.message {
  font-size: 1rem;
  font-weight: 300;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.4rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.btn-filled {
  background-color: var(--primaryColor);
  border: 1px solid var(--primaryColor);
  color: #fff;
}
.btn-outlined {
  background-color: transparent;
  border: 1px solid var(--primaryColor);
  color: var(--primaryColor);
}
.btn:hover {
  opacity: 0.8;
}

@media (max-width: 640px) {
  .not-found {
    min-height: calc(100vh - 60px);
  }
  .actions {
    flex-direction: column;
    width: 100%;
  }
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
