import Vue from 'vue'
import Router from 'vue-router'
import CreateVehicle from '../components/CreateVehicle.vue'
import TradeVehicle from '../components/TradeVehicle.vue'

Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'CreateVehicle',
      component: CreateVehicle
    },
    {
      path: '/trade',
      name: 'TradeVehicle',
      component: TradeVehicle
    }
  ]
})
