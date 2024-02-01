<script>
import MovieImage from "@/components/icons/MovieImage.vue";
import ListItem from "@/components/ListItem.vue";
import UserService from "@/services/user.service.js";
import "primeicons/primeicons.css";

export default {
  components: { ListItem, MovieImage },
  data() {
    return {
      listItems: [],
    };
  },
  methods: {
    async getData() {
      const res = await UserService.getAllMovies();
      console.log(res);
      this.listItems = await res.data;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<template>
  <div v-for="item in listItems">
    <ListItem>
      <template #icon>
        <MovieImage :imageLink="item.image" />
      </template>
      <template #heading
        ><RouterLink :to="'/actors/' + item.name + '/' + item.id">{{
          item.name
        }}</RouterLink></template
      >
      <div>
        {{ item.genre }}
      </div>
      <div>
        {{ item.description }}
      </div>
    </ListItem>
  </div>
</template>
