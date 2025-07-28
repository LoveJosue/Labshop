<template>
  <div class="input-ctn">
    <input type="number" 
           v-model="internalValue"
           inputmode="numeric" 
           @keydown="blockInvalidChar" 
           @input="handleInput"
           @blur="validateInput"
           placeholder="Quantité"
    />
    <div class="btn-group">
        <button @click="decrement" :disabled="internalValue <= min"><span>-</span></button>
        <button @click="increment" :disabled="internalValue >= max"><span>+</span></button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    min: { type: Number, default: 1},
    max: { type: Number, default: 100},
    modelValue: {type: Number, default: 1}
})

const emit = defineEmits(['update:modelValue']);
// Valeur locale de l'input
const internalValue = ref(props.modelValue);

// Synchronise la valeur si props change depuis le parent
watch(() => props.modelValue, (newVal) => { internalValue.value = newVal; });

// Bloque les caractères non numériques
const blockInvalidChar = (e) => {
    const invalidChars = ['e', 'E', '+', '-', ',', '.'];
    if (invalidChars.includes(e.key)) {
        e.preventDefault();
    }
}

const handleInput = (e) => {
  const rawValue = e.target.value;
  const parsed = parseInt(rawValue);
  if (!isNaN(parsed)) {
    internalValue.value = parsed;
  }
};

// À la sortie du champ : applique les bornes
const validateInput = () => {
  let value = internalValue.value;
  if (isNaN(value)) value = props.min;
  value = Math.max(props.min, Math.min(props.max, value));
  internalValue.value = value;
  emit('update:modelValue', value);
};

const increment = () => {
  if (internalValue.value < props.max) {
    internalValue.value++;
    emit('update:modelValue', internalValue.value);
  }
};

const decrement = () => {
  if (internalValue.value > props.min) {
    internalValue.value--;
    emit('update:modelValue', internalValue.value);
  }
};
</script>

<style scoped>
.input-ctn {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
    padding: 0 0.2rem;
}
.input-ctn input {
    display: inline-block;
    width: 100%;
    border: none;
    text-align: left;
    padding-left: 10%;
}
.input-ctn .btn-groups {
    display: flex;
    justify-content: space-around;
    border-left: 1px solid var(--lightgray);
}
.input-ctn .btn-group > button {
    height: 100%;
    width: 100%;
    background: none;
    transition: background ease 0.3s;
}
.input-ctn .btn-group button span {
    font-size: 1.3rem;
}
.input-ctn .btn-group > button:hover {
    background-color: var(--lightgray);
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
  transition: border 0.3s ease, box-shadow 0.3s ease;
}
input[type="number"]:focus {
  outline: none;
}
</style>
