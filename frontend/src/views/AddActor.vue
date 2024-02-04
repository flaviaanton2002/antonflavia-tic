<script>
import UserService from "@/services/user.service.js";
import { isValid, isAfter } from "date-fns";

export default {
  data() {
    const schema = {
      name: [(v) => !!v || "Name is required!"],
      role: [(v) => !!v || "Role is required!"],
      birthday: [
        (v) => !!v || "Birthday is required!",
        (v) => {
          const dateFormatValid = /\d{4}-\d{2}-\d{2}/.test(v);
          if (!dateFormatValid) {
            return "Date format is invalid! (YYYY-MM-DD)";
          }

          const inputDate = new Date(v);
          const currentDate = new Date();

          if (!isValid(inputDate) || isAfter(inputDate, currentDate)) {
            return "Invalid date!";
          }

          return true;
        },
      ],
      image: [
        (v) => !!v || "Image is required!",
        (v) =>
          /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i.test(v) ||
          "Invalid image URL format!",
      ],
    };
    return {
      successful: false,
      message: "",
      actor: {
        name: "",
        role: "",
        birthday: "",
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
    async handleAddActor() {
      try {
        const data = await UserService.addActor(
          this.actor.name,
          this.actor.role,
          this.actor.birthday,
          this.actor.image,
          this.parentMovieId
        );
        this.successful = true;
        this.$router.go(-1);
      } catch (error) {
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
  <v-form @submit.prevent="handleAddActor" v-if="loggedIn">
    <v-text-field
      v-model="actor.name"
      :rules="schema.name"
      label="Name"
    ></v-text-field>

    <v-text-field
      v-model="actor.role"
      :rules="schema.role"
      label="Role"
    ></v-text-field>

    <v-text-field
      v-model="actor.birthday"
      :rules="schema.birthday"
      label="Birthday"
    ></v-text-field>

    <v-text-field
      v-model="actor.image"
      :rules="schema.image"
      label="Image"
    ></v-text-field>

    <v-btn color="primary" type="submit"> Add actor </v-btn>

    <v-alert v-if="message" :type="successful ? 'success' : 'error'">
      {{ message }}
    </v-alert>
  </v-form>
</template>
