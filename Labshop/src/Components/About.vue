<template>
  <div class="about">

    <section class="hero">
      <h1>À propos de Labstore</h1>
      <p>Votre partenaire de confiance pour l'équipement de laboratoire en Afrique de l'Ouest.</p>
    </section>

    <div class="sections">

      <section class="card">
        <h2>Notre mission</h2>
        <p>
          Labstore a pour mission de rendre le matériel de laboratoire de qualité accessible aux professionnels,
          établissements d'enseignement et centres de recherche. Nous croyons que l'accès à un équipement fiable
          est essentiel à l'avancement scientifique et médical.
        </p>
      </section>

      <section class="card">
        <h2>Ce que nous offrons</h2>
        <ul>
          <li>Verrerie et consommables de laboratoire</li>
          <li>Instruments de mesure et d'analyse</li>
          <li>Équipements de protection individuelle</li>
          <li>Réactifs et produits chimiques courants</li>
          <li>Matériel médical et de diagnostic</li>
        </ul>
      </section>

      <section class="card">
        <h2>Pourquoi nous choisir</h2>
        <ul>
          <li>Produits sélectionnés auprès de fournisseurs certifiés</li>
          <li>Tarifs compétitifs en gros et au détail</li>
          <li>Livraison rapide à Lomé et ses environs</li>
          <li>Service client disponible et réactif</li>
          <li>Paiement flexible : mobile money, carte bancaire</li>
        </ul>
      </section>

      <section class="card contact-card">
        <h2>Nous contacter</h2>
        <div class="contact-list">
          <div class="contact-item">
            <span class="contact-label">Adresse</span>
            <span>Lomé, Togo</span>
          </div>
          <div class="contact-item">
            <span class="contact-label">Téléphone</span>
            <a href="tel:+22890088522">+228 90 08 85 22</a>
          </div>
          <div class="contact-item">
            <span class="contact-label">Email</span>
            <a href="mailto:contact@labstore.ca">contact@labstore.ca</a>
          </div>
        </div>
      </section>

    </div>

    <div class="cta">
      <p>Prêt à commander ?</p>
      <router-link to="/products" class="btn-primary">Voir le catalogue</router-link>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.about {
  font-family: Arial, sans-serif;
  max-width: var(--website-max-width);
  width: var(--website-section-width);
  margin: 0 auto;
  padding: 2rem 0 4rem;
}

/* Hero */
.hero {
  text-align: center;
  padding: 3rem 1rem 2rem;
  border-bottom: 1px solid var(--lightgray);
  margin-bottom: 2.5rem;
}
.hero h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  color: var(--primaryColor);
  margin: 0 0 0.75rem;
}
.hero p {
  font-size: 1.05rem;
  font-weight: 300;
  color: #555;
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Grid de sections */
.sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

/* Carte */
.card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.card h2 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primaryColor);
  margin: 0;
}
.card p {
  font-size: 0.95rem;
  font-weight: 300;
  color: #444;
  line-height: 1.65;
  margin: 0;
}
.card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.card ul li {
  font-size: 0.95rem;
  font-weight: 300;
  color: #444;
  padding-left: 1.1rem;
  position: relative;
}
.card ul li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--primaryColor);
  font-weight: 600;
}

/* Carte contact */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.contact-item {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.contact-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #999;
}
.contact-item span:not(.contact-label),
.contact-item a {
  font-size: 0.95rem;
  color: #333;
  text-decoration: none;
}
.contact-item a:hover {
  color: var(--primaryColor);
  text-decoration: underline;
}

/* CTA */
.cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  padding: 2.5rem 1rem;
  background: #f9f9f9;
  border-radius: 12px;
}
.cta p {
  font-size: 1.1rem;
  font-weight: 400;
  color: #333;
  margin: 0;
}
.btn-primary {
  display: inline-block;
  background-color: var(--primaryColor);
  border: 1px solid var(--primaryColor);
  color: #fff;
  padding: 0.65rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  transition: opacity 0.2s ease;
}
.btn-primary:hover {
  opacity: 0.8;
}
</style>