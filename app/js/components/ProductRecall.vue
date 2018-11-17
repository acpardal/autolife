<template>
  <div>
      <div id="queryBalance">
        <label>Mercedes Wallet Address <span>{{oemAddress}}</span></label>

        <h1>List of created Vehicles</h1>
        <button type="submit" class="btn btn-primary" @click="getListOfVehicles()">Refresh</button>
        <ul class="list-group">
          <li class="list-group-item" v-for="vehicle in listOfVehicles" :key="vehicle.addr">
            <p>
              <label>Vehicle Address <span>{{vehicle.addr}}</span></label>
            </p>
            <p>
              <label>Vehicle Owner <span>{{vehicle.vehicleOwner}}</span></label>
            </p>
            <p>
              <label>Recall <span>{{vehicle.recall}}</span></label>
            </p>
            <button type="submit" class="btn btn-primary" @click="toggleRecall(vehicle)">Change Vehicle Recall</button>
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
    toggleRecall(vehicle) {
      let {oemAddress, vehicleBuyerAddress, inputVIN, inputColor, inputNumWheels} = this;
      let vehicleContract = Vehicle.clone();
      vehicleContract.options.address = vehicle.addr;
      vehicleContract.methods.toggleRecall()
      .send({from: ''+oemAddress, gas:5000000})
      .on('receipt', async (receipt) => {
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
