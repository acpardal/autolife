<template>
  <div>
      <h3>Welcome to Embark!</h3>
      <div id="queryBalance">
        <label>Mercedes Wallet Address <span>{{oemAddress}}</span></label>
        <!-- <label>Vehicle buyer Wallet Address <span>{{vehicleBuyerAddress}}</span></label> -->

        <form>
          <div class="form-group">
            <label for="inputVIN">Create Vehicle with VIN</label>
            <input type="number" class="form-control" id="inputVIN" placeholder="enter VIN: e.g 123" v-model="inputVIN">
          </div>
          <button type="submit" class="btn btn-primary" @click.prevent.stop="createVehicle()">Create Vehicle</button>
        </form>

        <h1>List of created Vehicles</h1>
        <button type="submit" class="btn btn-primary" @click.prevent.stop="getListOfVehicles()">Refresh</button>
        <ul class="list-group">
          <li class="list-group-item" v-for="vehicle in listOfVehicles" :key="vehicle.addr">
            <p>
              <label>Vehicle Address <span>{{vehicle.addr}}</span></label>
            </p>
            <p>
              <label>Vehicle Owner <span>{{vehicle.vehicleOwner}}</span></label>
            </p>
            <button v-if="vehicle.vehicleOwner === oemAddress" type="submit" class="btn btn-primary" @click.prevent.stop="changeOwner(vehicle)">Change Owners of this Vehicle</button>
          </li>
        </ul>
      </div>
  </div>
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
      'setVehicleAddress'
    ]),
    toogleRecall() {
      let {oemAddress, vehicleBuyerAddress, inputVIN, inputColor, inputNumWheels} = this;
      let vehicleContract = Vehicle.clone();
      vehicleContract.options.address = this.vehicleAddress;
      Vehicle.methods.toggle(inputVIN, [1,2], inputColor, inputNumWheels, oemAddress)
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
