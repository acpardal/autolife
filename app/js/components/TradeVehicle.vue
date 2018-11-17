<template>

  <div class="hello">
    <div class="container">
      <h3>Welcome to Embark!</h3>

      <h1>Change Owner</h1>
      <div>
        <div>
          <label>Mercedes Wallet Address <span>{{oemAddress}}</span></label>
          <label>Original Vehicle Owner Address <span>{{vehicleOwnerBK}}</span></label>
          <label>Vehicle buyer Wallet Address <span>{{vehicleBuyerAddress}}</span></label>
        </div>

        <button type="submit" class="btn btn-primary" @click.prevent.stop="changeToOwner(vehicleBuyerAddress)">Change Owners</button>

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
            <label>Parts <span>{{vehicleParts}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Owner wallet address <span>{{vehicleOwner}}</span></label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import VehicleFactory from 'Embark/contracts/VehicleFactory';
import Vehicle from 'Embark/contracts/Vehicle';
import { mapState, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'TradeVehicle',
  data () {
    return {
      oemAddress: undefined,
      vehicleBuyerAddress: undefined,
      inputVIN: undefined,
      VIN: undefined,
      color: undefined,
      vehicleParts: undefined,
      vehicleOwnerBK: undefined
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
    if(this.vehicleOwner) {
      this.vehicleOwnerBK = this.vehicleOwner;
    }
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
    changeToOwner(buyerAddress) {
      let {oemAddress, vehicleAddress} = this;
      Vehicle.options.address = vehicleAddress;
      Vehicle.methods.transfer(buyerAddress)
        .send({from: ''+oemAddress, gas:5000000})
        .on('receipt', (receipt) => {

          let newVehicleOwner = receipt.events.Transfer.returnValues.to;
          this.setVehicleOwner(newVehicleOwner);
          
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
          Vehicle.methods._vehicleParts().call().then((value) => {
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
