
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
import { onMounted } from "vue";
import { inject } from "@vercel/analytics"
import { useAuth } from "./stores/useAuth.js";
inject();

const route = useRoute();
const routeOrder = () => { return  route.name === 'order' }

// Restaure la session si un cookie est encore valide
const { fetchMe } = useAuth();
onMounted(() => { fetchMe(); });
</script>

<style>
</style>