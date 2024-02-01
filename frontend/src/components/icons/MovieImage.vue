<script setup>
const { imageLink } = defineProps(["imageLink"]);
</script>

<template>
  <img :src="imageLink" alt="ERROR" height="75px" width="150px" />
</template>
