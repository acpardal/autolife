import Vue from 'vue'
import Router from 'vue-router'
import CreateVehicle from '../components/CreateVehicle.vue'
import TradeVehicle from '../components/TradeVehicle.vue'
import ProductRecall from '../components/ProductRecall.vue'
import RegisterService from '../components/RegisterService.vue'
import UserDashboard from '../components/UserDashboard.vue'

Vue.use(Router)

export let routes = [
  {
    path: '/',
    name: 'CreateVehicle',
    component: CreateVehicle,
    props: true,
    text: 'Create Vehicle',
    icon: 'directions_car'
  },
  {
    path: '/trade',
    name: 'TradeVehicle',
    component: TradeVehicle,
    props: true,
    text: 'Change Owner',
    icon: 'cached'
  },
  {
    path: '/recall',
    name: 'ProductRecall',
    component: ProductRecall,
    props: true,
    text: 'Product Recall',
    icon: 'arrow_back'
  },
  {
    path: '/register',
    name: 'RegisterService',
    component: RegisterService,
    props: true,
    text: 'Register Service',
    icon: 'event_note'
  },
  {
    path: '/user',
    name: 'UserDashboard',
    component: UserDashboard,
    props: true,
    text: 'User DashBoard',
    icon: 'person'
  }
];

export default new Router({
  linkExactActiveClass: 'active',
  routes: routes
})