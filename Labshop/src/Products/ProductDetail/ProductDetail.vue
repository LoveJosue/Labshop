<template>
    <div class="main">
        <div class="product_img">
            <div v-for="(item, index) in product.imgsUrl" 
                 :key="index" 
                 :class="index === 0 ? 'img_1' : 'under_img'">
                <img :src="item" alt="image" class="image-fit">
            </div>
        </div>
        <div class="product-details">
            <h1>{{ product.name }}</h1>
            <p style="font-size: 1rem; color: #555;">
                <span v-if="product.qtyPerUnit">{{ getUnitType }} de {{ product.qtyPerUnit }} | </span>
                <span>{{ product.unitPerBox }} {{ product.unitType }}{{ product.unitPerBox > 1 ? 's' : ''  }} par carton</span>
            </p>
            <h2 v-if="sectionSelected === FIRST_SELECT">{{ getWholesalePriceRange() }} F / <span>{{ product.unitType }}</span></h2>
            <h2 v-else="sectionSelected === SECOND_SELECT">{{ getUnitPrice() }} F / <span>{{ product.unitType }}</span></h2>
            <div class="form_group">
                <div class="select-panel shadow-xs/30 rounded-md border">
                    <div class="select-section">
                        <div 
                            id="1" 
                            class="select-item rounded-tl-md" 
                            :class="sectionSelected === FIRST_SELECT ? 'select-item-1-active' : 'select-item-1-unactive'" 
                            @click="selectSection($event)"
                        >
                            Achat en gros
                        </div>
                        <div 
                            id='2' 
                            class="select-item rounded-tr-md"
                            :class="sectionSelected === SECOND_SELECT ? 'select-item-2-active' : 'select-item-2-unactive'"
                            @click="selectSection($event)">
                            Achat en détail
                        </div>
                        
                    </div>
                    <div v-if="sectionSelected === 1" class="select-content">
                        <div>
                            <p>Choix du tarif :</p>
                            <SelectDropdown v-model="selected" :options="getWholeSalePriceList()" />
                        </div>
                          <div>
                              <p>Quantité de cartons :</p>
                              <div class="input-box rounded-md">
                                <NumberInputComponent 
                                :min="1"
                                :max="100"
                                :modelValue="1"/>
                              </div>
                          </div>
                    </div>
                    <div v-else-if="sectionSelected === 2" class="select-content">
                        <div>
                            <p>Quantité de {{ product.unitType }}s :</p>
                            <div class="input-box rounded-md">
                                <NumberInputComponent 
                                :min="1"
                                :max="100"
                                :modelValue="1"/>
                              </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div class="form_group_elem add_to_card rounded-sm shadow-xs/30">
                    Ajouter au panier
                </div>
                <div class="form_group_elem available_btn rounded-sm shadow-xs/30">
                    Disponibilité en boutique
                </div>

                <div class="form_group">
                    <!-- <Accordion></Accordion> -->
                    <!-- <Accordion 
                        v-if="Array.isArray(product.infos) && product.infos.length > 0"
                        :accordionItems="accordionItems">
                    </Accordion> -->
                    <Accordion
                        v-if="Array.isArray(product.infos) && product.infos.length > 0"
                        :accordionItems="product.infos">
                    </Accordion>
                </div>
            </div>
        </div>
        <div class="comments main_elem">
            <div class="comments_header">
                <span class="pi pi-star-fill"></span>
                <span class="rate">{{ getRatingAverage.toFixed(1).toString().replace('.', ',') }}</span>
                <span class="dot"></span>
                <span class="comments_header_title">{{ comments.length }} commentaire{{ comments.length > 1 ? 's' : ''}}</span>
            </div>
            <div class="comments_grid">
                <!-- Afficher 6 commentaires. S'il y en a plus, les afficher dans  une liste déroulante-->
                <!-- <div v-for="comment in comments" :key="comment.id" class="comments_item"> -->
                <div class="comments_card">
                    <div class="profile">
                        <div class="profile-chld-1">
                            <img src="@/images/josue_profil.jpg" alt="" class="profile-avatar">
                        </div>
                        <div class="profile-chld-2">
                            <span class="profile-name">Josué</span>
                            <span class="profile-age">4 ans sur LabStore</span>
                        </div>
                    </div>
                    <div class="profile-infos">
                        <div class="rating-starts">
                            <span v-for="i in Math.floor(getRatingAverage)" class="pi pi-star-fill"></span>
                            <span v-for="i in getEmptystars" class="pi pi-star"></span>
                        </div>
                        <div class="dot"></div>
                        <span class="comment-date">Il y a quatres jours</span>
                    </div>
                    <div class="comment-text">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa eos harum similique accusantium facere repudiandae! Amet aspernatur nobis consequuntur optio culpa officia tenetur quos, soluta et error, veritatis, eius iusto.
                    </div>
                </div>            
                <div class="comments_card">
                    <div class="profile">
                        <div class="profile-chld-1">
                            <img src="@/images/josue_profil.jpg" alt="" class="profile-avatar">
                        </div>
                        <div class="profile-chld-2">
                            <span class="profile-name">Josué</span>
                            <span class="profile-age">4 ans sur LabStore</span>
                        </div>
                    </div>
                    <div class="profile-infos">
                        <div class="rating-starts">
                            <span v-for="i in Math.floor(getRatingAverage)" class="pi pi-star-fill"></span>
                            <span v-for="i in getEmptystars" class="pi pi-star"></span>
                        </div>
                        <div class="dot"></div>
                        <span class="comment-date">Il y a quatres jours</span>
                    </div>
                    <div class="comment-text">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa eos harum similique accusantium facere repudiandae! Amet aspernatur nobis consequuntur optio culpa officia tenetur quos, soluta et error, veritatis, eius iusto.
                    </div>
                </div>            
                <div class="comments_card">
                    <div class="profile">
                        <div class="profile-chld-1">
                            <img src="@/images/josue_profil.jpg" alt="" class="profile-avatar">
                        </div>
                        <div class="profile-chld-2">
                            <span class="profile-name">Josué</span>
                            <span class="profile-age">4 ans sur LabStore</span>
                        </div>
                    </div>
                    <div class="profile-infos">
                        <div class="rating-starts">
                            <span v-for="i in Math.floor(getRatingAverage)" class="pi pi-star-fill"></span>
                            <span v-for="i in getEmptystars" class="pi pi-star"></span>
                        </div>
                        <div class="dot"></div>
                        <span class="comment-date">Il y a quatres jours</span>
                    </div>
                    <div class="comment-text">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa eos harum similique accusantium facere repudiandae! Amet aspernatur nobis consequuntur optio culpa officia tenetur quos, soluta et error, veritatis, eius iusto.
                    </div>
                </div>            
                <div class="comments_card">
                    <div class="profile">
                        <div class="profile-chld-1">
                            <img src="@/images/josue_profil.jpg" alt="" class="profile-avatar">
                        </div>
                        <div class="profile-chld-2">
                            <span class="profile-name">Josué</span>
                            <span class="profile-age">4 ans sur LabStore</span>
                        </div>
                    </div>
                    <div class="profile-infos">
                        <div class="rating-starts">
                            <span v-for="i in Math.floor(getRatingAverage)" class="pi pi-star-fill"></span>
                            <span v-for="i in getEmptystars" class="pi pi-star"></span>
                        </div>
                        <div class="dot"></div>
                        <span class="comment-date">Il y a quatres jours</span>
                    </div>
                    <div class="comment-text">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa eos harum similique accusantium facere repudiandae! Amet aspernatur nobis consequuntur optio culpa officia tenetur quos, soluta et error, veritatis, eius iusto.
                    </div>
                </div>            

            </div>
        </div>
    </div>
</template>

<script setup>
import Accordion from '@/Components/Accordion.vue';
import NumberInputComponent from '@/Components/NumberInputComponent.vue';
import SelectDropdown from '@/Components/SelectDropdown.vue';

import axios from 'axios';
import { apiUrl } from '@/config';

import { onMounted, ref } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const FIRST_SELECT = 1;
const SECOND_SELECT = 2;

const sectionSelected = ref(FIRST_SELECT);
const selected = ref('');

const route = useRoute();
const product = ref({});

const maxStars = 5;
const comments = ref([
    { id: 1, text: "Super produit", rating: 4 },
    { id: 2, text: "Pas mal", rating: 2 },
    { id: 3, text: "Mauvais produit", rating: 5 }
]);

const getRatingAverage = computed(() => {
    if (comments.value.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < comments.value.length; i++) {
        sum += comments.value[i].rating;
    }
    return (sum / comments.value.length);
})

const getEmptystars = computed(() => {
    return maxStars - Math.floor(getRatingAverage.value);
});
// const getRatingAverage = computed(() => {
//     if (comments.value.length === 0) return 0;
//     let sum = 0;
//     for (let i = 0; i < comments.value.length; i++) {
//         sum += comments.value[i].rating;
//     }
//     return (sum / comments.value.length).toFixed(1).toString().replace(".", ",");
// })
const getUnitType = computed(() => {
    const unit = product.value.unitType;
    return typeof unit === 'string' && unit.length > 0 ? unit.charAt(0).toUpperCase() + unit.slice(1) : ''
    
});
const getWholesalePriceRange = () => {
    const priceList = product.value.priceList;
     if (!Array.isArray(priceList) || priceList.length < 2) {
        return '';
    }
    const firstPricing = priceList[0];
    const beforeLastPricing = priceList[priceList.length - 2];
    if(firstPricing.unitPrice === beforeLastPricing.unitPrice) {
        return `${firstPricing.unitPrice.toLocaleString('fr-FR')}`;
    }
    return `${firstPricing.unitPrice.toLocaleString('fr-FR')} - ${beforeLastPricing.unitPrice.toLocaleString('fr-FR')}`;
};
const selectSection = (event) => {
    const element = event.currentTarget;
    const id = element.getAttribute('id');
    sectionSelected.value = parseInt(id);
}
const getWholeSalePriceList = () => {
    const priceList = product.value.priceList;
    const unitType = product.value.unitType;
    if (!Array.isArray(priceList) || priceList.length === 0) {
        return [];
    }
    // Exclure le dernier élément (supposé être le détail)
    const wholeSalePricingRange = priceList.slice(0, -1);
    // Adapter les valeurs retournées au composant SelectDropDown
    return wholeSalePricingRange.map((item, idx) => ({
        label: `${item.name}`,
        unitPrice: `${item.unitPrice.toLocaleString('fr-FR')}`,
        unitType: unitType,
        clue: item.best ? 'Meilleur' : null,
        value: idx
    }));
}
const getUnitPrice = () => {
    const priceList = product.value.priceList;
    if (!Array.isArray(priceList) || priceList.length === 0) {
        return '';
    }
    const lastPricingIndex = priceList.length - 1;
    const unitPrice = priceList[lastPricingIndex].unitPrice;
    return unitPrice.toLocaleString('fr-FR');
}
onMounted(() => {
    const id = route.params.id;
    axios.get(`${apiUrl}/products/${id}`)
    .then(res => {
        if (res.data) {
            product.value = res.data;
        }
    })
    .catch(error => {
        console.log(error);
    })
})


</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

h1 {
    font-weight: lighter;
}
h2 {
    font-weight: lighter;
    color: rgb(99, 99, 99);
}
.main_elem {
    grid-column: 1 / 3;
}
.main {
    display: grid;
    grid-template-columns: 3fr 2fr;
    column-gap: 50px;
    row-gap: 2rem;
    background-color: var(--bg);
    margin: 0 15px 0 10px;
    width: 1600px;
    max-width: 80%;
    margin: 0 auto;

}
.product_img {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 5px;
    column-gap: 5px;    
}
.product_img > * {
    border: 1px solid var(--lightgray);
    width: auto;
}
.img_1 {
    grid-column: 1 / 3;
    height: 600px;
}
.under_img {
    height: 300px;
}
.image-fit {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.product-details h1 {
  font-size: 2rem;
  font-weight: 100;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
}

.product-details h2 {
  font-size: 1.5rem;
  color: #222;
  margin-bottom: 1rem;
  
}

.product-details {
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.product-details p {
    font-size: 1rem; 
    color: #555;
    margin: 0 0 10px 0;
    font-weight: 300;
}
.product-details h2 span {
    font-size: 1rem;
    font-weight: 300;
}
.product-details .select-panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 0.8rem;
}
.product-details .select-panel .select-section {
    width:100%;
    height: 50px;
    display: flex;
}
.select-item {
    width: 100%;
    padding: 0.75rem 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border-bottom: none;
    background-color: #f9f9f9;
    cursor: pointer;
}

.select-item:hover {
  background-color: #f0f0f0;
}

.select-item-1-active,
.select-item-2-active {
  background-color: white;
  border-bottom: 2px solid #007bff;
  color: #007bff;
  font-weight: 600;
}

.select-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
}

.select-content p {
    color: black;
    font-size: 1rem;
    font-weight: 300;
    margin-left: 0.1rem;
    margin-bottom: 0.4rem;
}

/* product_details column'style */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.form_group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 540px;
}
.form_group_elem {
    text-align: center;
    align-content: center;
    border: 1px solid black;
    cursor: pointer;
    width: 100%;
    height: 50px;
}
.add_to_card {
    background-color: rgb(0, 123, 255);
    font-weight: 500;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    
}
.add_to_card:hover {
    background-color: rgb(2, 111, 228);
}
.available_btn:hover {
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    transition: background-color 0.3s ease;
}
.input-box {
    border: 1px solid lightgray;
    width: 50%;
    height: 40px;
}

.btn-group {
    width: 4rem;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateY(5%) translateX(-5%);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 90%;
}
.btn-group > button {
    border: none;
    background-color: (var(--lightgray));
    height: 100%;
    width: 100%;
}
.btn-group > button:hover {
    background-color: rgb(230, 226, 226);
}

.btn-group > button span {
    font-size: smaller;
}

.left-separator {
    display: block;
    border-left: 1px solid var(--lightgray);
    width: 1px;
    height: 50%;
    position: relative;
    top:0;
    transform: translateY(50%) translateX(-180%);
}
.comments {
    border-top: 1px solid var(--lightgray);
    padding: 2rem 0;
}
.comments .comments_header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.3rem;
    font-style: var(--font);
    font-size: x-large;
    padding-bottom: 2rem;
}
.comments .comments_header .dot {
    width: 0.25rem;
    height: 0.25rem;
    border-radius: 0.5rem;
    background-color: currentColor;
}
.comments .comments_grid {
    display: grid;
    grid-template-rows: 1fr;
    gap: 2.1rem;
    padding-top: 2rem;
    border-top: 1px solid var(--lightgray);
    width: 100%;   
}
.comments .comments_grid .comments_card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-hf-size);
}
.comments .comments_card .profile {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--gap-hf-size);
}
.comments .comments_card .profile .profile-chld-1 {
    width: calc(var(--avatar-size) + 5px);
    height: calc(var(--avatar-size) + 5px);
    border-radius: 50%;
    background-color: white;
    border: 1px solid var(--lightgray);
    display: flex;
    justify-content: center;
    align-items: center;
}
.comments .comments_card .profile .profile-chld-2 {
    display: flex;
    flex-direction: column;
    font-size: medium;
    
}
.comments .comments_card .profile .profile-chld-2 .profile-name {
    font-weight: var(--half-fw);
    
}
.comments .comments_card .profile .profile-chld-2 .profile-age {
    font-size: small;
    font-weight: 320;
    
}
.comments .comments_card .profile .profile-avatar {
    position: absolute;
    width: var(--avatar-size);
    height: var(--avatar-size);
    border-radius: 50%;
    object-fit: cover;
}
.comments .comments_card .profile-infos {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.45rem;
    font-size: small;
}
.comments .comments_card .profile-infos .rating-starts {
    display: flex;
    flex-direction: row;
    gap: 0.1rem;
    align-items: center;
}
.comments .comments_card .profile-infos .rating-starts > span {
    font-size: 0.6rem;
}
.comments .comments_card .profile-infos .dot {
    width: 0.1rem;
    height: 0.1rem;
    border-radius: 0.1rem;
    background-color: currentColor;
}
.comments .comments_card .profile-infos .comment-date {
    font-weight: var(--half-fw);
}
@media(min-width: 950px) {
    .comments .comments_grid {
        grid-template-columns: 1fr 1fr;
    }
}

</style>