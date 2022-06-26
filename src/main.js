import Vue from "vue";
import App from "./App.vue";
import router from "./routes/index";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/database";
import "firebase/compat/storage";
import store from "./store";

Vue.config.productionTip = false;

const configOptions = {
  apiKey: "AIzaSyBmHqCrXcYxNdt8BJCHHtwhEUDnXsiz0Kc",
  authDomain: "recipe-app-b76cd.firebaseapp.com",
  projectId: "recipe-app-b76cd",
  storageBucket: "recipe-app-b76cd.appspot.com",
  messagingSenderId: "188861888084",
  appId: "1:188861888084:web:d05b9deef2c68d9c005fc1"
};

const app = firebase.initializeApp(configOptions);
export const db = app.firestore()

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  firebase,
  render: h => h(App)
}).$mount("#app");
