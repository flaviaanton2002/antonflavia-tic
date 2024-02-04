<script>
import UserService from "@/services/user.service.js";

export default {
  props: {
    parentMovieName: String,
    parentMovieId: String,
  },
  data() {
    return {
      listItems: [],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    async getAllActors(parentMovieId) {
      const res = await UserService.getAllActors(parentMovieId);
      this.listItems = await res.data;
    },
    addActor(parentMovieId) {
      this.$router.push("/addActor/" + parentMovieId);
    },
    async addRandomActor(parentMovieId) {
      const res = await UserService.addRandomActor(parentMovieId);
      this.$router.go();
    },
    editActor(actorId) {
      this.$router.push("/editActor/" + actorId);
    },
    async deleteActor(actorId) {
      const res = await UserService.deleteActor(actorId);
      this.$router.go();
    },
  },
  mounted() {
    this.getAllActors(this.parentMovieId);
  },
};
</script>

<template>
  <v-container>
    <h1>Cast of the movie "{{ parentMovieName }}"</h1>
    <v-row dense>
      <v-col cols="12" v-for="item in listItems">
        <v-card
          image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
          theme="dark"
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5"> {{ item.role }} </v-card-title>

              <v-card-subtitle>{{ item.name }}</v-card-subtitle>
              <v-card-subtitle>{{ item.birthday }}</v-card-subtitle>

              <v-card-actions>
                <v-btn
                  v-if="loggedIn"
                  title="Edit actor"
                  @click="editActor(item.id)"
                  class="ms-2"
                  icon="mdi-account-edit"
                  variant="text"
                ></v-btn>

                <v-btn
                  v-if="loggedIn"
                  title="Delete actor"
                  @click="deleteActor(item.id)"
                  class="ms-2"
                  icon="mdi-account-remove"
                  variant="text"
                ></v-btn>
              </v-card-actions>
            </div>

            <v-avatar class="ma-3" size="125" rounded="0">
              <v-img :src="item.image"></v-img>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-btn
        v-if="loggedIn"
        title="Add actor"
        @click="addActor(parentMovieId)"
        class="ms-2"
        icon="mdi-account-plus"
        variant="text"
      ></v-btn>
      <v-btn
        v-if="loggedIn"
        title="Add random actor"
        @click="addRandomActor(parentMovieId)"
        class="ms-2"
        icon="mdi-account-plus-outline"
        variant="text"
      ></v-btn>
    </v-row>
  </v-container>
</template>
