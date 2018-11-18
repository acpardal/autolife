<template>
  <div>
      <div id="queryBalance">
        <label>Mercedes Wallet Address <span>{{oemAddress}}</span></label>

        <form>
          <div class="form-group">
            <label for="inputVIN">Text to register</label>
            <textarea class="form-control" aria-label="With textarea" v-model="inputTextArea"></textarea>
          </div>
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
            <button type="submit" class="btn btn-primary center" @click.prevent.stop="registerService(vehicle, inputTextArea)">Register Service</button>
          </li>
        </ul>

        <h1>Results</h1>
        <ul class="list-group">
          <li class="list-group-item">
            <label>Hash Saved on blockchain: <span>{{serviceHash}}</span></label>
          </li>
          <li class="list-group-item">
            <label>Saved Text on IPFS: <span>{{savedText}}</span></label>
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
  name: 'RegisterService',
  data () {
    return {
      ipfsTEST: undefined,

      oemAddress: undefined,
      vehicleBuyerAddress: undefined,

      inputTextArea: undefined,

      savedText: undefined,
      serviceHash: undefined,

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
    async testIPFS() {
      let hash = await EmbarkJS.Storage.saveText("hello world");
      let text = await EmbarkJS.Storage.get(hash);
      this.ipfsTEST = text;
    },
    async registerService(vehicle, text) {
      let hash = await EmbarkJS.Storage.saveText(text);
      let {oemAddress} = this;
      let vehicleContract = Vehicle.clone();
      vehicleContract.options.address = vehicle.addr;
      vehicleContract.methods.addService(hash)
      .send({from: ''+oemAddress, gas:5000000})
      .on('receipt', async (receipt) => {
        let serviceHash = receipt.events.AddService.returnValues.hash;
        let text = await EmbarkJS.Storage.get(serviceHash);
        this.serviceHash = serviceHash;
        this.savedText = text;

        this.$notify({
          group: 'top',
          title: 'Service Registered',
          text: ''
        });
      })
      .catch(err => {
        this.$notify({
          group: 'top',
          title: 'Vehicle Owner needs to give Permission',
          text: ''
        });
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
