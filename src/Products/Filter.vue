<template>

<div style="text-align: right;">
    <Drawer v-model:visible="visible" header="Trier et filtrer" position="right" title="Triez">
        <div>
            <p>Tri</p><br>
            <button class="hover" @click="emitPriceAsc">Prix croissant</button>
            <button class="hover" @click="emitPriceDesc">Prix décroisant</button>
        </div>
        <div class="accordion">
            
        </div>

        <!-- // CURRENT FEATURE -->
        <!-- <div style="margin-top:50px;">
            <p>Filtre</p>
            <div class="card">
                <Accordion :value="['0']" multiple expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
                    <AccordionPanel>
                        <AccordionHeader>Marque</AccordionHeader>
                        <AccordionContent>
                            <p class="m-0">
                                Content
                            </p>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="1">
                        <AccordionHeader>Pays de fabrication</AccordionHeader>
                        <AccordionContent>
                            <p class="m-0">
                                Content
                            </p>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="2">
                        <AccordionHeader>Plage de prix</AccordionHeader>
                        <AccordionContent>
                            <p class="m-0">
                                content
                            </p>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </div>
        </div>     -->
    </Drawer>
    <Button icon="pi pi-filter" @click="visible = true"></Button>
</div>

</template>

<script setup>

import { ref } from "vue";
import Button from "primevue/button"
import Drawer from 'primevue/drawer';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
// CURRENT FEATURE
// import Accordion from 'primevue/accordion';
// import AccordionPanel from 'primevue/accordionpanel';
// import AccordionHeader from 'primevue/accordionheader';
// import AccordionContent from 'primevue/accordioncontent';

const visible = ref(false);

const emits = defineEmits(['sortPriceAsc', 'sortPriceDesc']);

const emitPriceAsc = () => {
    emits('sortPriceAsc')
}
const emitPriceDesc = () => {
    emits('sortPriceDesc')
}


</script>

<style>
.hover {
    cursor: pointer;
}
</style>