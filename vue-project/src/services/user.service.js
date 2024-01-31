import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:3000";

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

  addActor(name, description, age, image, movieId) {
    return axios.post(
      API_URL + "/actors/addActor",
      {
        name,
        description,
        age,
        image,
        movieId,
      },
      { headers: authHeader() }
    );
  }

  deleteMovie(movieID) {
    return axios.delete(API_URL + "/movies/" + movieID, {
      headers: authHeader(),
    });
  }

  deleteActor(actorID) {
    return axios.delete(API_URL + "/actors/" + actorID, {
      headers: authHeader(),
    });
  }

  generateRandomActor(movieID) {
    return axios.post(
      API_URL + "/actors/addRandomActor",
      {
        movieID,
      },
      { headers: authHeader() }
    );
  }

  generateRandomMovie() {
    return axios.post(
      API_URL + "/movies/addRandomMovie",
      {},
      { headers: authHeader() }
    );
  }
}

export default new UserService();
