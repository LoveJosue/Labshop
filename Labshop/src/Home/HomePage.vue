<template>
  <div class="homepage">
      <main> 
        <section class="hero">
          <h2>Bienvenu sur LabStore</h2>
          <p>L'endroit idéal pour tout matériel de laboratoire dont vous avez besoin.</p>
          <Button label="Commencer" class="p-button-raised p-button-primary" @click="goToProducts"></Button>
        </section>


        <CCarousel :controls="true" indicators :interval="3000" dark transition="slide">
          <CCarouselItem>
            <img class="d-block w-100 carousel-image" src="../images/img_1.jpg" alt="slide 1"/>
                <!-- <h3 class="caption-info">Explorez des appareils de loboratoire à la fine pointe de la technologie</h3> -->
          </CCarouselItem>


          <CCarouselItem>
            <img class="d-block w-100 carousel-image" src="../images/img_2.jpeg" alt="slide 2"/>
              <!-- <h3 class="caption-info">Des produits de toutes sortes de marques sont à votre disposition</h3> -->
          </CCarouselItem>

          <CCarouselItem>
            <img class="d-block w-100 carousel-image" src="../images/img_3.jpg" alt="slide 3"/>
              <!-- <h3 class="caption-info">Les meilleurs choix de l'industrie</h3> -->
          </CCarouselItem>
        </CCarousel>

  
        <!-- <section class="featured-products">
          <h3>Des articles disponibles sur le site</h3>
          <div class="product-grid">
            <Card v-for="product in featuredProducts" :key="product.id" class="product-card">
              <template #title>{{ product.name }}</template>
              <template #content>
                <img :src="product.image" :alt="product.name" class="product-image" />
                <p>{{ product.description }}</p>
                <span class="price">${{ product.price }}</span>
              </template>
              <template #footer>
                <Button label="Add to Cart" icon="pi pi-shopping-cart" class="p-button-success" />
              </template>
            </Card>
          </div>
        </section> -->
      </main>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { CCarousel, CCarouselItem } from '@coreui/vue'
  import { useRouter } from 'vue-router';

  import Button from 'primevue/button';

  const router = useRouter();

  
  const featuredProducts = ref([
    { id: 1, name: 'Smartphone X', description: 'The latest and greatest smartphone.', price: 999, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Wireless Earbuds', description: 'Crisp sound and seamless connection.', price: 199, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Smartwatch Pro', description: 'Stay connected on the go.', price: 299, image: 'https://via.placeholder.com/150' }
  ]);

  const goToProducts = () => {
    router.push('/products');
  }
</script>
  
  <style scoped>
  .homepage {
    font-family: Arial, sans-serif;
    text-align: center;
  }

  .hero {
    background: #f4f4f4;
    padding: 1rem 0;
  }
  
  .featured-products {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  
  .product-grid {
    display: flex;
    gap: 2rem;
  }
  
  .product-card {
    text-align: left;
  }
  
  .product-image {
    width: 100%;
    height: auto;
  }
  
  .price {
    font-weight: bold;
  }

  .carousel-image {
  width: 100%;
  height: 400px;
  object-fit: contain;
  }

  .caption-info {
    font-weight:bold;
  }
  </style>
  