
<template>
  <Header></Header>
  <router-view></router-view>
  <Footer></Footer>
</template>

<script setup>
import Header from "./Components/Header.vue";
import Footer from "./Components/Footer.vue";
import { inject } from "@vercel/analytics"
inject();
</script>

<style>
</style>