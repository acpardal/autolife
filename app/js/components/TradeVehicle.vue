<template>
  <v-layout row wrap>
    <v-flex xs12>
      
      <h2>Mercedes Wallet Address <span>{{userAddress}}</span></h2>
      <h2>Vehicle Address <span>{{vehicleAddress}}</span></h2>
      <v-text-field
        id="buyerAddress"
        label="Vehicle buyer Wallet Address"
        v-model="buyerAddress"
      ></v-text-field>
      <v-btn color="error" @click="changeToOwner(buyerAddress)()">Change Owners</v-btn>

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
  name: 'TradeVehicle',
  data () {
    return {
      userAddress: undefined,
      buyerAddress: undefined,
      VIN: undefined,
      vehicleAddress: undefined,
      color: undefined,
      vehicleParts: undefined
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
    EmbarkJS.onReady((error) => {
      if (error) {
        console.error('Error while connecting to web3', error);
        return;
      }
    });
  },
  beforeRouteEnter (to, from, next) {
    let {userAddress, vehicleToChange, sellTo} = to.params;
    next(vm => {
      vm.userAddress = userAddress;
      vm.vehicleAddress = vehicleToChange;
      vm.buyerAddress = sellTo;
    });
  },
  methods: {
    ...mapMutations([
      'setVehicleOwner',
      'setPerspective'
    ]),
    changeToOwner(buyerAddress) {
      let {userAddress, vehicleAddress} = this;
      Vehicle.options.address = vehicleAddress;
      Vehicle.methods.transfer(buyerAddress)
        .send({from: ''+userAddress, gas:5000000})
        .on('receipt', async (receipt) => {

          let newVehicleOwner = receipt.events.Transfer.returnValues.to;
          this.setVehicleOwner(newVehicleOwner);
          
          let vehicle = await this.getVehicle(vehicleAddress);
          this.VIN = vehicle.VIN;
          this.vehicleAddress = vehicleAddress;
          this.color = vehicle.color;
          this.vehicleParts = vehicle.vehicleParts;
          this.$notify({
            group: 'top',
            title: 'Owner Changed',
            text: ''
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
