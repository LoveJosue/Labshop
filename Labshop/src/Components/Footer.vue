<template>
    <footer class="ctn">
        <p>&copy; {{ currentYear }} Labstore. All rights reserved.</p>
      </footer>
</template>
    
<script setup>
const currentYear = new Date().getFullYear();
</script>
    
<style scoped>
.ctn {
    background: rgba(83, 82, 82, 0.1);
    color: black;
    padding: 1rem;
    margin-top: 2rem;
    text-align: center;
  }
</style>