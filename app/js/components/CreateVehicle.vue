<template>
  <v-layout row wrap>
    <v-flex xs12>

      <h2>Mercedes Wallet Address <span>{{oemAddress}}</span></h2>
      <v-form>
        <v-text-field
          id="inputVIN"
          label="Create Vehicle with VIN"
          v-model="inputVIN"
        ></v-text-field>
        <v-text-field
          id="inputColor"
          label="Color"
          v-model="inputColor"
        ></v-text-field>
        <v-text-field
          id="inputNumWheels"
          label="Number of Wheels"
          v-model="inputNumWheels"
        ></v-text-field>
        <v-btn color="success" @click="createVehicle()">Create Vehicle</v-btn>
      </v-form>

      <h1>Results</h1>
      <v-list dense>
        <v-list-tile>
          <v-list-tile-content>Vehicle Address:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicleAddress }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>VIN:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ VIN }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Color:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ color }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Number of Wheels:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ numWheels }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Parts:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicleParts }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Owner wallet address:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicleOwner }}</v-list-tile-content>
        </v-list-tile>
      </v-list>

      <h1>List of created Vehicles</h1>
      <v-btn color="info" @click="getListOfVehicles()">Refresh</v-btn>
      <v-list dense v-for="vehicle in listOfVehicles" :key="vehicle.addr">
        <v-list-tile>
          <v-list-tile-content>Vehicle Address:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicle.addr }}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Vehicle Owner:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ vehicle.vehicleOwner }}</v-list-tile-content>
        </v-list-tile>
        <v-btn :disabled="vehicle.vehicleOwner !== oemAddress" color="info" @click="changeOwner(vehicle.addr, vehicleBuyerAddress)">Change Owners of this Vehicle</v-btn>
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
  name: 'CreateVehicle',
  data () {
    return {
      ipfsTEST: undefined,

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
    createVehicle() {
      let {oemAddress, vehicleBuyerAddress, inputVIN, inputColor, inputNumWheels} = this;
      VehicleFactory.methods.createVehicle(inputVIN, [1,2], inputColor, inputNumWheels, oemAddress)
      .send({from: ''+oemAddress, gas:5000000})
      .on('receipt', async (receipt) => {

          let vehicleAddress = receipt.events.CreateVehicle.returnValues.vehicle;
          this.setVehicleAddress(vehicleAddress);
          
          let vehicle = await this.getVehicle(vehicleAddress);
          this.VIN = vehicle.VIN;
          this.color = vehicle.color;
          this.setVehicleOwner(vehicle.vehicleOwner);
          this.numWheels = vehicle.numWheels;
          this.vehicleParts = vehicle.vehicleParts;

          this.$notify({
            group: 'top',
            title: 'Vehicle Created',
            text: ''
          });
          
          this.getListOfVehicles();
      });
    },
    changeOwner(vehicleAddress, sellToAddress) {
      this.$router.push({ name: 'TradeVehicle', params: { userAddress: this.oemAddress, vehicleToChange: vehicleAddress, sellTo: sellToAddress }});
    }
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
