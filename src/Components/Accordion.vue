<template>
<div class="accordion">
    <div v-for="(item, index) in accordionItems" class="accordion-itm">
        <button :aria-expanded="activeIndexes.includes(index)"
                @click="toggleAccordion(index)">
            <span class="accordion-title">{{ item.title }}</span>
            <span class="icon" :class="activeIndexes.includes(index) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'">
            </span>
        </button>
        <div class="content">
            <p>
                {{ item.content }}
            </p>
        </div>
    </div>
</div>
</template>

<script setup>

import {ref} from 'vue';

const activeIndexes = ref([]);
const accordionItems = [
    {
        title:  "Détails du produit",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi deleniti, sequi dolore cum perspiciatis assumenda commodi rerum praesentium illo ab quam? Nihil nam soluta vel, culpa vitae porro molestias saepe."
    },

    {
        title: "Caractéristiques",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi deleniti, sequi dolore cum perspiciatis assumenda commodi rerum praesentium illo ab quam? Nihil nam soluta vel, culpa vitae porro molestias saepe."
    },

    {
        title: "Entretien",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi deleniti, sequi dolore cum perspiciatis assumenda commodi rerum praesentium illo ab quam? Nihil nam soluta vel, culpa vitae porro molestias saepe."
    }
]


function toggleAccordion (index) {
    if (activeIndexes.value.includes(index)) {
        activeIndexes.value = activeIndexes.value.filter(i => i !== index);
    } else {
        activeIndexes.value.push(index);
    }
}
</script>

<style scoped>

</style>
