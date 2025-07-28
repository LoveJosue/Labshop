<template>
  <div class="relative w-full">
    <div
      @click="toggleDropdown"
      class="rounded-md flex flex-row justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
    >
      {{ selectedLabel }}
      <svg viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4">
      <path d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
    </svg>
    </div>

    <ul
      v-if="isOpen"
      class="rounded-md absolute z-10 mt-2 w-full bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto transition-all"
    >
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
        class="px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
        :class="{
          'bg-gray-50 text-gray-700 font-medium': option.value === modelValue
        }"
      >
        <div class="flex flex-row space-between justify-between">
            <span>{{ option.label }}</span>
            <span class='text-primaryBlue border bg-white rounded-md px-2' v-if='option.clue'>{{ option.clue }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SelectDropdown',
  props: {
    modelValue: {
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
//   computed: {
//     selectedLabel() {
//       const selected = this.options.find(opt => opt.value === this.modelValue);
//       return selected ? selected.label : 'Selectionnez votre tarif ...';
//     }
//   },
    computed: {
        selectedLabel() {
        const selected = this.options.find(opt => opt.value === this.modelValue);
        return selected ? selected.label : 'Selectionnez votre tarif ...';
        }
    },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.$emit('update:modelValue', option.value);
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
/* Fermeture du dropdown en cliquant en dehors (bonus JS si nécessaire) */
</style>
