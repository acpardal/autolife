<template>
  <div>
      <div id="queryBalance">
        <label>Mercedes Wallet Address <span>{{oemAddress}}</span></label>

        <form>
          <div class="form-group">
            <label for="inputVIN">Create Vehicle with VIN</label>
            <input type="number" class="form-control" id="inputVIN" placeholder="enter VIN: e.g 123" v-model="inputVIN">
          </div>
          <div class="form-group">
            <label for="inputColor">Color</label>
            <input type="text" class="form-control" id="inputColor" placeholder="enter string color" v-model="inputColor">
          </div>
          <div class="form-group">
            <label for="inputNumWheels">Number of Wheels</label>
            <input type="number" class="form-control" id="inputColor" placeholder="enter how much wheels" v-model="inputNumWheels">
          </div>
          <button type="submit" class="btn btn-primary center" @click.prevent.stop="createVehicle()">Create Vehicle</button>
        </form>

        <h1>Results</h1>
        <ul class="list-group">
          <li class="list-group-item">
            <label>Vehicle Address <span>{{vehicleAddress}}</span></label>
          </li>
          <li class="list-group-item">
            <label>VIN <span>{{VIN}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Color <span>{{color}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Number of Wheels <span>{{numWheels}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Parts <span>{{vehicleParts}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Owner wallet address <span>{{vehicleOwner}}</span></label>
          </li>
        </ul>
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
            <button v-if="vehicle.vehicleOwner === oemAddress" type="submit" class="btn btn-primary center" @click.prevent.stop="changeOwner(vehicle.addr, vehicleBuyerAddress)">Change Owners of this Vehicle</button>
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
