<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h2>User Wallet Address <span>{{userAddress}}</span></h2>

        <v-text-field
          id="inputVehicleAddress"
          label="Vehicle Address"
          v-model="inputVehicleAddress"
        ></v-text-field>

        <v-btn color="success" @click="fetchVehicleData()">Get Vehicle Info</v-btn>
        
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
            <v-list-tile-content>Vehicle Recall:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ vehicleRecall }}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>Owner wallet address:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ vehicleOwner }}</v-list-tile-content>
          </v-list-tile>
        </v-list>

        <h1>Services</h1>
        <v-form>
          <v-text-field
            id="inputPermissionAddress"
            label="Service Provider Address"
            v-model="inputPermissionAddress"
          ></v-text-field>
          <v-btn color="success" @click="grantPermission(inputPermissionAddress)">Grant permission to Address</v-btn>
        </v-form>
        <h1>Services with privileges</h1>
        <v-list dense v-for="service in vehicleServices" :key="service">
          <v-list-tile>
            <v-list-tile-content>IPFS Hash:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ service }}</v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-form>
          <v-text-field
            id="sellToAddress"
            label="Buyer Address"
            v-model="sellToAddress"
          ></v-text-field>
          <v-btn color="success" @click="changeOwner(vehicleAddress, sellToAddress)">Sell Vehicle</v-btn>
        </v-form>
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
  name: 'UserDashboard',
  data () {
    return {
      ipfsTEST: undefined,

      userAddress: undefined,

      inputVehicleAddress: undefined,
      sellToAddress: undefined,
      inputPermissionAddress: undefined,

      VIN: undefined,
      color: undefined,
      numWheels: undefined,
      vehicleParts: undefined,
      vehicleAddress: undefined,
      vehicleOwner: undefined,
      vehicleRecall: undefined,
      vehicleServices: undefined
    }
  },
  computed: {
    ...mapState([
    ]),
    ...mapGetters([
    ]),
  },
  created() {
    this.setPerspective('User View');
    EmbarkJS.onReady((error) => {
      if (error) {
        console.error('Error while connecting to web3', error);
        return;
      }
      web3.eth.getAccounts(async (err, accounts) => {
        this.userAddress = accounts[1];
      });
    });
  },
  methods: {
    ...mapMutations([
      'setPerspective'
    ]),
    changeOwner(vehicleAddress, sellToAddress) {
      this.$router.push({ name: 'TradeVehicle', params: { 
          userAddress: this.userAddress, 
          vehicleToChange: vehicleAddress, 
          sellTo: sellToAddress
        }
      });
    },
    async fetchVehicleData(vehicleAddress) {
      let vehicle = await this.getVehicle(vehicleAddress);
      this.vehicleAddress = vehicleAddress;
      this.VIN = vehicle.VIN
      this.color = vehicle.color
      this.numWheels = vehicle.numWheels;
      this.vehicleParts = vehicle.vehicleParts
      this.vehicleOwner = vehicle.vehicleOwner;
      this.vehicleRecall = vehicle.recall;
      this.vehicleServices = await Promise.all(vehicle.vehicleServices.map(async service => {
        let text = await EmbarkJS.Storage.get(service);
        return text;
      }));
    },
    async grantPermission(providerAddress) {
      let {vehicleAddress, userAddress} = this;
      let vehicleContract = Vehicle.clone();
      vehicleContract.options.address = vehicleAddress;
      vehicleContract.methods.addPermissionToService(providerAddress)
      .send({from: ''+userAddress, gas:5000000})
      .on('receipt', async (receipt) => {
          if(receipt.events.PermissionAdded.returnValues.serviceProvider) {
            this.$notify({
              group: 'top',
              title: 'Permission granted',
              text: ''
            });
          }
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
