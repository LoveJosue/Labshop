
<template>
  <component :is="routeOrder() ? HeaderOrder : Header" />
  <router-view></router-view>
  <Footer v-if="!routeOrder()"></Footer>
</template>

<script setup>
import Header from "./Components/Header.vue";
import HeaderOrder from "./Components/HeaderOrder.vue";
import Footer from "./Components/Footer.vue";
import { useRoute } from "vue-router";
import { inject } from "@vercel/analytics"
inject();

const route = useRoute();
const routeOrder = () => { return  route.name === 'order' }
</script>

<style>
</style>