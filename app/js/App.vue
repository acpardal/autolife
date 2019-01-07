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
    <v-toolbar app fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <img class="image" src="./assets/logo.png">
      </v-toolbar-title>
      <v-spacer/>
      <v-toolbar-side-icon @click.stop="drawerRight = !drawerRight"></v-toolbar-side-icon>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawerRight"
      right
      clipped
      app
    >
      <v-list dense>
        <v-list-tile
          v-for="account in accounts" 
          :key="account.publicKey"
          @click="copyToClipboard(account)"
        >
          <v-list-tile-action>
            <v-icon color="info">account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{account.name}}</v-list-tile-title>
            <v-list-tile-sub-title>{{ account.publicKey }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
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
import { accounts } from './mixins';

export default {
  mixins: [accounts],
  name: 'App',
  data() {
    return {
      accounts: [],
      drawer: null,
      drawerRight: null,
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
    },
    copyToClipboard(account) {
      navigator.clipboard.writeText(account.publicKey)
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
