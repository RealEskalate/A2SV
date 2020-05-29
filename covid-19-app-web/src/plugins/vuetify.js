import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#039Be5",
        secondary: "#9e9e9e",
        accent: "#90a4ae",
        success: "#66bb6a",
        error: "#e57373"
      }
    }
  },
  icons: {
    iconfont: "mdiSvg"
  }
});
