<template>
    <div class="wrap" @click="toggle">
        <div class="radio" tabindex="0" :class="{filled: isSelected}">
            <!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="check-icon">
                <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
            </svg>
        </div>
        <p class="text">{{ text }}</p>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// const selected = ref(false);
const props = defineProps({
    text: String,
    selected: Boolean
})

const emit = defineEmits(['update:selected']);

const isSelected = ref(props.selected);

watch(() => props.selected, (newVal) => {
    isSelected.value = newVal;
});

function toggle() {
    isSelected.value = !isSelected.value;
    emit('update:selected', isSelected.value);
}

</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.wrap {
    cursor: pointer;
    width: fit-content;
    display: flex;
    align-items: center;
}
.radio {
    width: 20px;
    height: 20px;
    border: 1px solid #333;
    padding: 3px;
    border-radius: 3px;
    margin-right: 0.5rem;
    background-color: transparent;
    transition: background-color 0.2s ease;
}
.text {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.02em;
}
.filled {
    background-color: #333;
    border: none;
}
.check-icon {
    fill: none;
}
.radio.filled .check-icon {
    fill: white;
}
</style>