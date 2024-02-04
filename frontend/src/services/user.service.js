import axios from "axios";

const API_URL = "http://localhost:3000";

function authHeader() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}

class UserService {
  getAllMovies() {
    return axios.get(API_URL + "/movies");
  }

  getAllActors(movieId) {
    return axios.get(API_URL + "/actors/" + movieId);
  }

  addMovie(name, description, genre, image) {
    return axios.post(
      API_URL + "/movies/addMovie",
      {
        name,
        description,
        genre,
        image,
      },
      { headers: authHeader() }
    );
  }

  addActor(name, role, birthday, image, movieId) {
    return axios.post(
      API_URL + "/actors/addActor",
      {
        name,
        role,
        birthday,
        image,
        movieId,
      },
      { headers: authHeader() }
    );
  }

  deleteMovie(movieId) {
    return axios.delete(API_URL + "/movies/" + movieId, {
      headers: authHeader(),
    });
  }

  deleteActor(actorId) {
    return axios.delete(API_URL + "/actors/" + actorId, {
      headers: authHeader(),
    });
  }

  addRandomMovie() {
    return axios.post(
      API_URL + "/movies/addRandomMovie",
      {},
      { headers: authHeader() }
    );
  }

  addRandomActor(movieId) {
    return axios.post(
      API_URL + "/actors/addRandomActor",
      {
        movieId,
      },
      { headers: authHeader() }
    );
  }
}

export default new UserService();
