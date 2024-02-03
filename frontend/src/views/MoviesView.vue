<script>
import UserService from "@/services/user.service.js";

export default {
  data() {
    return {
      listItems: [],
      show: false,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    async getAllMovies() {
      const res = await UserService.getAllMovies();
      console.log(res);
      this.listItems = await res.data;
    },
    async deleteMovie(movieId) {
      const res = await UserService.deleteMovie(movieId);
      this.$router.go();
    },
  },
  mounted() {
    this.getAllMovies();
  },
};
</script>

<template>
  <v-list style="background-color: transparent">
    <v-list-item v-for="item in listItems">
      <v-card class="mx-auto" max-width="344">
        <v-img :src="item.image" alt="ERROR" height="75px" cover></v-img>

        <v-card-title
          ><RouterLink
            :to="'/actors/' + item.name + '/' + item.id"
            class="movie-link"
            >{{ item.name }}</RouterLink
          ></v-card-title
        >

        <v-card-subtitle class="genre">
          {{ item.genre }}
        </v-card-subtitle>

        <v-card-actions>
          <v-btn
            v-if="loggedIn"
            title="Edit movie"
            class="ms-2"
            icon="mdi-movie-open-edit"
            variant="text"
          >
          </v-btn>

          <v-btn
            v-if="loggedIn"
            title="Delete movie"
            @click="deleteMovie(item.id)"
            class="ms-2"
            icon="mdi-movie-open-remove"
            variant="text"
          >
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            @click="show = !show"
          ></v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider></v-divider>

            <v-card-text>
              {{ item.description }}
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
    </v-list-item>
  </v-list>
</template>

<style scoped>
.movie-link {
  text-decoration: none;
  color: inherit;
  padding-left: 0px;
}

.genre {
  color: #2196f3;
  text-transform: uppercase;
}
</style>
