<script setup lang="ts">
defineProps<{
  imageLink?: string

}>()
</script>

<template>
  <img :src="imageLink" alt="ERROR" height="75px" width="150px">
</template>

