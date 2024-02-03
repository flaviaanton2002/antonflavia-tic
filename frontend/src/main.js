import "./assets/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store.js";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);
app.use(router);
app.use(store);

const vuetify = createVuetify({
  components,
  directives,
});
app.use(vuetify);

app.mount("#app");
