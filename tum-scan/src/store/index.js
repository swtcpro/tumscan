import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import forum from "./modules/forum";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    forum,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
