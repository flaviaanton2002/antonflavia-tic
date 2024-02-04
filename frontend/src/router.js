import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import MoviesView from "@/views/MoviesView.vue";
import ActorsView from "@/views/ActorsView.vue";
import AddMovie from "@/views/AddMovie.vue";
import AddActor from "@/views/AddActor.vue";
import EditMovie from "@/views/EditMovie.vue";
import EditActor from "@/views/EditActor.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MoviesView,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/addMovie",
      component: AddMovie,
    },
    {
      path: "/editMovie/:movieId",
      component: EditMovie,
    },
    {
      path: "/actors/:parentMovieName/:parentMovieId",
      component: ActorsView,
      props: true,
    },
    {
      path: "/addActor/:parentMovieId",
      component: AddActor,
    },
    {
      path: "/editActor/:actorId",
      component: EditActor,
    },
  ],
});

export default router;
