<template>
    <form class="form" @submit.prevent="handleSubmit">
        <!-- Contact -->
        <section class="section">
            <h2>Contact</h2>
            <div class="form-inline">
                <div class="form-group">
                    <label for="nom">Nom</label>
                    <input type="text" id="nom" v-model="form.name" placeholder="Votre nom"/>
                    <small v-if="errors.name" class="error">{{ errors.name }}</small>
                </div>
                <div class="form-group">
                    <label for="nom">Prenom</label>
                    <input type="text" id="nom" v-model="form.prename" placeholder="Votre prenom" />
                    <small v-if="errors.prename" class="error">{{ errors.prename }}</small>
                </div>
            </div>
            <div class="form-group">
                <label for="email">Courriel</label>
                <input type="email" id="email" v-model="form.email" placeholder="exemple@mail.com" />
                <small v-if="errors.email" class="error">{{ errors.email }}</small>
            </div>
            <div class="form-group">
                <label for="phone">Téléphone</label>
                <vue-tel-input
                    id="phone"
                    v-model="form.phone"
                    :class="['custom-tel-input', { invalid: !phoneIsValid }]"
                    @validate="onPhoneValidate"
                    :inputOptions="{ placeholder: 'Numéro de téléphone' }"
                />
                <!-- <small v-if="!phoneIsValid" class="error">Numéro invalide</small> -->
                <small v-if="errors.phone" class="error">{{ errors.phone }}</small>
            </div>
        </section>

        <!-- Section Livraison -->
        <section class="section">
            <h2>Livraison</h2>
            <div class="form-group">
                <label for="addresse">Adresse</label>
                <input type="text" id="addresse" v-model="form.addresse" placeholder="123 rue Exemple" />
                <small v-if="errors.addresse" class="error">{{ errors.addresse }}</small>
            </div>
            <div class="form-group">
                <label for="city">Ville</label>
                <input type="text" id="city" v-model="form.city" placeholder="Votre ville" />
                <small v-if="errors.city" class="error">{{ errors.city }}</small>
            </div>
        </section>

        <!-- Section Paiement -->
        <section class="section">
            <h2>Paiement</h2>
            <div class="form-group">
                <label for="card">Numéro de carte</label>

                <input 
                    id="card"
                    type="text"
                    inputmode="numeric"
                    autocomplete="cc-number"
                    v-model="form.card"
                    placeholder="1234 5678 9012 3456"
                    @input="formatCardNumber"/>
                <small v-if="errors.card" class="error">{{ errors.card }}</small>
            </div>
            <div class="form-inline">
                <div class="form-group">
                    <label for="expiration">Expiration</label>
                    <input type="text" id="expiration" v-model="form.expiration" placeholder="MM/AA" />
                    <small v-if="errors.expiration" class="error">{{ errors.expiration }}</small>
                </div>
                <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" v-model="form.cvv" placeholder="123" />
                    <small v-if="errors.cvv" class="error">{{ errors.cvv }}</small>
                </div>
            </div>
        </section>
        
        <!-- Bouton de soumission -->
        <div class="submit-container">
            <button type="submit" class="btn-submit">Passer la commande</button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
    name: '',
    prename: '',
    email: '',
    phone: '',
    addresse: '',
    city: '',
    card: '',
    expiration: '',
    cvv: '',
});
const errors = ref({});
const phoneIsValid = ref(false);

function formatCardNumber(e) {
    let number = form.value.card.replace(/\D/g, ""); // garder seulement chiffres
    number = number.slice(0, 16); // max 16 chiffres
    
    // Ajout d'espaces tous les 4 chiffres 
    form.value.card = number.replace(/(.{4})(?=.)/g, "$1 ");
}
function onPhoneValidate({ valid, number }) {
    phoneIsValid.value = valid;
    if (valid) form.value.phone = number;
}
function validateForm() {
    errors.value = {};
    let valid = true;

    if (!form.value.name) {
        errors.value.name = "Le nom est requis";
        valid = false;
    }
    if (!form.value.prename) {
        errors.value.prename = "Le prenom est requis";
        valid = false;
    }
    if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = "Adresse courriel invalide";
        valid = false;
    }
    if (!phoneIsValid.value) {
        errors.value.phone = "Numéro de téléphone invalide";
        valid = false;
    }
    if (!form.value.card) {
        errors.value.card = "Numéro de carte requis";
        valid = false;
    }
    if (!form.value.expiration) {
        errors.value.expiration = "Date d'expiration requise";
        valid = false;
    }
    if (!form.value.cvv) {
        errors.value.cvv = "Code CVV requis";
        valid = false;
    }

    return valid;
}

function handleSubmit() {
    if(!validateForm()) return;
}
</script>

<style scoped>
/* Pour Chrome, Safari, Edge, and Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Pour Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
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
</style>