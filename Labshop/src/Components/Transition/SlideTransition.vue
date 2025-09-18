<template>
    <Transition name="slide" mode="out-in">
        <slot></slot>
    </Transition>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

/* OUVERTURE : part de la droite (100%) et va vers 0 */
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

/* FERMETURE : part de 0 et repart vers la droite (100%) */
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>