import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    vehicleOwner: undefined,
    vehicleAddress: undefined,
    perspective: undefined,
  },
  mutations: {
    // increment (state) {
    //   state.count++
    // }
    setVehicleOwner(state, address) {
      state.vehicleOwner = address;
    },
    setVehicleAddress(state, address) {
      state.vehicleAddress = address;
    },
    setPerspective (state, perspective){
      state.perspective = perspective;
    } 
  },
  getters: {
    // doneTodos: state => {
    //   return state.todos.filter(todo => todo.done)
    // }
  }
})