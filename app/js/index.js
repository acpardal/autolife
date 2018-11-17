import EmbarkJS from 'Embark/EmbarkJS';

// import your contracts
// e.g if you have a contract named SimpleStorage:
//import SimpleStorage from 'Embark/contracts/SimpleStorage';

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

/* eslint-disable no-new */
const app = new Vue({
  el: '#container',
  router,
  store,
  render: function (h) {
    return h(App);
   }
})
