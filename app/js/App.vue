<template>
  <div id="app">
    <notifications group="top" />
    <div class="container">
      <div class="center margin">
          <img class="image" src="./assets/logo.png"> 
          <h3 class="center">{{perspective}}</h3>
      </div>
      <ul class="nav nav-pills nav-fill">
        <li class="nav-item">
          <router-link tag="a" class="nav-link" to="/">Create Vehicle</router-link>
        </li>
        <li class="nav-item">
          <router-link tag="a" class="nav-link" to="/trade">Change Owner</router-link>
        </li>
        <li class="nav-item">
          <router-link tag="a" class="nav-link" to="/recall">Product Recall</router-link>
        </li>
        <li class="nav-item">
          <router-link tag="a" class="nav-link" to="/register">Register Service</router-link>
        </li>
        <li class="nav-item">
          <router-link tag="a" class="nav-link" to="/user">User DashBoard</router-link>
        </li>
      </ul>
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState([
      'perspective'
    ]),
  }
}
</script>

<style>
html, body {
  background-color: #e6e6e6
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.center {
  text-align: center;
}
.margin {
  margin: 10px;
}
.image {
  width: 50%;
}
* {
  font-weight: bold;
}
</style>
