<script>
import MovieImage from "@/components/icons/MovieImage.vue";
import ListItem from "@/components/ListItem.vue";
import UserService from "@/services/user.service.js";
export default {
  components: {ListItem, MovieImage},
  props: {
    parentMovieName: String,
    parentMovieId: String
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    async deleteMovie(parentMovieId) {
      const res = await UserService.deleteMovie(parentMovieId);
      this.$router.push("/");
    },
    async deleteActor(actorId) {
      const res = await UserService.deleteActor(actorId);
      this.$router.push("/");
    },
    addActor(parentMovieId) {
      this.$router.push("/addActor/" + parentMovieId);
    },
    async getAllActors(parentMovieId) {
      const res = await UserService.getAllActors(parentMovieId);
      console.log(res)
      this.listItems = await res.data;
    },
    async generateRandomActor(parentMovieId) {
      const res = await UserService.generateRandomActor(parentMovieId);
      this.$router.push("/");
    },
    async generateRandomMovie() {
      const res = await UserService.generateRandomMovie();
      this.$router.push("/");
    }
  },

  data() {
    return {
      listItems: [],
    }

  },
  mounted() {
    this.getAllActors(this.parentMovieId)
  }
};
</script>

<template>
  <div style="text-align: center">
    <h1 class="green"> List of actors for {{parentMovieName}}</h1>
  </div>
  <div v-for="item in listItems">
    <ListItem>
      <template #icon>
        <MovieImage :imageLink="item.image" />
      </template>
      <div>
        {{item.name}}
      </div>
      <div>
        {{item.description}}
      </div>
      <div>
        {{item.age}}
      </div>

      <div style="text-align: center">
        <i v-if="loggedIn" title = "Delete Actor" class="pi pi-times" style="color: green; font-size: 2rem" @click="deleteActor(item.id)"></i>

      </div>

    </ListItem>
  </div>
  <div style="text-align: center">
    <i v-if="loggedIn" title = "Delete Movie" class="pi pi-trash" style="color: #708090; font-size: 2rem" @click="deleteMovie(parentMovieId)"></i>
    <i v-if="loggedIn" title = "Add Actor"  class="pi pi-user" style="color: #708090; font-size: 2rem" @click="addActor(parentMovieId)"></i>
    <i v-if="loggedIn" title = "Generate Random Actor"  class="pi pi-discord" style="color: #708090; font-size: 2rem" @click="generateRandomActor(parentMovieId)"></i>
    <i v-if="loggedIn" title = "Generate Random Movie"  class="pi pi-database" style="color: #708090; font-size: 2rem" @click="generateRandomMovie()"></i>
  </div>

</template>
