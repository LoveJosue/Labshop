<template>
    <Header></Header>
    <div class="main">
        <div class="product_img">
            <div class="img_1">
                <img src="../../images/img_1.jpg" alt="image1" class="image-fit">
            </div>
            <div class="img_2">
                <img src="../../images/img_1.jpg" alt="image1" class="image-fit">
            </div>
            <div class="img_3">
                <img src="../../images/img_1.jpg" alt="image1" class="image-fit">
            </div>
        </div>
        <div class="product_details">
            <h1>Microscope</h1>
            <h2>150 000 fcfa</h2>
            <div class="form_group">
                <div class="input-group">
                    <input id="inputQte" type="number" placeholder="Quantité" required :value="quantity" v-on:keyup="updateQte">
                    <div class="btn-group">
                        <span class="left-separator"></span>
                        <button @click="decrementQte" :disabled="quantity===min" class="decrement-btn"><Span class="pi pi-minus"></Span></button>
                        <button @click="incrementQte" :disabled="quantity===max" class="increment-btn"><Span class="pi pi-plus"></Span></button>
                    </div>
                </div>

                <div class="form_group_elem add_to_card">
                    Ajouter au panier
                </div>

                <div class="form_group_elem available_btn">
                    Disponibilité en boutique
                </div>

                <div class="form_group">
                    <Accordion></Accordion>
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
    <Footer></Footer>
</template>

<script setup>

import Header from '@/Components/Header.vue';
import Footer from '@/Components/Footer.vue';
import Accordion from '@/Components/Accordion.vue';

import { ref } from 'vue';
import { computed } from 'vue';

const min = 1;
const max = 100;
const maxDigits = 3;
const regex = new RegExp(`^[${min}-9][0-9]{0,${maxDigits - 1}}$`);
const maxStars = 5;
let quantity = ref(min);
const comments = ref([
    { id: 1, text: "Super produit", rating: 4 },
    { id: 2, text: "Pas mal", rating: 2 },
    { id: 3, text: "Mauvais produit", rating: 5 }
]);

const incrementQte = () => quantity.value++;
const decrementQte = () => quantity.value--;
const updateQte = () => {
    let value = document.getElementById('inputQte').value;
    if (value==="") {
        value = ""
    } else {
        if (!regex.test(value) || value.includes(",")) {
        console.log("Regex test failed");
        value = min
        document.getElementById('inputQte').value = value;
    }
    let valueToInt = parseInt(value);
    // Si la valueur est hors des bornes
    if (valueToInt > max || valueToInt < min) {
        valueToInt = clamp(valueToInt)
        document.getElementById('inputQte').value = valueToInt;
    }
    quantity.value = valueToInt;
    }
    
}

function clamp(value) {
    return Math.min(Math.max(value, min), max);
}

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


</script>


<style scoped>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

h1 {
    text-align: left;
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
    position: relative;
    left: 50%;
    transform: translateX(-50%);

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
    background-color: gray;
    grid-column: 1 / 3;
    height: 600px;
    border: 1px solid var(--lightgray);

}

.img_2 {
    grid-column: 1 / 2;
    height: 300px;
}

.img_3 {
    grid-column: 2 / 3;
    height: 300px;
}

.image-fit {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 15px;
    color: white;
    background-color: #007bff;
}
.add_to_card:hover {
    background-color: rgba(6, 59, 115, 0.9);
}

.available_btn:hover {
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
}

.input-group {
    position: relative;
    width: 50%;
    height: 50px;
}

.input-group input {
    text-align: left;
    padding-left: 1rem;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
  width: 100%;
  height: 100%;
  
  border: 1px solid #444;
  transition: border 0.3s ease, box-shadow 0.3s ease;

}

input[type="number"]:focus {
  outline: none;

  border: 1px solid var(--lightgray);
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
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

/* Comments'style */
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
    /* border: 1px solid red; */
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

@media(min-width: 950px) {
    .comments .comments_grid {
        grid-template-columns: 1fr 1fr;
    }
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
    /* border: 1px solid red; */
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
    /* border: 1px solid red; */
    
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
    /* color: var(--lightgray); */
}
.comments .comments_card .profile-infos .rating-starts {
    display: flex;
    flex-direction: row;
    gap: 0.1rem;
    align-items: center;
    /* border: 1px solid red; */
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
    /* color: red; */
}

/* .comments .comments_item .profile .profile-chld-2 {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
} */
/* End Comments'style */
</style>