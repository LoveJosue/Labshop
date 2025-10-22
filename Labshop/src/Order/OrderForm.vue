<template>
  <div class="ctn">
    <form class="form padding-btm-5" @submit.prevent="handleSubmit" @keydown.enter.prevent>
        <!-- Section Contact -->
        <section class="section">
            <h2>Contact</h2>
            <div class="form-group">
                <label for="email">Courriel</label>
                <input type="email" id="email" v-model="form.email" placeholder="exemple@mail.com" @input="form.email ? errors.email = '' : errors.email = 'Entrez un email'" @blur="isEmailValid"/>
                <small v-if="errors.email" class="error">{{ errors.email }}</small>
            </div>
        </section>

        <!-- Section Livraison -->

        <section class="section">
            <h2>Livraison</h2>
            <div class="form-group">
              <SelectReceptionMode :ReceptionType="receptionType" @receptionTypeChanged="handleReceptionTypeChange"/>
            </div>

            <!-- Si expédition -->

            <section class="section" v-if="receptionType === 0">
              <div class="form-inline">
                <div class="form-group">
                    <label for="nom">Nom</label>
                    <input type="text" id="nom" v-model="form.name" placeholder="Votre nom" @input="form.name ? errors.name = '' : errors.name='Saisissez votre nom'"/>
                    <small v-if="errors.name" class="error">{{ errors.name }}</small>
                </div>
                <div class="form-group">
                    <label for="prenom">Prénom</label>
                    <input type="text" id="prenom" v-model="form.prename" placeholder="Votre prénom" @input="form.prename ? errors.prename = '' : errors.prename='Saisissez votre prénom'"/>
                    <small v-if="errors.prename" class="error">{{ errors.prename }}</small>
                </div>
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
                <small v-if="errors.phone" class="error">{{ errors.phone }}</small>
              </div>
              <div class="form-group">
                  <label for="addresse">Adresse</label>
                  <input type="text" id="addresse" v-model="form.addresse" placeholder="- 123 rue exemple - ou - repère proche -" @input="form.addresse ? errors.addresse = '' : errors.addresse='Saisissez votre adresse de livraison'" @blur="checkFullShippingAddresse"/>
                  <small v-if="errors.addresse" class="error">{{ errors.addresse }}</small>
              </div>
              <div class="form-inline">
                <div class="form-group">
                    <label for="city">Ville</label>
                    <input type="text" id="city" v-model="form.city" placeholder="Votre ville" @input="form.city ? errors.city = '' : errors.city='Saisissez votre ville'" @blur="checkFullShippingAddresse"/>
                    <small v-if="errors.city" class="error">{{ errors.city }}</small>
                </div>
                <div class="form-group">
                    <label for="postal-code">Code Postal</label>
                    <input type="text" id="postal-code" inputmode="numeric" v-model="form.postalCode" placeholder="12345 (optionnel)" maxlength="5" @input="formatPostalCode"/>
                </div>
              </div>
              <h3>Point de livraison</h3>
              <div class="form-inline">
                <div class="form-group">
                  <label for="latitude">Latitude</label>
                  <input type="text" id="latitude" v-model="form.latitude" placeholder="Ex: 6.171015 (optionnelle)" @input="form.latitude = sanitizeGpsInput(form.latitude, 'lat')" disabled>
                  <!-- <small v-if="errors.latitude" class="error">{{ errors.latitude }}</small> -->
                </div>
                <div class="form-group">
                  <label for="longitude">Longitude</label>
                  <input type="text" id="longitude" v-model="form.longitude" placeholder="Ex: -1.25152 (optionnelle)" @input="form.longitude = sanitizeGpsInput(form.longitude, 'lng')" disabled>
                  <!-- <small v-if="errors.longitude" class="error">{{ errors.longitude }}</small> -->
                </div>
              </div>
              <div class="option-marker">
                <div></div>
                <p>OU</p>
                <div></div>
              </div>
              <div class="form-group">
                <div class="location-button" @click="getCurrentLocation">
                  <!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M541.9 139.5C546.4 127.7 543.6 114.3 534.7 105.4C525.8 96.5 512.4 93.6 500.6 98.2L84.6 258.2C71.9 263 63.7 275.2 64 288.7C64.3 302.2 73.1 314.1 85.9 318.3L262.7 377.2L321.6 554C325.9 566.8 337.7 575.6 351.2 575.9C364.7 576.2 376.9 568 381.8 555.4L541.8 139.4z"/>
                  </svg>
                  <p>Utiliser ma position actuelle</p>
                </div>
                <small v-if="locationError" class="error-secondary">{{ locationError }}</small>
              </div>
            </section>

            <!-- Si cueillette -->

            <section class="section" v-if="receptionType === 1">
              <h3>Lieu de cueillette</h3>
              <div class="form-group">
              </div>
              <SelectPickUpLocation @pickupPlaceChanged="handlePickUpPlaceChange"/>
            </section>
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
                  @input="ckeckCardNumber"
                  @blur="isCardNumberValid"
                />
                <small v-if="errors.cardNumber" class="error">{{ errors.cardNumber }}</small>
            </div>
            <div class="form-inline">
                <div class="form-group">
                    <label for="expiration">Date d'expiration</label>
                    <input 
                      type="text" 
                      id="expiration" 
                      inputmode="numeric" 
                      v-model="form.card.expiration" 
                      placeholder="MM/AA" 
                      maxlength="5" 
                      @input="checkExpireDate" 
                      @blur="isExpireDateValid"
                    />
                    <small v-if="errors.expiration" class="error">{{ errors.expiration }}</small>
                </div>
                <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input 
                      type="text" 
                      id="cvv" 
                      inputmode="numeric" 
                      autocomplete="cc-number" 
                      v-model="form.card.cvv" 
                      placeholder="Code de sécurité" 
                      maxlength="4" 
                      @input="checkCVVNumber" 
                      @blur="isCvvValid"/>
                    <small v-if="errors.cvv" class="error">{{ errors.cvv }}</small>
                </div>
            </div>
            <div class="form-group">
                <label for="cardName">Nom sur la carte</label>
                <input 
                    id="cardName"
                    type="text"
                    v-model="form.card.name"
                    placeholder="Nom sur la carte"
                    @input="checkCardName"
                    />
                <small v-if="errors.cardName" class="error">{{ errors.cardName }}</small>
            </div>
            <div class="form-group" v-if="receptionType === 0">
              <CheckBoxComponent v-model:selected="invoiceAddressAsShippingAddress" :text="CHCK_BOX_TEXT_1"/>
            </div>

            <!-- Section adresse de dresse de factuation -->
            <section class="section" v-if="!invoiceAddressAsShippingAddress || receptionType === 1">
              <h3>Adresse de facturation</h3>
              <div class="form-inline">
                  <div class="form-group">
                      <label for="billingName">Nom</label>
                      <input type="text" id="billingName" v-model="form.billing.name" placeholder="Votre nom" @input="form.billing.name ? errors.billingName = '' : errors.billingName = 'Saisissez votre nom'"/>
                      <small v-if="errors.billingName" class="error">{{ errors.billingName }}</small>
                  </div>
                  <div class="form-group">
                      <label for="billingPrename">Prénom</label>
                      <input type="text" id="billingPrename" v-model="form.billing.prename" placeholder="Votre prénom" @input="form.billing.prename ? errors.billingPrename = '' : errors.billingPrename = 'Saisissez votre prénom'"/>
                      <small v-if="errors.billingPrename" class="error">{{ errors.billingPrename }}</small>
                  </div>
              </div>
              <div class="form-group">
                  <label for="billingAddress">Adresse</label>
                  <input type="text" id="billingAddress" v-model="form.billing.address" placeholder="- 123 rue exemple - ou repère" @input="form.billing.address ? errors.billingAddress = '' : errors.billingAddress = 'Saisissez votre adresse de facturation'"/>
                  <small v-if="errors.billingAddress" class="error">{{ errors.billingAddress }}</small>
              </div>
              <div class="form-inline">
                <div class="form-group">
                    <label for="billingCity">Ville</label>
                    <input type="text" id="billingCity" v-model="form.billing.city" placeholder="Votre ville" @input="form.billing.city ? errors.billingCity = '' : errors.billingCity = 'Saisissez le nom de la ville'"/>
                    <small v-if="errors.billingCity" class="error">{{ errors.billingCity }}</small>
                </div>
                <div class="form-group">
                    <label for="billingPostalCode">Code Postal</label>
                    <input type="text" id="billingPostalCode" inputmode="numeric" v-model="form.billing.postalCode" placeholder="12345 (optionnel)" maxlength="5" @input="formatPostalCode"/>
                </div>
              </div>
              <div class="form-group">
                  <label for="phone">Téléphone</label>
                  <vue-tel-input
                      id="phone"
                      v-model="form.billing.phone"
                      :class="['custom-tel-input', { invalid: !billingPhoneIsValid }]"
                      @validate="onBillingPhoneValidate"
                      :inputOptions="{ placeholder: 'Numéro de téléphone' }"
                  />
                  <small v-if="errors.billingPhone" class="error">{{ errors.billingPhone }}</small>
              </div>
            </section>
        </section>

        <!-- <section class="section summary">
          <h2 class="summay-header">
            Résumé d'achat 
            <p v-if="!cartHasOneItem" @click="toggleSummary">
              {{!showSummary ? 'Afficher' : 'Réduire'}}
              <svg
                    class="arrow"
                    :class="{ open: showSummary }"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </p>
          </h2>
          <div class="form-group margin-btm-0">
            <OrderSummaryV2 
              :showSummary="showSummary" 
              :receptionType="receptionType" 
              :shippingInfos="shippingInfos
            "/>
          </div>
        </section> -->
        
        <!-- Bouton de soumission -->
        <section class="section">
          <div class="form-group margin-btm-0">
            <button type="submit" class="btn-submit">Payer</button>
          </div>
        </section>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import SelectReceptionMode from './SelectReceptionMode.vue';
import CheckBoxComponent from '@/Components/CheckBoxComponent.vue';
import SelectPickUpLocation from './SelectPickUpLocation.vue';
import OrderSummaryV2 from './OrderSummaryV2.vue';
import axios from 'axios';
import { apiUrl } from '@/config';

const props = defineProps({
  shippingInfos: {
    type: Object,
    default: () => ({})
  },
  billInfos : {
    type: Object,
    default: () => ({})
  }
});

const CHCK_BOX_TEXT_1 = "Utiliser l'adresse de livraison comme adresse de facturation.";
const CART = 'cart';
const ZERO = 0;
const ONE = 1;

const showSummary = ref(false);
const cart = ref([]);

const emit = defineEmits(['receptionTypeChanged', 'update:shippingInfos']);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invoiceAddressAsShippingAddress = ref(true);
const receptionType = ref(0); // 0 -> Expédition 1 -> Pickup
const pickUpPlace = ref('');
const phoneIsValid = ref(false);
const billingPhoneIsValid = ref(false);
const form = ref({
    name: '',
    prename: '',
    email: '',
    phone: '',
    addresse: '',
    city: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    card: { 
      number: '',
      expiration: '',
      cvv: '',
      name: ''
    },
    billing : {
      prename: '',
      name: '',
      address: '',
      city: '',
      postalCode: '',
      phone: ''
    }
});
// const errors = ref({});
const errors = ref({
  // Contact
  email: '',

  // Livraison (expédition)
  name: '',
  prename: '',
  phone: '',
  addresse: '',
  city: '',
  // latitude: '', // optionnel
  // longitude: '', // optionnel

  // Paiement
  cardNumber: '',
  expiration: '',
  cvv: '',
  cardName: '',

  // Adresse de facturation
  billingName: '',
  billingPrename: '',
  billingAddress: '',
  billingCity: '',
  billingPhone: ''
});

function resetErrorsForShippingWithInvoiceAddressAsShippingOne() {
  const preservedKeys = [
    'email','name', 'prename', 'phone', 'addresse',
    'city', 'cardNumber', 'expiration', 'cvv', 'cardName',
  ]

  for (const key in errors.value) {
    if (!preservedKeys.includes(key)) {
      errors.value[key] = ''
    }
  }
}
function resetErrorsForShipping() {
  const preservedKeys = [
    'email','cardNumber', 'expiration', 'cvv', 'cardName'
  ]

  for (const key in errors.value) {
    if (!preservedKeys.includes(key)) {
      errors.value[key] = ''
    }
  }
}
function resetErrorsForPickup() {
  const preservedKeys = [
    'email','cardNumber', 'expiration', 'cvv', 'cardName',
    'billingName', 'billingPrename', 'billingAddress',
    'billingCity', 'billingPhone'
  ]

  for (const key in errors.value) {
    if (!preservedKeys.includes(key)) {
      errors.value[key] = ''
    }
  }
}

// Vérifie si le formulaire contient au moins une erreur
const hasErrors = computed(() =>
  Object.values(errors.value).some(err => err)
)
const loadCart = () => JSON.parse(localStorage.getItem(CART)) || [];
const cartHasOneItem = computed(() => cart.value.length === 1);
const locationError = ref('');
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.value.latitude = position.coords.latitude.toFixed(6);
        form.value.longitude = position.coords.longitude.toFixed(6);

        const gpsCoordinates = {
          infoType: 'B',
          coords: {
            lat: parseFloat(form.value.latitude),
            lng: parseFloat(form.value.longitude)
          }
        };
        // On émet la nouvelle valeur au parent (v-model)
        emit('update:shippingInfos', gpsCoordinates);
      },
      (error) => {
        locationError.value = "Impossible de récupérer la position. Saisir manuellement.";
        if(error.code === 1) locationError.value = "Autorisez la géolocalisation, pour calculer vos frais de livraison automatiquement. Sinon, entrez simplement votre adresse de livraison."
      }
    );
  } else {
    locationError.value = "La géolocalisation n’est pas supportée par ce navigateur.";
  }
}
// Fonctions de validations réactive des champs du formulaire (onBlur)
function isEmailValid() {
  const email = form.value.email;
  if (email) {
    !emailRegex.test(email) ? errors.value.email = "Saisissez une adresse courriel valide" : "";
  }
}
function isCardNumberValid() {
  const cardNumber = form.value.card.number;
  if (cardNumber) {
    !isValidCreditCard(cardNumber) ? errors.value.cardNumber = 'Saisissez un numéro de carte valide' : "";
  }
}
function isExpireDateValid() {
  const exp = form.value.card.expiration;

  if (!exp || exp.length !== 5 || exp.indexOf("/") !== 2) {
    errors.value.expiration = "Format invalide (MM/AA)";
    return false;
  }

  let [month, year] = exp.split("/");
  month = parseInt(month, 10);
  year = parseInt(year, 10);

  // Convertir AA → AAAA
  year += 2000;

  // Vérification du mois
  if (isNaN(month) || month < 1 || month > 12) {
    errors.value.expiration = "Mois invalide";
    return false;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Carte expirée ?
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    errors.value.expiration = "Carte expirée";
    return false;
  }

  errors.value.expiration = "";
  return true;
}

function isCvvValid() {
  const cvv = form.value.card.cvv;
  const cardNumber = form.value.card.number.replace(/\D/g, "");
  const four = 4;
  
  if (cvv) {
    if (cardNumber.length >= four) {
      // Détection du type de carte
      let isAmex = cardNumber.startsWith("34") || cardNumber.startsWith("37");
  
      // Vérification du format
      (isAmex && cvv.length !== four) ? errors.value.cvv = "CVV doit contenir 4 chiffres pour Amex" : "";
      (!isAmex && cvv.length !== 3) ? errors.value.cvv = "CVV doit contenir 3 chiffres" : "";
    // } else if (!cardNumber || cardNumber.length < four) {
    } else {
      (cvv.length < 3) ? errors.value.cvv = "CVV doit contenir au moins 3 chiffres" : errors.value.cvv = "";
    }
  }
}
//  Fonctions de formatage des entrées
function formatExpiration() {
  let number = keepDigitsOnly(form.value.card.expiration);

  // Max 4 chiffres (MMYY)
  number = number.slice(0, 4);

  // Si seulement 1 chiffre et >1 → on préfixe par "0"
  if (number.length === 1 && parseInt(number) > 1) {
    number = "0" + number;
  }

  // Ajoute un "/" après 2 chiffres
  if (number.length > 2) {
    number = number.slice(0, 2) + "/" + number.slice(2);
  }

  form.value.card.expiration = number;
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
function sanitizeGpsInput(rawValue, type = "lat") {
  let value = rawValue;

  // 1. Garder uniquement chiffres, +, -, .
  value = value.replace(/[^0-9\.\-\+]/g, "");

  // 2. Un seul signe au début
  value = value.replace(/(?!^)[\+\-]/g, "");

  // 3. Empêcher un point au début ou après un signe sans chiffre avant
  value = value.replace(/^([+\-]?)\./, "$1"); 

  // 4. Gérer multiples points (garde le premier)
  let parts = value.split(".");
  if (parts.length > 2) {
    value = parts.shift() + "." + parts.join("");
  }

  // 5. Limiter à 6 décimales
  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 6);
    value = parts[0] + "." + parts[1];
  }

  // 6. Vérifier bornes uniquement si nombre complet
  if (value !== "" && value !== "-" && value !== "+" && !value.endsWith(".")) {
    let num = parseFloat(value);
    let min = type === "lat" ? -90 : -180;
    let max = type === "lat" ? 90 : 180;

    if (num > max) num = max;
    if (num < min) num = min;

    value = num.toString();
  }

  return value;
}
function keepDigitsOnly(value) {
  return value.replace(/\D/g, ""); // garder seulement chiffres
}
function onPhoneValidate({ valid, number }) {
  phoneIsValid.value = valid;
  if (valid) {
    errors.value.phone = '';
    form.value.phone = number;
  } else {
    errors.value.phone = 'Entrez un numéro de téléphone valide';
  }
}
function onBillingPhoneValidate({ valid, number }) {
  billingPhoneIsValid.value = valid;
  if (valid) {
    errors.value.billingPhone = '';
    form.value.billing.phone = number;
  } else {
    errors.value.billingPhone = 'Entrez un numéro de téléphone valide';
  }
}
function ckeckCardNumber() {
  formatCardNumber();
  // Validation réactive (affichage réactive d'erreur)
  form.value.card.number ? errors.value.cardNumber = '' : errors.value.cardNumber='Saisissez le numéro de votre carte';
}
function checkCVVNumber() {
  formatCVV();
  // Validation réacive (affichage réactive d'erreur)
  form.value.card.cvv ? errors.value.cvv = '' : errors.value.cvv = 'Saisissez le code CVV de votre carte';
}
function checkExpireDate() {
  formatExpiration();
  // Validation réacive (affichage réactive d'erreur)
  form.value.card.expiration ? errors.value.expiration = '' : errors.value.expiration = "Saisissez la date d'expiration de votre carte";
}
function checkCardName() {
  formatCardName();
  // Validation réacive (affichage réactive d'erreur)
  form.value.card.name ? errors.value.cardName = '' : errors.value.cardName = "Saisissez le nom sur votre carte tel quel";
}
async function checkFullShippingAddresse() {
  if (form.value.addresse && form.value.city) {
    try {
      const fullAddresse = formatShippingFullAddresse();
      const coords = await getCoordinatesOSM(fullAddresse);
      const gpsCoordinates = { infoType: 'A', coords }
      // Emission vers parent (et donc vers OrderSummary)
      emit('update:shippingInfos', gpsCoordinates);
      cleanFullAddressErrors();
    } catch (err) {
      const errorMsg = 'Adresse introuvable. Merci de vérifier l’orthographe ou d’ajouter un repère (ex. marché, église, carrefour...)';
      // on vide en émettant un objet vide
      emit('update:shippingInfos', defaultShippingInfos());
      errors.value.addresse = errorMsg;
      errors.value.city = errorMsg;
      throw new Error("Adresse introuvable");
    }
  } else {
    emit('update:shippingInfos', defaultShippingInfos());
  }
}
function cleanFullAddressErrors() {
  errors.value.addresse = '';
  errors.value.city = '';
}
function formatShippingFullAddresse() {
  const country = form.value.country || 'Togo';
  const addresse = form.value.addresse;
  const city = form.value.city;
  
  // Nettoyer l’adresse (enlever espaces multiples)
  const cleanAddress = addresse.trim().replace(/\s+/g, " ");
  const cleanCity = city.trim();
  return `${cleanAddress}, ${cleanCity}, ${country}`;
}
async function getCoordinatesOSM(fullAddresse) {
  const appName = 'Labstore'
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddresse)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": `${appName}/1.0`
    }
  });
  const data = await response.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } else {
    throw new Error("Adresse introuvable");
  }
}


function isValidCreditCard(number) {
  number = number.replace(/\D/g, "");

  if (number.length < 13 || number.length > 19) return false;

  const firstOne = parseInt(number[0]);
  const firstTwo = parseInt(number.substring(0, 2));
  const firstThree = parseInt(number.substring(0, 3));
  const firstFour = parseInt(number.substring(0, 4));
  const firstSix = parseInt(number.substring(0, 6));

  let validPrefix = false;
  if (firstOne === 4) validPrefix = true; // Visa
  if (firstTwo >= 51 && firstTwo <= 55) validPrefix = true; // Mastercard
  if (firstTwo === 34 || firstTwo === 37) validPrefix = true; // Amex
  if (firstFour === 6011 || firstTwo === 65 || (firstThree >= 644 && firstThree <= 649)) validPrefix = true; // Discover
  if (firstSix >= 222100 && firstSix <= 272099) validPrefix = true; // Mastercard nouveau range

  if (!validPrefix) return false;

  // Luhn
  let sum = 0;
  let shouldDouble = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function validateForm() {
    // errors.value = {};
    let valid = true;


    // Shipping + pickup
    if (!form.value.email || !emailRegex.test(form.value.email)) {
          errors.value.email = "Adresse courriel invalide";
          valid = false;
      }
    
    // Shipping
    if (receptionType.value === ZERO) {
      if (!form.value.name) {
          errors.value.name = "Le nom est requis";
          valid = false;
      }
      if (!form.value.prename) {
          errors.value.prename = "Le prénom est requis";
          valid = false;
      }
      if (!phoneIsValid.value) {
          errors.value.phone = "Numéro de téléphone requis";
          valid = false;
      }
      if (!form.value.addresse) {
          errors.value.addresse = "Adresse requise";
          valid = false;
      }
      if (!form.value.city) {
          errors.value.city = "Nom de ville requis";
          valid = false;
      }
    }

    // Card

    if (!form.value.card.number) {
        errors.value.cardNumber = "Numéro de carte requis";
        valid = false;
    }
    if (!form.value.card.expiration) {
        errors.value.expiration = "Date d'expiration requise";
        valid = false;
    }
    if (!form.value.card.cvv) {
        errors.value.cvv = "Code CVV requis";
        
        valid = false;
    }
    if (!form.value.card.name) {
        errors.value.cardName = "Nom sur la carte requis";
        valid = false;
    }
    

    // Pickup or invoice address différent of shipping address
    if (!invoiceAddressAsShippingAddress.value || receptionType.value == ONE) {
      if (!form.value.billing.name) {
          errors.value.billingName = "Le nom est requis";
          valid = false;
      }
      if (!form.value.billing.prename) {
          errors.value.billingPrename = "Le prénom est requis";
          valid = false;
      }
      if (!form.value.billing.address) {
          errors.value.billingAddress = "Adresse requise";
          valid = false;
      }
      if (!form.value.billing.city) {
          errors.value.billingCity = "Nom de ville requis";
          valid = false;
      }
      if (!billingPhoneIsValid.value) {
        errors.value.billingPhone = "Numéro de téléphone requis";
        valid = false;
      } 
    }
    return valid;
}
async function handleSubmit() {
  validateForm();
  if(hasErrors.value) {
    alert('Formulaire invalide, corrigez les erreurs');
    return;
  }
  // Quand le formulaire est valide
  alert('✅Formulaire valide, envoi...')
  await placeOrder();
}
function getFormData() {
  const formData = {};
  const items = loadCart();

  // Infos du client
  formData.client = { email: form.value.email }

  // Méthode de paiement
  formData.payment = {
    cardNumber: form.value.card.number,
    cardOwner: form.value.card.name,
    cardCvv: form.value.card.cvv,
    cardExpiration: form.value.card.expiration
  }

  // Infos du contenu de la commande
  formData.items = items;
  formData.subTotal = props.billInfos.subTotal;
  if (receptionType.value === ZERO) formData.expeditionCosts = props.billInfos.expeditionCosts; 
  formData.TVA = props.billInfos.TVA;
  formData.totalWithTVA = props.billInfos.totalWithTVA;
  formData.orderDate = new Date();

  if (receptionType.value === ZERO) { // Si expédition
    // Qui est considéré comme client quand l'adresse de livraison est différente ou similaire à l'adresse de facturation
    if (invoiceAddressAsShippingAddress.value) {
      formData.client.name = form.value.name;
      formData.client.prename = form.value.prename;
      formData.client.phone = form.value.phone;
    } else {
      formData.client.name = form.value.billing.name;
      formData.client.prename = form.value.billing.prename;
      formData.client.phone = form.value.billing.phone;  
    }
    

    // Adressage de l'expédition
    const expeditionAddresse = {
      location: { latitude: form.value.latitude, longitude: form.value.longitude },
      address: form.value.addresse,
      country: form.value.country || 'Togo',
      city: form.value.city,
      postalCode: form.value.postalCode,
      name: form.value.name,
      prename: form.value.prename,
      phone: form.value.phone
    }
    formData.expedition = expeditionAddresse;

    // Adresse de factuation
    formData.billing = invoiceAddressAsShippingAddress.value ? expeditionAddresse : getBillingAddresse();
    
  }
  if (receptionType.value === ONE) { // Si cueuillette
    // Adresse de facturation
    formData.billing = getBillingAddresse();
    
    // Autres infos du client
    formData.client.name = formData.billing.name;
    formData.client.prename = formData.billing.prename;
    formData.client.phone = formData.billing.phone;

    // Lieu de cueuillette
    formData.pickup = {
      storeName: pickUpPlace.value.name,
      address: pickUpPlace.value.address,
      location: { latitude: pickUpPlace.value.lat, longitude: pickUpPlace.value.lon }
    }   
  }

  return formData;
}
function getBillingAddresse() {
  return {
      address: form.value.billing.address,
      country: form.value.billing.country || 'Togo',
      city: form.value.billing.city,
      postalCode: form.value.billing.postalCode,
      name: form.value.billing.name,
      prename: form.value.billing.prename,
      phone: form.value.billing.phone,
    };
}
async function placeOrder() {
  const formData = getFormData();
  try {
    const response = await axios.post(`${apiUrl}/order`, formData);
    console.log(response);
  } catch (error) {
    throw new Error("Erreur lors de la passation de commande.");
  }
}
function handleReceptionTypeChange(value) {
  receptionType.value = value;
  emit('receptionTypeChanged', value);
}
function toggleSummary() {
  showSummary.value = !showSummary.value;
}
function handlePickUpPlaceChange(value) {
  pickUpPlace.value = value;
}
function defaultShippingInfos() {
  return { infoType: null, coords: { lat: null, lng: null } };
}
watch(receptionType, (newVal, oldVal) => {
  // En cas d'expédition
  if (newVal === ZERO) {
    invoiceAddressAsShippingAddress.value = true;
    resetErrorsForShipping();
  }
  // En cas de cueillette
  if (newVal === ONE) resetErrorsForPickup();
})
watch(invoiceAddressAsShippingAddress, (newVal, oldVal) => {
  if (newVal === true) {
    resetErrorsForShippingWithInvoiceAddressAsShippingOne();
  }
})
onMounted(() => {
  cart.value = loadCart();
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
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
.section h3 {
  display: flex;
  align-items: center;
  font-size: 1em;
  font-weight: 900;
  margin-top: 1.5rem;
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
  width: 100%;
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
.option-marker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: fit-content;
  margin-bottom: 15px;
}
.option-marker div {
  height: 0.001em;
  width: 100%;
  border-top: 1px solid #bbb;
}
.option-marker p {
  margin: 0 10px;
  color: #bbb;
  font-size: 0.9rem;
}
.location-button {
  display: flex;
  justify-content: center;
  border: 1px solid #bbb;
  border-radius: 6px;
  padding: 8px;
  gap: 2px;
  cursor: pointer;
  font-weight: bold;
}
.location-button svg {
  width: 20px;
}
.location-button p {
  font-size: 0.95rem;
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
.error-secondary {
  color: #333;
  font-size: 0.8em;
  margin-top: 4px;
}
.summary {
  display: none;
}
.summay-header {
  display: flex;
  justify-content: space-between;
}
.summay-header p {
  font-weight: normal;
  font-size: 14px;
  letter-spacing: -0.03em;
  cursor: pointer;
}
.summay-header svg {
  stroke: #000;
}
.summary .arrow {
  margin-left: 2px;
  transition: transform 0.3s ease;
  display: inline-block;
  vertical-align: middle;
}
.summary .arrow.open {
  transform: rotate(180deg); /* flèche vers le haut */
}
.margin-btm-0 {
  margin-bottom: 0;
}
.padding-btm-5 {
  padding-bottom: 5px;
}
.btn-submit {
  text-align: center;
  padding: 12px 20px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: bold;
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
.summary {
  display: block;
}
}
</style>