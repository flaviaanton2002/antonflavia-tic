<script>
export default {
  data() {
    const schema = {
      email: [
        (v) => !!v || "Email is required!",
        (v) => /.+@.+\..+/.test(v) || "Invalid email format!",
      ],
      password: [
        (v) => !!v || "Password is required!",
        (v) =>
          /^[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(v) ||
          "Must be at least 8 characters!",
        (v) =>
          /^(?=.*[a-z])/.test(v) ||
          "Must have at least one lowercase character!",
        (v) =>
          /^(?=.*[A-Z])/.test(v) ||
          "Must have at least one uppercase character!",
        (v) => /^(?=.*\d)/.test(v) || "Must have at least one digit!",
        (v) =>
          /^(?=.*[!@#$%^&*(),.?":{}|<>])/.test(v) ||
          "Must have at least one special character!",
      ],
    };
    return {
      successful: false,
      message: "",
      user: {
        email: "",
        password: "",
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
    async handleRegister() {
      try {
        await this.$store.dispatch("auth/register", this.user);
        this.successful = true;
        this.$router.push("/login");
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
  <v-form @submit.prevent="handleRegister" v-if="!loggedIn">
    <v-text-field
      v-model="user.email"
      :rules="schema.email"
      label="Email"
    ></v-text-field>

    <v-text-field
      v-model="user.password"
      :rules="schema.password"
      label="Password"
      type="password"
    ></v-text-field>

    <v-btn color="primary" type="submit"> Submit </v-btn>

    <v-alert v-if="message" :type="successful ? 'success' : 'error'">
      {{ message }}
    </v-alert>
  </v-form>
</template>
