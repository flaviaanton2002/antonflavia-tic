<script setup>
import ActorsList from "@/components/ActorsList.vue";

const props = defineProps({
  parentMovieName: String,
  parentMovieId: String,
});
</script>

<template>
  <main>
    <ActorsList
      :parentMovieName="parentMovieName"
      :parentMovieId="parentMovieId"
    />
  </main>
</template>
