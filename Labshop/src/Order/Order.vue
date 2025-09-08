<template>
    <div class="back-color"></div>
        <div class="main">
            <div class="left">
                <!-- Section Informations client -->
                <section class="section">
                    <h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon">
                        <path d="M20 21v-2a4 4 0 0 0-3-3.87M4 21v-2a4 4 0 0 1 3-3.87M16 3.13a4 4 0 0 1 0 7.75M8 3.13a4 4 0 0 0 0 7.75"/>
                    </svg>
                    Informations client
                    </h2>
                    <form class="form">
                    <div class="form-group">
                        <label for="nom">Nom complet</label>
                        <input type="text" id="nom" placeholder="Entrez votre nom" />
                    </div>
                    <div class="form-group-row">
                        <div class="form-group">
                            <label for="nom">Nom</label>
                            <input type="text" id="nom" placeholder="Entrez votre nom" />
                        </div>
                        <div class="form-group">
                            <label for="nom">Prenom</label>
                            <input type="text" id="nom" placeholder="Entrez votre nom" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">Courriel</label>
                        <input type="email" id="email" placeholder="exemple@mail.com" />
                    </div>
                    <div class="form-group">
                        <label for="telephone">Téléphone</label>
                        <input type="tel" id="telephone" placeholder="(000) 000-0000" />
                    </div>
                    </form>
                </section>

                <!-- Section Livraison -->
                <section class="section">
                    <h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon">
                        <path d="M3 7h18M6 10h12l3 6H3l3-6z"/>
                        <circle cx="9" cy="19" r="2"/>
                        <circle cx="15" cy="19" r="2"/>
                    </svg>
                    Livraison
                    </h2>
                    <form class="form">
                    <div class="form-group">
                        <label for="adresse">Adresse</label>
                        <input type="text" id="adresse" placeholder="123 rue Exemple" />
                    </div>
                    <div class="form-group">
                        <label for="ville">Ville</label>
                        <input type="text" id="ville" placeholder="Votre ville" />
                    </div>
                    </form>
                </section>

                <!-- Section Paiement -->
                <section class="section">
                    <h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="icon">
                        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    Paiement
                    </h2>
                    <form class="form">
                    <div class="form-group">
                        <label for="carte">Numéro de carte</label>
                        <input type="text" id="carte" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div class="form-inline">
                        <div class="form-group">
                        <label for="expiration">Expiration</label>
                        <input type="text" id="expiration" placeholder="MM/AA" />
                        </div>
                        <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" />
                        </div>
                    </div>
                    </form>
                    <div class="submit-container">
                        <button type="submit" class="btn-submit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="icon">
                            <path d="M5 12l5 5L20 7" />
                            </svg>
                            Passer la commande
                        </button>
                    </div>
                </section>
            </div>
            <div class="right grid-row-1-position">
                <OrderSummary />
            </div>
        </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import OrderSummary from './OrderSummary.vue';
const router = useRouter();

const isCartEmpty = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    return cart.length === 0;
}
onMounted(() => {
    // Si le panier est vide, revenir à la page d'accueil
    isCartEmpty() && router.replace('/');
});
</script>

<style scoped>
.back-color {
    top: 71px;
    right: 0;
    position: absolute;
    width: 50%;
    height: calc(100%);
    background-color: rgb(237, 237, 237);
    z-index: -1;
}
.main {
    width: 75%;
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
}
.left {
    height: 100lvh;
    border-right: 1px solid lightgray;
    padding: 2.5rem 2.5rem 2.5rem 0;
}
.right {
    background-color: rgb(237, 237, 237);
    padding:2.5rem 0 2.5rem 2.5rem;
}
/* Section de gauche */
.section {
  margin-bottom: 30px;
}
.section h2 {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  margin-bottom: 15px;
  gap: 8px;
}
.icon {
  color: #333;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.form-group-row {
  margin-bottom: 15px;
  display: flex;
  width: 100%;
}
.form-group label {
  font-size: 0.9em;
  margin-bottom: 5px;
}
.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95em;
}
.form-inline {
  display: flex;
  gap: 10px;
}
.submit-container {
  margin-top: 20px;
}
.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.btn-submit:hover {
  background-color: #555;
}
.btn-submit .icon {
  stroke: white;
}

@media (max-width: 1000px) {
    .main {
        grid-template-columns: 1fr;
    }
    .back-color {
        display: none;
    }
    .left {
        border-right: none;
        padding: 0;
        padding-top: 1rem;
    }
    .right {
        padding: 0;
    }
    .main {
        display: grid;
        grid-row: 1fr;
        grid-template-rows: auto;
    }
    .grid-row-1-position {
        grid-row-start: 1;
    }
}
</style>