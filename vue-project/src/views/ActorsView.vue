<script setup lang="ts">

import ActorsList from "@/components/ActorsList.vue";
defineProps<{
  parentMovieName?: string
  parentMovieId?: string
}>()
</script>

<template>
  <main>
    <ActorsList :parentMovieName="parentMovieName" :parentMovieId="parentMovieId"/>
  </main>
</template>
