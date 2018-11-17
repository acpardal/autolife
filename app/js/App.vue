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
      </ul>
      <img src="./assets/logo.png">
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
