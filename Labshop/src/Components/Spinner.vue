<template>
    <div class="spin-container">
        <div class="spinner"></div>
        <p>Chargement des données...</p>
    </div>
</template>

<script setup>

</script>

<style scoped>
.spin-container {
    position: fixed;
    top: 0%;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    z-index: 3;
    gap: 0.5rem;
}
.spinner {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    border: 1px solid black;
    border-top: 3px solid #333;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>