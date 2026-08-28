<template>
  <div class="homepage">
      <main> 
        <section class="hero">
          <h2>Bienvenu sur Labstore</h2>
          <p>L'endroit idéal pour tout matériel de laboratoire dont vous avez besoin.</p>
          <button class="btn-primary" @click="goToProducts">Commencer</button>
        </section>


        <CCarousel :controls="true" indicators :interval="3000" dark transition="slide" style="z-index:-1">
          <CCarouselItem>
            <img class="d-block w-100 carousel-image" src="../images/img_1.jpg" alt="slide 1"/>
          </CCarouselItem>


          <CCarouselItem>
            <img class="d-block w-100 carousel-image" src="../images/img_2.jpeg" alt="slide 2"/>
          </CCarouselItem>

          <CCarouselItem>
            <img class="d-block w-100 carousel-image" src="../images/img_3.jpg" alt="slide 3"/>
          </CCarouselItem>
        </CCarousel>
      </main>
    </div>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { CCarousel, CCarouselItem } from '@coreui/vue'
  import { useRouter } from 'vue-router';

  const router = useRouter();

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

  .btn-primary {
    background-color: var(--primaryColor);
    border: 1px solid var(--primaryColor);
    color: #fff;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
    transition: opacity 0.2s ease;
  }
  .btn-primary:hover {
    opacity: 0.8;
  }
  </style>
  