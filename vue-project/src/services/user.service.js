import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:3000';

class UserService {
    getAllMovies() {
        return axios.get(API_URL + '/api/movies');
    }

    getAllActors(movieId) {
        return axios.get(API_URL + '/api/actors/' + movieId);
    }

    addMovie(name, description, genre, image) {
        return axios.post(API_URL + '/api/movies', {
            name,
            description,
            genre,
            image,
        },  {headers: authHeader()});
    }

    addActor(name, description, age, image, movieId) {
        return axios.post(API_URL + '/api/actors', {
            name,
            description,
            age,
            image,
            movieId
        },  {headers: authHeader()});
    }

    deleteMovie(movieID) {
        return axios.delete(API_URL + '/api/movies/' + movieID, {headers: authHeader()});
    }

    deleteActor(actorID) {
        return axios.delete(API_URL + '/api/actors/' + actorID, {headers: authHeader()});
    }

    generateRandomActor(movieID) {
        return axios.post(API_URL + '/api/actors/generateRandomActor', {
            movieID
        },  {headers: authHeader()});
    }

    generateRandomMovie() {
        return axios.post(API_URL + '/api/movies/generateRandomMovie', {
        },  {headers: authHeader()});
    }
}

export default new UserService();