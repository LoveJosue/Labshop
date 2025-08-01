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
            <div v-if="item.infoType === ONE" class="grid grid-cols-2 justify-between gap-1">
                <div v-for="elem in item.subInfos">
                    <p style="font-size: 0.75rem;" class="text-gray-700 underline font-[900]">{{ elem.title }}</p>
                    <p v-if="typeof elem.content === 'string'" style="font-size: smaller;" class="margin-top">{{ elem.content }}</p>
                    <ul v-if="typeof elem.detailedContent === 'object'" class="mt-10 margin-top">
                        <li v-if="elem.detailedContent.capacity">Volume : {{ getVolume(elem) }}</li>
                        <li v-if="elem.detailedContent.packaging">Conditionnement : {{ elem.detailedContent.packaging }}</li>
                        <li v-if="elem.detailedContent.material">Matière : {{ getMaterial(elem) }}</li>
                        <li v-if="elem.detailedContent.dimensions">Dimensions : {{ getDimensions(elem) }}</li>
                    </ul>
                </div>
            </div>

            <div v-if="item.infoType === TWO">
                <p>{{ item.content }}</p>
            </div>
            
            <div v-if="item.infoType === THREE">
                <p>{{ item.content }}</p>
            </div>
        </div>

        <!-- <div v-if="item.id === TWO" class="content grid grid-cols-2 justify-between gap-x-2">
            <p>Caractéristiques</p>
        </div> -->
        <!-- <div v-if="item.id === ONE" class="content grid grid-cols-2 justify-between gap-x-2">
            <div v-for="elem in item.subElems">
                <p class="text-xs">{{ elem.title }}</p>
                <p v-if="typeof elem.content === 'string'" style="font-size: smaller;" class="margin-top">{{ elem.content }}</p>
                <ul v-else-if="typeof elem.content === 'object'" class="mt-10 margin-top">
                    <li v-if="elem.content.volume">Volume : {{ elem.content.volume }}</li>
                    <li v-if="elem.content.packaging">Conditionnement : {{ elem.content.packaging }}</li>
                    <li v-if="elem.content.dimensions">Dimensions : {{ elem.content.dimensions }}</li>
                </ul>
            </div>
        </div>
        <div v-if="item.id === TWO" class="content grid grid-cols-2 justify-between gap-x-2">
            <p>Caractéristiques</p>
        </div> -->
        <!-- <div class="content">
            <ul>
                <li>Hello</li>
                <li>Hello</li>
                <li>Hello</li>
            </ul>
        </div> -->
    </div>
</div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
const ONE = 1; // 1 -> Détails du produit
const TWO = 2; // 2 -> Caractéristiques du produit
const THREE = 3; // 3 -> Guide d'entreposage


const props = defineProps({
    accordionItems : { type: Array, default: []}
})

const activeIndexes = ref([]);

onMounted(() => {
    if (props.accordionItems) {
        console.log(props.accordionItems);
    }
})
// const accordionItems = [
//     {
//         title:  "Détails du produit",
//         content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi deleniti, sequi dolore cum perspiciatis assumenda commodi rerum praesentium illo ab quam? Nihil nam soluta vel, culpa vitae porro molestias saepe."
//     },

//     {
//         title: "Caractéristiques",
//         content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi deleniti, sequi dolore cum perspiciatis assumenda commodi rerum praesentium illo ab quam? Nihil nam soluta vel, culpa vitae porro molestias saepe."
//     },

//     {
//         title: "Entretien",
//         content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi deleniti, sequi dolore cum perspiciatis assumenda commodi rerum praesentium illo ab quam? Nihil nam soluta vel, culpa vitae porro molestias saepe."
//     }
// ]
// const accordionItems = [
//     {
//         id: 1,
//         title:  "Détails du produit",
//         subElems: [
//             {
//                 title: 'Description',
//                 content: 'Ceci est un produit qui peut-être utilisé pour ceci et cela'
//             },

//             {
//                 title: "Détails",
//                 content: {
//                     volume: '1µL',
//                     packaging: 'sachet',
//                     dimensions: '110mm x 40mm'
//                 }
//             }
//         ],
//     },
//     {
//         id: 2,
//         title:  "Caractéristiques du produit",
//         content: 'Ce produit est conforme aux normes de fabrication ISO'
//     },
//     {
//         id: 3,
//         title:  "Guide d'entreposage",
//         content: "Concervez ce produit à température ambiente dans un espace aéré pour éviter le développement de moisissures."
//     }
// ]


function toggleAccordion (index) {
    if (activeIndexes.value.includes(index)) {
        activeIndexes.value = activeIndexes.value.filter(i => i !== index);
    } else {
        activeIndexes.value.push(index);
    }
}
// State1
// const getDimensions = (elem) => {
//     const detailedContent = elem.detailedContent;
//     const dimensions = detailedContent.dimensions;
//     const length = dimensions.length;
//     const width = dimensions.width;
//     const unit = dimensions.unit;
//     return `${length}${unit}x${width}${unit}`;
// }
const getDimensions = (elem) => {
    if (!elem || !elem.detailedContent) {
        return '';
    }
    const detailedContent = elem.detailedContent;
    const dimensions = detailedContent.dimensions;
    const unit = dimensions.unit ? dimensions.unit : '';
    // Éventuellement on pourrait avoir une petite notice qui mentionne la nature des dimensions (ex: Longueur x Largeur) à l'interface
    const length = dimensions.length ? `x ${dimensions.length}` : '';
    const width = dimensions.width ? `x ${dimensions.width}` : '';
    const diameter = dimensions.diameter ? `x ${dimensions.diameter}` : '';
    const thickness = dimensions.thickness ? `x ${dimensions.thickness}` : '';
    let result = `${length} ${width} ${diameter} ${thickness} ${unit}`.replace(/^x+/, '');
    return result;
}
const getMaterial = (elem) => {
    if (!elem || !elem.detailedContent) {
        return '';
    }
    const detailedContent = elem.detailedContent;
    const material = detailedContent.material ? detailedContent.material : '';
    return material;
}
const getVolume = (elem) => {
    const capacity = elem.detailedContent.capacity;
    const volume = capacity.volume;
    const unit = capacity.unit;
    return `${volume}${unit}`;
}
</script>

<style scoped>
ul {
    all: inherit;
}
.content ul {
    padding-left: 1.5rem;
}
.content li {
    font-size: smaller;
    font-weight: 200;
}
.content p {
    font-size: smaller;
}
.margin-top {
    margin-top: -0.4rem;
}
</style>
