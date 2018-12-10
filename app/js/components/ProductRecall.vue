<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h2>Mercedes Wallet Address <span>{{oemAddress}}</span></h2>

      <h2>List of created Vehicles</h2>
      <v-btn color="info" @click="getListOfVehicles()">Refresh</v-btn>
      <v-list dense v-for="vehicle in listOfVehicles" :key="vehicle.addr">
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>Vehicle Address:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicle.addr }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Vehicle Owner:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicle.vehicleOwner }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Recall:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicle.recall }}</v-list-tile-content>
        </v-list-tile>
        <v-list-action>
          <v-btn :disabled="vehicle.vehicleOwner !== oemAddress" color="success" @click="toggleRecall(vehicle)">Change Vehicle Recall</v-btn>
        </v-list-action>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>

import VehicleFactory from 'Embark/contracts/VehicleFactory';
import Vehicle from 'Embark/contracts/Vehicle';

import { mapState, mapGetters, mapMutations } from 'vuex';
import myMixin from '../mixins';

export default {
  mixins: [myMixin],
  name: 'ProductRecall',
  data () {
    return {
      oemAddress: undefined,
      vehicleBuyerAddress: undefined,

      inputVIN: ''+Math.round(Math.random()*200000),
      inputColor: 'red',
      inputNumWheels: ''+Math.round(Math.random()*8),

      VIN: undefined,
      color: undefined,
      numWheels: undefined,
      vehicleParts: undefined,

      listOfVehicles: [],
    }
  },
  computed: {
    ...mapState([
      'vehicleOwner',
      'vehicleAddress'
    ]),
    ...mapGetters([
    ]),
  },
  created() {
    this.setPerspective('OEM View');
    EmbarkJS.onReady((error) => {
      if (error) {
        console.error('Error while connecting to web3', error);
        return;
      }
      web3.eth.getAccounts((err, accounts) => {
        this.oemAddress = accounts[0];
        this.vehicleBuyerAddress = accounts[1];
      });
    });
  },
  methods: {
    ...mapMutations([
      'setVehicleOwner',
      'setVehicleAddress',
      'setPerspective'
    ]),
    toggleRecall(vehicle) {
      let {oemAddress, vehicleBuyerAddress, inputVIN, inputColor, inputNumWheels} = this;
      let vehicleContract = Vehicle.clone();
      vehicleContract.options.address = vehicle.addr;
      vehicleContract.methods.toggleRecall()
      .send({from: ''+oemAddress, gas:5000000})
      .on('receipt', async (receipt) => {
          this.$notify({
            group: 'top',
            title: 'Recall Changed',
            text: ''
          });
          this.getListOfVehicles();
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
