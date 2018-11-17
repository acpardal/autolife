<template>
  <div id="app">
    <div class="container">
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
      </ul>
      <div class="center">
        <img src="./assets/logo.png"> 
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
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
</style>
