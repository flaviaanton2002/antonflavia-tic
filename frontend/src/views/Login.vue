<script>
export default {
  data() {
    const schema = {
      email: [(v) => !!v || "Email is required!"],
      password: [(v) => !!v || "Password is required!"],
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
    async handleLogin() {
      try {
        await this.$store.dispatch("auth/login", this.user);
        this.$router.push("/");
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
  <v-form @submit.prevent="handleLogin" v-if="!loggedIn">
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

    <v-btn color="primary" type="submit">Submit</v-btn>

    <v-btn v-if="!loggedIn" @click="$router.push('/register')"
      >You don't have an account yet?</v-btn
    >

    <v-alert v-if="message" :type="successful ? 'success' : 'error'">
      {{ message }}
    </v-alert>
  </v-form>
</template>
