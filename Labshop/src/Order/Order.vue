<template>
    <div class="back-color"></div>
        <div class="main">
            <div class="left">
                <!-- Contact -->
                <section class="section">
                    <h2>Contact</h2>
                    <form class="form">
                        <div class="form-group-row">
                            <div class="form-group">
                                <label for="nom">Nom</label>
                                <input type="text" id="nom" placeholder="Votre nom" />
                            </div>
                            <div class="form-group">
                                <label for="nom">Prenom</label>
                                <input type="text" id="nom" placeholder="Votre prenom" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email">Courriel</label>
                            <input type="email" id="email" placeholder="exemple@mail.com" />
                        </div>
                        <div class="form-group">
                            <label for="telephone">Téléphone</label>
                            <vue-tel-input
                                id="telephone"
                                v-model="phone"
                                :class="['custom-tel-input', { invalid: !phoneIsValid }]"
                                @validate="onPhoneValidate"
                                :inputOptions="{ placeholder: 'Numéro de téléphone' }"
                            />
                            <small v-if="!phoneIsValid" class="error">Numéro invalide</small>
                        </div>
                        <!-- <div class="form-group">
                            <label for="telephone">Téléphone</label>
                            <input type="tel" id="telephone" placeholder="(+228) 00 000 00" />
                        </div> -->
                    </form>
                </section>

                <!-- Section Livraison -->
                <section class="section">
                    <h2>Livraison</h2>
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
                    <h2>Paiement</h2>
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
import { ref } from 'vue';

const router = useRouter();
const phone = ref('');
const phoneIsValid = ref(false);

const tr = ref(true);
function onPhoneValidate({ valid, number, country, dialCode }) {
    phoneIsValid.value = valid;
    if (valid) {
        phone.value = number;
    }
    console.log('Valid', valid, 'Number', number, 'Country', country, 'Dial', dialCode);
}

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
  font-size: 1.3em;
  font-weight: 900;
  margin-bottom: 15px;
  gap: 8px;
}
.icon {
  color: #c51f1f;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.form-group-row {
  display: flex;
  gap: 15px;
}
.form-group label {
  font-size: 0.9em;
  margin-bottom: 5px;
}
.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.85em;
}
.form-group input:focus {
  border-color: #333 !important;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.1) !important;
  outline: none !important;
}
.form-inline {
  display: flex;
  gap: 10px;
}
.custom-tel-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.85em;
    max-height: 40.79px;
}
.invalid {
  border-color: red !important;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.1) !important;
}
.error {
  color: red;
  font-size: 0.8em;
  margin-top: 4px;
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
:deep(.vue-tel-input:focus-within) {    
    border-color: #333 !important;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1) !important;
}
:deep(.vue-tel-input.invalid:focus-within) {
  border-color: red !important;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.1) !important;
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