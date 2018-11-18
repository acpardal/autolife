<template>
  <div>
      <!-- <h3 class="center">User View</h3> -->
      <div id="container">
        <label>User Wallet Address <span>{{userAddress}}</span></label>
        <form>
          <div class="form-group">
            <label for="inputVehicleAddress">Vehicle Address</label>
            <input type="text" class="form-control" id="inputVehicleAddress" v-model="inputVehicleAddress">
          </div>
          <button type="submit" class="btn btn-primary center" @click.prevent.stop="fetchVehicleData(inputVehicleAddress)">Get Vehicle Info</button>
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
            <label>Vehicle Recall <span>{{vehicleRecall}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Owner wallet address <span>{{vehicleOwner}}</span></label>
          </li>
        </ul>

        <h1>Services</h1>
        <form>
          <div class="form-group">
            <label for="inputPermissionAddress">Service Provider Address</label>
            <input type="text" class="form-control" id="inputPermissionAddress" v-model="inputPermissionAddress">
          </div>
          <button type="submit" class="btn btn-primary center" @click.prevent.stop="grantPermission(inputPermissionAddress)">Grant permission to Address</button>
        </form>
        <ul class="list-group">
          <li class="list-group-item">
            <label>Vehicle Services <span>{{vehicleServices}}</span></label>
          </li>
        </ul>
        <div class="form-group">
          <label for="sellToAddress">Buyer Address</label>
          <input type="text" class="form-control" id="sellToAddress" v-model="sellToAddress">
        </div>
        <button type="submit" class="btn btn-primary center" @click.prevent.stop="changeOwner(vehicleAddress, sellToAddress)">Sell Vehicle</button>
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
