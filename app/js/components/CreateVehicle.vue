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
          <div class="form-group">
            <label for="inputColor">Color</label>
            <input type="text" class="form-control" id="inputColor" placeholder="enter string color" v-model="inputColor">
          </div>
          <div class="form-group">
            <label for="inputNumWheels">Number of Wheels</label>
            <input type="number" class="form-control" id="inputColor" placeholder="enter how much wheels" v-model="inputNumWheels">
          </div>
          <button type="submit" class="btn btn-primary" @click.prevent.stop="createVehicle()">Create Vehicle</button>
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
      </div>
  </div>
</template>

<script>

import VehicleFactory from 'Embark/contracts/VehicleFactory';
import Vehicle from 'Embark/contracts/Vehicle';

import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'CreateVehicle',
  data () {
    return {
      oemAddress: undefined,
      vehicleBuyerAddress: undefined,

      inputVIN: undefined,
      inputColor: undefined,
      inputNumWheels: undefined,

      VIN: undefined,
      color: undefined,
      numWheels: undefined,
      vehicleParts: undefined,
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
    createVehicle() {
      let {oemAddress, vehicleBuyerAddress, inputVIN, inputColor, inputNumWheels} = this;
      VehicleFactory.methods.createVehicle(inputVIN, [1,2], inputColor, inputNumWheels, oemAddress)
      .send({from: ''+oemAddress, gas:5000000})
      .on('receipt', (receipt) => {

          let vehicleAddress = receipt.events.CreateVehicle.returnValues.vehicle;
          this.setVehicleAddress(vehicleAddress);
          
          Vehicle.options.address = vehicleAddress;
          Vehicle.methods._VIN().call().then((value) => {
            this.VIN = value;
          });
          Vehicle.methods._color().call().then((value) => {
            this.color = value;
          });
          Vehicle.methods._owner().call().then((value) => {
            this.setVehicleOwner(value);
          });
          Vehicle.methods._numWheels().call().then((value) => {
            this.numWheels = value;
          });
          Vehicle.methods.getParts().call().then((value) => {
            this.vehicleParts = value;
          });
      });
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
