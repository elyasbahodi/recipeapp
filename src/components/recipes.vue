<template>
  <body>
    <div class="container" v-if="loggedIn">
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Create new Recipe
      </button>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createNewRecipe">
                <div class="form-group">
                  <label for="lblRecipeName">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lblRecipeName"
                    placeholder="Pizza"
                    v-model="recipeName"
                  />
                </div>

                <div class="form-group">
                  <label for="csRecipeDifficulty">Difficulty Selection</label>
                  <select
                    class="form-control"
                    id="csRecipeDifficulty"
                    v-model="difficulty"
                  >
                    <option>Beginner</option>
                    <option>Easy</option>
                    <option>Intermediate</option>
                    <option>Hard</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="lblDescription">Description</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lblDescription"
                    placeholder="Spicy, fried, sticky, japanese, soft"
                    v-model="description"
                  />
                </div>
                <div class="form-group">
                  <label for="taIngredients">Ingredients</label>
                  <textarea
                    class="form-control"
                    id="lblIngredients"
                    rows="6"
                    v-model="ingredients"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label for="lblDuration">Cooking duration in minutes</label>
                  <input
                    type="number"
                    class="form-control"
                    id="lblDuration"
                    placeholder="75"
                    v-model="duration"
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createNewRecipe()"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col" v-for="recipe in recipes" :key="recipe.id">
          <div class="card" style="width: 18rem">
            <img v-bind:src="recipes.thumbnail_url" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ recipe.name }}</h5>
              <p class="card-text">
                {{ recipe.description }}
              </p>
              <a href="#" class="btn btn-primary">Details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      {{ $router.push('login') }}
    </div>
  </body>
</template>

<script>
import { uuid } from "vue-uuid";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
//import { collection, getDocs } from 'firebase/compat/firestore';
import "firebase/compat/database";
import "firebase/compat/storage";
//import { mapGetters } from "vuex";


export default {
  data() {
    return {
      recipes: [],
      error: null,
      showCreateNewRecipeModal: false,
      recipeName: null,
      difficulty: null,
      description: null,
      ingredients: null,
      duration: null,
      loggedIn: this.$store.getters.user.loggedIn
    };
  },
  mounted: function () {
    this.getRecipes();
  },
  methods: {
    async getRecipes() {
      const fetch = require("node-fetch");

      const url = "https://tasty.p.rapidapi.com/recipes/list?from=0&size=30";

      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "22ca00ebc6msh4b543c8ab4e1959p1bccc6jsnf2984e54d27b",
          "X-RapidAPI-Host": "tasty.p.rapidapi.com",
        },
      };

      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);

          this.recipes = json.results;
          this.showCreateNewRecipeModal = true;

        const db = firebase.firestore();
            db.collection("recipes")
            .get()
            .then((QuerySnapshot) => {
                QuerySnapshot.forEach((doc) => {
                    this.recipes.push(doc.data());
                    //console.log(this.recipes)
                    console.log(doc.data());
                    console.log(this.recipes.length);
                    //console.log(JSON.parse(doc.data()));
            });
        });

        })
        .catch((err) => console.error("error:" + err));



      /* db.collection('recipes').get().onSnapshot(doc => {
            this.recipes.push(doc.data())
            console.log(this.recipes);
        })*/

      /*console.log(QuerySnapshot);
      QuerySnapshot.forEach((doc) => {
      })*/

      /*const querySnapshot = await getDocs(collection(db, "recipes"));
        querySnapshot.forEach((doc) => {
        this.recipes.push(doc.data());
        console.log(this.recipes);
        });*/
    },
    createNewRecipe() {
      const db = firebase.firestore();
      const id = uuid.v4();
      db.collection("recipes").add({
        id: id,
        name: this.recipeName,
        difficulty: this.difficulty,
        description: this.description,
        ingredients: this.ingredients,
        duration: this.duration,
      });

      //db.collection("recipes").doc(this.uuid.v4()).set(data);
    },
    async created() {
      // GET request using fetch with async/await
      const db = await firebase.firestore();
      db.collection("recipes")
        .get()
        .then((QuerySnapshot) => {
          QuerySnapshot.forEach((doc) => {
            this.recipes.push(doc.data());
            //console.log(this.recipes)
            console.log(doc.data());
            console.log(this.recipes.length);
            //console.log(JSON.parse(doc.data()));
          });
        });
    },
  },
};
</script>

<style>
</style>