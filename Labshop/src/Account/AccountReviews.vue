<template>
    <div class="view">
        <header class="view-header">
            <h1>Mes commentaires</h1>
            <p class="subtitle">Les avis que vous avez laissés sur les produits commandés.</p>
        </header>

        <!-- Aucun commentaire : l'API des avis n'existe pas encore côté serveur. -->
        <div v-if="!reviews.length" class="panel panel-empty">
            <span class="panel-icon pi pi-comments" aria-hidden="true"></span>
            <p class="panel-title">Aucun commentaire</p>
            <p class="panel-text">
                Vous n'avez encore laissé aucun avis. Après réception d'une commande,
                vous pourrez noter et commenter les produits achetés.
            </p>
            <router-link to="/products" class="btn btn-filled">Voir nos produits</router-link>
        </div>

        <div v-else class="review-list">
            <article v-for="review in reviews" :key="review.id" class="review-card">
                <div class="review-head">
                    <router-link :to="`/products/${review.productId}`" class="review-product">
                        {{ review.productName }}
                    </router-link>
                    <span class="review-date">{{ formatDate(review.date) }}</span>
                </div>
                <div class="review-rating" :aria-label="`${review.rating} sur 5`">
                    <span
                        v-for="star in 5"
                        :key="star"
                        class="pi"
                        :class="star <= review.rating ? 'pi-star-fill filled' : 'pi-star'"
                        aria-hidden="true"
                    ></span>
                </div>
                <p class="review-text">{{ review.comment }}</p>
            </article>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Aucune route d'avis n'est encore exposée par l'API : la liste reste vide
// et la vue affiche son état vide. Le rendu ci-dessus est prêt pour le branchement.
const reviews = ref([]);

const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.view {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    color: var(--primaryColor);
}
.view-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
.view-header h1 {
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: -0.01em;
}
.subtitle {
    font-size: 0.95rem;
    color: #666;
    font-weight: 300;
}

.review-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.review-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 10px;
    padding: 1.25rem 1.5rem;
}
.review-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
}
.review-product {
    font-size: 0.95rem;
    font-weight: 600;
    color: inherit;
    text-decoration: none;
}
.review-product:hover {
    text-decoration: underline;
}
.review-date {
    font-size: 0.8rem;
    color: rgba(0, 0, 0, 0.56);
}
.review-rating {
    display: flex;
    gap: 0.15rem;
    font-size: 0.8rem;
    color: #d5d7da;
}
.review-rating .filled {
    color: #f0a500;
}
.review-text {
    font-size: 0.9rem;
    line-height: 1.6;
    font-weight: 300;
    color: #3f454b;
}

.panel {
    background: #fff;
    border: 1px solid var(--lightgray);
    border-radius: 12px;
}
.panel-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.5rem;
    padding: 3rem 1.5rem;
}
.panel-icon {
    font-size: 1.6rem;
    color: #9aa0a6;
    margin-bottom: 0.25rem;
}
.panel-title {
    font-size: 1.05rem;
    font-weight: 600;
}
.panel-text {
    font-size: 0.9rem;
    color: #666;
    font-weight: 300;
    line-height: 1.6;
    max-width: 420px;
    margin-bottom: 0.75rem;
}

.btn {
    display: inline-block;
    padding: 0.55rem 1.3rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid var(--primaryColor);
    transition: opacity 0.2s ease;
}
.btn-filled {
    background-color: var(--primaryColor);
    color: #fff;
}
.btn:hover {
    opacity: 0.85;
}

@media (max-width: 600px) {
    .view-header h1 {
        font-size: 1.35rem;
    }
}
</style>