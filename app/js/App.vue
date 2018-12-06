<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
      <v-list dense>
        <v-list-tile
          v-for="route in routes" 
          :key="route.name" 
          @click="nav(route.name)"
          :to="{name: route.name}"
          exact
        >
          <v-list-tile-action>
            <v-icon>{{route.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{route.text}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <img class="image" src="./assets/logo.png">
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout>
          <v-flex>

              <notifications group="top" />
              <router-view/>
              
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

import {routes} from './router/index';

export default {
  name: 'App',
  data() {
    return {
      drawer: null,
      routes
    }
  },
  computed: {
    ...mapState([
      'perspective'
    ]),
  },
  methods: {
    nav(name) {
        this.$router.push({name});
    }
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
  height: 20px;
}
* {
  font-weight: bold;
}
</style>
