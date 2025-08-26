<template>
  <footer class="bg-gray-900 text-gray-300 py-12 mt-12">
    <div class="ctn">
      <!-- TOP : logo + description -->
      <div class="top">
        <p class="logo-text">Labstore</p>
        <p class="slogan">
          Votre boutique en ligne pour les produits de qualité, livrés rapidement.
        </p>
      </div>

      <!-- MIDDLE : sections -->
      <div class="middle">
        <!-- Liens utiles -->
        <div>
          <h3>Liens utiles</h3>
          <ul>
            <li><RouterLink to="/">Accueil</RouterLink></li>
            <li><RouterLink to="/products">Produits</RouterLink></li>
            <li><RouterLink to="/about">À propos</RouterLink></li>
            <li><RouterLink to="/contact">Contact</RouterLink></li>
            <li><RouterLink to="/faq">FAQ / Aide</RouterLink></li>
          </ul>
        </div>

        <!-- Compte utilisateur -->
        <div>
          <h3>Compte utilisateur</h3>
          <ul>
            <li><RouterLink to="/login">Connexion / inscription</RouterLink></li>
            <li><RouterLink to="/mes-commandes">Historique des commandes</RouterLink></li>
            <li><RouterLink to="/wishlist">Wishlist</RouterLink></li>
          </ul>
        </div>

        <!-- À propos -->
        <div>
          <h3>À propos de Labstore</h3>
          <ul>
            <li>Adresse : Lomé, TG</li>
            <li>Téléphone : +228 90 08 85 22</li>
          </ul>
        </div>

        <!-- Paiement -->
        <div>
          <h3>Méthodes de paiement</h3>
          <div class="payments">
            <img src="@/images/payments/mastercard.png" alt="Mastercard" />
            <img src="@/images/payments/visa.png" alt="Visa" />
            <img src="@/images/payments/applepay.png" alt="Apple Pay" />
            <img src="@/images/payments/tmoney.png" alt="TMoney" />
            <img src="@/images/payments/flooz.png" alt="Flooz" />
          </div>
        </div>

        <!-- Sécurité -->
        <div>
          <h3>Sécurité</h3>
          <ul>
            <li>Paiement sécurisé</li>
            <li>SSL</li>
          </ul>
        </div>
      </div>

      <!-- BOTTOM -->
      <div class="bottom">
        <p>© {{ currentYear }} Labstore. Tous droits réservés.</p>
        <p>
          <RouterLink to="/conditions" class="hover:text-white">Conditions générales</RouterLink> ·
          <RouterLink to="/confidentialite" class="hover:text-white">Politique de confidentialité</RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";
const currentYear = new Date().getFullYear();
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
footer * {
  font-size: 0.95em;
  letter-spacing: -0.01em;
}

.ctn {
  max-width: var(--website-max-width);
  width: var(--website-section-width);
  margin: 0 auto;
}

/* TOP */
.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.logo-text {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
}
.slogan {
  font-size: 0.95rem;
  color: #aaa;
  max-width: 500px;
}

/* MIDDLE */
.middle {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}
.middle h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}
.middle ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.middle ul li {
  margin-bottom: 0.5rem;
}
.middle ul li a:hover {
  color: #fff;
}

/* Paiements */
.payments {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.payments img {
  height: 36px;
  background: #fff;           /* fond blanc pour contraste */
  border-radius: 8px;         /* coins arrondis */
  padding: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.payments img:hover {
  opacity: 1;
}

/* BOTTOM */
.bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-top: 1px solid #444;
  padding-top: 1.5rem;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #aaa;
}
@media (min-width: 768px) {
  .bottom {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}
</style>
