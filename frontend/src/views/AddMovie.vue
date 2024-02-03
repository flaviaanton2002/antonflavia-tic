<script>
import UserService from "@/services/user.service.js";

export default {
  data() {
    const schema = {
      name: [(v) => !!v || "Name is required!"],
      description: [(v) => !!v || "Description is required!"],
      genre: [(v) => !!v || "Genre is required!"],
      image: [
        (v) => !!v || "Image is required!",
        (v) =>
          /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(v) ||
          "Invalid image URL format!",
      ],
    };
    return {
      successful: false,
      message: "",
      movie: {
        name: "",
        description: "",
        genre: "",
        image: "",
      },
      schema,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  methods: {
    async handleAddMovie() {
      try {
        const data = await UserService.addMovie(
          this.movie.name,
          this.movie.description,
          this.movie.genre,
          this.movie.image
        );
        this.successful = true;
        this.$router.go(-1);
      } catch (error) {
        console.log(error);
        this.message = error.response.data.error;
        this.successful = false;
        this.setClearMessageTimeout();
      }
    },
    setClearMessageTimeout() {
      setTimeout(() => {
        this.message = "";
      }, 3000);
    },
  },
};
</script>

<template>
  <v-form @submit.prevent="handleAddMovie" v-if="loggedIn">
    <v-text-field
      v-model="movie.name"
      :rules="schema.name"
      label="Name"
    ></v-text-field>

    <v-text-field
      v-model="movie.description"
      :rules="schema.description"
      label="Description"
    ></v-text-field>

    <v-select
      v-model="movie.genre"
      :rules="schema.genre"
      :items="['Comedy', 'Drama', 'Action', 'Thriller', 'Fantastic']"
      label="Genre"
    ></v-select>

    <v-text-field
      v-model="movie.image"
      :rules="schema.image"
      label="Image"
    ></v-text-field>

    <v-btn color="primary" type="submit"> Add movie </v-btn>

    <v-alert v-if="message" :type="successful ? 'success' : 'error'">
      {{ message }}
    </v-alert>
  </v-form>
</template>
