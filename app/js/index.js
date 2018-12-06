import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import Notifications from 'vue-notification'
import Vuetify from 'vuetify'
// import 'vuetify/src/stylus/app.styl'

// Helpers
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md'
})

Vue.use(Notifications)

EmbarkJS.Storage.setProvider("ipfs", {
  protocol: 'https',
  host: "ipfs.infura.io",
  port: 5001,
  getUrl: "https://ipfs.infura.io/ipfs/"
});

/* eslint-disable no-new */
const app = new Vue({
  el: '#container',
  router,
  store,
  render: function (h) {
    return h(App);
   }
})
