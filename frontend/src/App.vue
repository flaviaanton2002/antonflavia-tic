<script>
import UserService from "@/services/user.service.js";

export default {
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/");
    },
    async addRandomMovie() {
      const res = await UserService.addRandomMovie();
      if (this.$route.path === "/") {
        this.$router.go();
      } else {
        this.$router.push("/");
      }
    },
  },
};
</script>

<template>
  <v-layout>
    <v-navigation-drawer
      image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
      permanent
      theme="dark"
    >
      <v-list nav>
        <v-list-item
          to="/"
          prepend-icon="mdi-home"
          title="Home"
          value="home"
        ></v-list-item>
        <v-list-item
          v-if="loggedIn"
          to="/addMovie"
          prepend-icon="mdi-movie-open-plus"
          title="Add movie"
          value="addMovie"
        ></v-list-item>
        <v-list-item
          v-if="loggedIn"
          @click.prevent="addRandomMovie"
          prepend-icon="mdi-movie-open-plus-outline"
          title="Add random movie"
          value="addRandomMovie"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block v-if="loggedIn" @click.prevent="logOut" to="/login">
            Logout
          </v-btn>
          <v-btn block v-else to="/login"> Login </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main> <RouterView /> </v-main>
  </v-layout>
</template>
