<script>
import MovieImage from "@/components/icons/MovieImage.vue";
import ListItem from "@/components/ListItem.vue";
import UserService from "@/services/user.service.js";
export default {
  components: { ListItem, MovieImage },
  props: {
    parentMovieName: String,
    parentMovieId: String,
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
      console.log(res);
      this.listItems = await res.data;
    },
    async addRandomActor(parentMovieId) {
      const res = await UserService.addRandomActor(parentMovieId);
      this.$router.push("/");
    },
  },

  data() {
    return {
      listItems: [],
    };
  },
  mounted() {
    this.getAllActors(this.parentMovieId);
  },
};
</script>

<template>
  <div style="text-align: center">
    <h1 class="green">Actors that played in "{{ parentMovieName }}"</h1>
  </div>
  <div v-for="item in listItems">
    <ListItem>
      <template #icon>
        <MovieImage :imageLink="item.image" />
      </template>
      <div>
        {{ item.name }}
      </div>
      <div>
        {{ item.role }}
      </div>
      <div>
        {{ item.birthday }}
      </div>

      <div style="text-align: center">
        <i
          v-if="loggedIn"
          title="Delete Actor"
          class="pi pi-times"
          style="color: #42b883; font-size: 2rem"
          @click="deleteActor(item.id)"
        ></i>
      </div>
    </ListItem>
  </div>
  <div style="text-align: center">
    <i
      v-if="loggedIn"
      title="Add actor"
      class="pi pi-user"
      style="color: #35495e; font-size: 2rem"
      @click="addActor(parentMovieId)"
    ></i>
    <i
      v-if="loggedIn"
      title="Add random actor"
      class="pi pi-users"
      style="color: #35495e; font-size: 2rem"
      @click="addRandomActor(parentMovieId)"
    ></i>
    <i
      v-if="loggedIn"
      title="Delete movie"
      class="pi pi-trash"
      style="color: #35495e; font-size: 2rem"
      @click="deleteMovie(parentMovieId)"
    ></i>
  </div>
</template>
