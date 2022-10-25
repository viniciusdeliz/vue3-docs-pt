<script setup lang="ts">
import ThemeHero from './ThemeHero.vue'
import ThemeList from './ThemeList.vue'
import ThemeContact from './ThemeContact.vue'
</script>

<template>
  <div class="ThemePage">
    <ThemeHero>
      <template #title>Themes</template>
      <template #lead>Check out the themes, UI Kits, and plugins. You can see how a real-world application is built with Vue by our partners.</template>
    </ThemeHero>

    <ThemeList />

    <ThemeContact>
      Deseja mencionar os teus temas aqui?
      <a class="link" href="mailto:evan@vuejs.org?subject=Theme+affiliation">Contacte-nos!</a>
    </ThemeContact>
  </div>
</template>
