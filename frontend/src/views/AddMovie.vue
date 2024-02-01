<template>
  <div class="col-md-12">
    <div class="card card-container">
      <Form
        id="addMovieForm"
        v-on:submit="handleAddMovie"
        :validation-schema="schema"
      >
        <div class="form-group">
          <label for="name" class="green">Name</label>
          <Field name="name" v-model="name" type="text" class="form-control" />
          <ErrorMessage name="name" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="description" class="green">Description</label>
          <Field
            name="description"
            v-model="description"
            type="text"
            class="form-control"
          />
          <ErrorMessage name="description" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="genre" class="green">Genre</label>
          <Field name="genre" v-model="genre" as="select" class="form-control">
            <option value="">Select Genre</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Action">Action</option>
            <option value="Thriller">Thriller</option>
            <option value="Fantastic">Fantastic</option>
          </Field>
          <ErrorMessage name="genre" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="image" class="green">Image</label>
          <Field
            name="image"
            v-model="image"
            type="text"
            class="form-control"
          />
          <ErrorMessage name="image" class="error-feedback" />
        </div>

        <div class="form-group">
          <button class="btn btn-primary btn-block" :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Add movie</span>
          </button>
        </div>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { RouterLink } from "vue-router";
import UserService from "@/services/user.service.js";

export default {
  name: "AddMovie",
  components: {
    RouterLink,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      name: yup.string().required("Name is required!"),
      description: yup.string().required("Description is required!"),
      genre: yup.string().required("Genre is required!"),
      image: yup
        .string()
        .required("Image is required!")
        .url("URL format is invalid!"),
    });

    return {
      loading: false,
      message: "",
      schema,
      name: "",
      description: "",
      genre: "",
      image: "",
    };
  },
  methods: {
    async handleAddMovie() {
      this.loading = true;

      const res = await UserService.addMovie(
        this.name,
        this.description,
        this.genre,
        this.image
      ).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message = "Adding Movie Failed";
        }
      );
      console.log(res);
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: rgb(24, 24, 24);
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-border-radius: 2px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
  -moz-box-shadow: 0px 2px 2px rgb(0, 189, 126);
  -webkit-box-shadow: 0px 2px 2px rgb(0, 189, 126);
  box-shadow: 0px 2px 2px rgb(0, 189, 126);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.error-feedback {
  color: red;
}
</style>
