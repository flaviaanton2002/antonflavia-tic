<script>
import UserService from "@/services/user.service.js";
import { RouterLink } from "vue-router";

export default {
  data() {
    return {
      listItems: [],
      selectedMovieId: null,
      sortOptions: ["Name ascending", "Name descending"],
      selectedSortOption: "Name ascending",
      genreFilterOptions: [
        "All",
        "Comedy",
        "Drama",
        "Action",
        "Thriller",
        "Fantastic",
      ],
      selectedGenreFilter: "All",
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
    filteredListItems() {
      let filteredList = [...this.listItems];
      if (this.selectedGenreFilter !== "All") {
        filteredList = filteredList.filter(
          (item) => item.genre === this.selectedGenreFilter
        );
      }

      if (this.selectedSortOption === "Name ascending") {
        filteredList.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.selectedSortOption === "Name descending") {
        filteredList.sort((a, b) => b.name.localeCompare(a.name));
      }
      return filteredList;
    },
  },
  methods: {
    async getAllMovies() {
      const res = await UserService.getAllMovies();
      this.listItems = await res.data;
    },
    async deleteMovie(movieId) {
      const res = await UserService.deleteMovie(movieId);
      this.$router.go();
    },
    selectMovie(movieId) {
      if (this.selectedMovieId === movieId) {
        this.selectedMovieId = null;
      } else {
        this.selectedMovieId = movieId;
      }
    },
  },
  mounted() {
    this.getAllMovies();
  },
};
</script>

<template>
  <v-select
    v-model="selectedGenreFilter"
    :items="genreFilterOptions"
    label="Genre filter"
  ></v-select>

  <v-select
    v-model="selectedSortOption"
    :items="sortOptions"
    label="Sort"
  ></v-select>

  <v-list style="background-color: transparent">
    <v-list-item v-for="item in filteredListItems" :key="item.id">
      <v-card class="mx-auto" max-width="344">
        <v-img :src="item.image" alt="ERROR" height="75px" cover></v-img>

        <v-card-title>
          <RouterLink
            :to="'/actors/' + item.name + '/' + item.id"
            class="movie-link"
          >
            {{ item.name }}
          </RouterLink>
        </v-card-title>

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
          ></v-btn>

          <v-btn
            v-if="loggedIn"
            title="Delete movie"
            @click="deleteMovie(item.id)"
            class="ms-2"
            icon="mdi-movie-open-remove"
            variant="text"
          ></v-btn>

          <v-btn
            :icon="
              selectedMovieId === item.id
                ? 'mdi-chevron-up'
                : 'mdi-chevron-down'
            "
            @click="selectMovie(item.id)"
          ></v-btn>
        </v-card-actions>

        <v-expand-transition>
          <div v-show="selectedMovieId === item.id">
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
