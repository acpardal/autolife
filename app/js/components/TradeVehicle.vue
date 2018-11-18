<template>

  <div class="hello">
    <div class="container">
      <h3 class="center">OEM View</h3>
      <div>
        <ul class="list-group">
          <li class="list-group-item">
            <label>Mercedes Wallet Address <span>{{userAddress}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Original Vehicle Owner Address <span>{{vehicleOwnerBK}}</span></label>
          </li>
          <li class="list-group-item">
            <label for="buyerAddress">Vehicle buyer Wallet Address</label>
            <input type="text" class="form-control" id="buyerAddress" v-model="buyerAddress">
          </li>
          <li class="list-group-item">
            <label>Vehicle Address <span>{{vehicleAddress}}</span></label>
          </li>
        </ul>

        <button type="submit" class="btn btn-primary center" @click.prevent.stop="changeToOwner(buyerAddress)">Change Owners</button>

        <h1>Results</h1>
        <ul v-if="VIN" class="list-group">
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
      userAddress: undefined,
      buyerAddress: undefined,
      VIN: undefined,
      vehicleAddress: undefined,
      color: undefined,
      vehicleParts: undefined,
      vehicleOwnerBK: undefined
    }
  },
  computed: {
    ...mapState([
      'vehicleOwner',
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
        // this.oemAddress = accounts[0];
        this.buyerAddress = accounts[1];
      });
    });
  },
  beforeRouteEnter (to, from, next) {
    let {userAddress, vehicleToChange} = to.params;
    next(vm => {
      vm.userAddress = userAddress;
      vm.vehicleAddress = vehicleToChange.addr;
    });
  },
  methods: {
    ...mapMutations([
      'setVehicleOwner',
    ]),
    changeToOwner(buyerAddress) {
      let {userAddress, vehicleAddress} = this;
      Vehicle.options.address = vehicleAddress;
      Vehicle.methods.transfer(buyerAddress)
        .send({from: ''+userAddress, gas:5000000})
        .on('receipt', async (receipt) => {

          let newVehicleOwner = receipt.events.Transfer.returnValues.to;
          this.setVehicleOwner(newVehicleOwner);
          
          let vehicle = await getVehicle(vehicleAddress);
          this.VIN = vehicle.VIN
          this.vehicleAddress = vehicle.vehicleAddress
          this.color = vehicle.color
          this.vehicleParts = vehicle.vehicleParts
          this.vehicleOwnerBK = vehicle.vehicleOwnerBK
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
