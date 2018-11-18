import Vue from 'vue'
import Router from 'vue-router'
import CreateVehicle from '../components/CreateVehicle.vue'
import TradeVehicle from '../components/TradeVehicle.vue'
import ProductRecall from '../components/ProductRecall.vue'
import RegisterService from '../components/RegisterService.vue'
import UserDashboard from '../components/UserDashboard.vue'

Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'CreateVehicle',
      component: CreateVehicle,
      props: true
    },
    {
      path: '/trade',
      name: 'TradeVehicle',
      component: TradeVehicle,
      props: true
    },
    {
      path: '/recall',
      name: 'ProductRecall',
      component: ProductRecall,
      props: true
    },
    {
      path: '/register',
      name: 'RegisterService',
      component: RegisterService,
      props: true
    },
    {
      path: '/user',
      name: 'UserDashboard',
      component: UserDashboard,
      props: true
    }
  ]
})