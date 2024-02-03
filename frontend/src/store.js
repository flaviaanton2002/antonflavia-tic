import { createStore } from "vuex";
import AuthService from "./services/auth.service";

const user = JSON.parse(localStorage.getItem("user")) || null;

const auth = {
  namespaced: true,
  state: {
    status: { loggedIn: !!user },
    user: user,
  },
  actions: {
    async login({ commit }, user) {
      try {
        const loggedInUser = await AuthService.login(user);
        commit("loginSuccess", loggedInUser);
        return loggedInUser;
      } catch (error) {
        commit("loginFailure");
        return Promise.reject(error);
      }
    },
    logout({ commit }) {
      AuthService.logout();
      commit("logout");
    },
    async register({ commit }, user) {
      try {
        const response = await AuthService.register(user);
        commit("registerSuccess");
        return response.data;
      } catch (error) {
        commit("registerFailure");
        return Promise.reject(error);
      }
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
  },
};

export default createStore({
  modules: { auth },
});
