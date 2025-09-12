<template>
    <form class="form" @submit.prevent="handleSubmit">
        <!-- Section Contact -->
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
              <SelectReceptionMode :ReceptionType="receptionType" @receptionTypeChanged="handleReceptionTypeChange"/>
            </div>
            <div class="form-group">
                <label for="addresse">Adresse</label>
                <input type="text" id="addresse" v-model="form.addresse" placeholder="123 rue Exemple" />
                <small v-if="errors.addresse" class="error">{{ errors.addresse }}</small>
            </div>
            <div class="form-inline">
              <div class="form-group">
                  <label for="city">Ville</label>
                  <input type="text" id="city" v-model="form.city" placeholder="Votre ville" />
                  <small v-if="errors.city" class="error">{{ errors.city }}</small>
              </div>
              <div class="form-group">
                  <label for="postal-code">Code Postal</label>
                  <input type="text" id="postal-code" inputmode="numeric" v-model="form.postalCode" placeholder="12345" maxlength="5" @input="formatPostalCode"/>
                  <small v-if="errors.postalCode" class="error">{{ errors.postalCode }}</small>
              </div>
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
                    v-model="form.card.number"
                    placeholder="1234 5678 9012 3456"
                    @input="formatCardNumber"/>
                <small v-if="errors.cardNumber" class="error">{{ errors.cardNumber }}</small>
            </div>
            <div class="form-inline">
                <div class="form-group">
                    <label for="expiration">Expiration</label>
                    <input type="text" id="expiration" v-model="form.card.expiration" placeholder="MM/AA" maxlength="5" @input="formatExpiration"/>
                    <small v-if="errors.expiration" class="error">{{ errors.expiration }}</small>
                </div>
                <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" inputmode="numeric" autocomplete="cc-number" v-model="form.card.cvv" placeholder="Code de sécurité" @input="formatCVV" maxlength="4"/>
                    <small v-if="errors.cvv" class="error">{{ errors.cvv }}</small>
                </div>
            </div>
            <div class="form-group">
                <label for="card">Nom sur la carte</label>
                <input 
                    id="card"
                    type="text"
                    inputmode="numeric"
                    v-model="form.card.name"
                    placeholder="Nom sur la carte"
                    @input="formatCardName"/>
                <small v-if="errors.cardName" class="error">{{ errors.cardName }}</small>
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
import SelectReceptionMode from './SelectReceptionMode.vue';

// const form = ref({
//     name: '',
//     prename: '',
//     email: '',
//     phone: '',
//     addresse: '',
//     city: '',
//     postalCode: '',
//     card: '',
//     expiration: '',
//     cvv: '',
// });
const form = ref({
    name: '',
    prename: '',
    email: '',
    phone: '',
    addresse: '',
    city: '',
    postalCode: '',
    card: { 
      number: '',
      expiration: '',
      cvv: '',
      name: ''
    },
});
const receptionType = ref(0); // 0 -> Expédition 1 -> Pickup
const errors = ref({});
const phoneIsValid = ref(false);

//  Fonctions de formatage des entrées
function formatExpiration() {
  const number = keepDigitsOnly(form.value.card.expiration);
  // Ajoute une barre oblique à chaque 2 chiffres
  form.value.card.expiration = number.replace(/(.{2})(?=.)/g, "$1/");
}
function formatCVV() {
  const number = keepDigitsOnly(form.value.card.cvv);
  form.value.card.cvv = number;
}
function formatPostalCode() {
  const number = keepDigitsOnly(form.value.postalCode);
  form.value.postalCode = number;
}
function formatCardNumber() {
    let number = keepDigitsOnly(form.value.card.number);
    number = number.slice(0, 16); // max 16 chiffres
    // Ajout d'espaces tous les 4 chiffres 
    form.value.card.number = number.replace(/(.{4})(?=.)/g, "$1 ");
}
function formatCardName() {
  const cardName = form.value.card.name;
  const cardNameToUpper = cardName.toUpperCase();
  form.value.card.name =  cardNameToUpper;
}
function keepDigitsOnly(value) {
  return value.replace(/\D/g, ""); // garder seulement chiffres
}
function onPhoneValidate({ valid, number }) {
    phoneIsValid.value = valid;
    if (valid) form.value.phone = number;
}
function validateForm() {
    errors.value = {};
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.value.name) {
        errors.value.name = "Le nom est requis";
        valid = false;
    }
    if (!form.value.prename) {
        errors.value.prename = "Le prenom est requis";
        valid = false;
    }
    if (!form.value.email || !emailRegex.test(form.value.email)) {
        errors.value.email = "Adresse courriel invalide";
        valid = false;
    }
    if (!phoneIsValid.value) {
        errors.value.phone = "Numéro de téléphone invalide";
        valid = false;
    }
    if (!form.value.card.number) {
        errors.value.cardNumber = "Numéro de carte requis";
        valid = false;
    }
    if (!form.value.card.expiration) {
        errors.value.expiration = "Date d'expiration requise";
        valid = false;
    }
    if (!form.value.cvv) {
        errors.value.cvv = "Code CVV requis";
        valid = false;
    }
    if (!form.value.card.name) {
        errors.value.cardName = "Nom sur la carte requis";
        valid = false;
    }
    return valid;
}

function handleSubmit() {
    if(!validateForm()) return;
}
function handleReceptionTypeChange(value) {
  receptionType.value = value;
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
select {
      -webkit-appearance: none; /* For WebKit browsers (Chrome, Safari) */
      -moz-appearance: none; /* For Mozilla browsers (Firefox) */
      appearance: none; /* Standard property */
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
  width: 100%;
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