<template>

  <div class="hello">
    <div class="container">
      <h3>Welcome to Embark!</h3>
      <div id="queryBalance">
        <label>Mercedes Wallet Address <span>{{oemAddress}}</span></label>
        <label>Vehicle buyer Wallet Address <span>{{vehicleBuyerAddress}}</span></label>

        <form>
          <div class="form-group">
            <label for="inputVIN">Create Vehicle with VIN</label>
            <input type="number" class="form-control" id="inputVIN" placeholder="enter VIN: e.g 123" v-model="inputVIN">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>
          <button type="submit" class="btn btn-primary" @click.prevent.stop="createVehicle(inputVIN)">Create Vehicle</button>
        </form>

        <div class="result">{{result}}</div>
        <label>Owner Wallet Address <span>{{vehicleAddress}}</span></label>
      </div>
    </div>
  </div>
</template>

<script>

import VehicleFactory from 'Embark/contracts/VehicleFactory';
import Vehicle from 'Embark/contracts/Vehicle';

export default {
  name: 'HelloWorld',
  data () {
    return {
      oemAddress: undefined,
      vehicleBuyerAddress: undefined,
      inputVIN: undefined,
      vehicleAddress: undefined
    }
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
    createVehicle(newVIN) {
      let {oemAddress, vehicleBuyerAddress} = this;
      VehicleFactory.methods.createVehicle(newVIN, [1,2], 'black', vehicleBuyerAddress)
      .send({from: ''+oemAddress, gas:5000000})
      .on('receipt', (receipt) => {

          VehicleFactory.methods._ownersToVehicles(vehicleBuyerAddress).call().then(vehicleAddress =>{
            this.vehicleAddress = vehicleAddress;
            
            Vehicle.options.address = vehicleAddress;
            Vehicle.methods._VIN().call().then((value) => {
              this.inputVIN = value;
            })
          })
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
