<template>
  <v-layout row wrap>
    <v-flex xs12>
      <h2>Mercedes Wallet Address <span>{{oemAddress}}</span></h2>

      <v-textarea
        id="inputTextArea"
        label="Text to register"
        v-model="inputTextArea"
      ></v-textarea>

      <h2>List of created Vehicles</h2>
      <v-btn color="info" @click="getListOfVehicles()">Refresh</v-btn>
      <v-list dense v-for="vehicle in listOfVehicles" :key="vehicle.addr">
        <v-divider></v-divider>
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Vehicle Address:</v-list-tile-title>
            <v-list-tile-sub-title>{{ vehicle.addr }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-content>
            <v-list-tile-title>Vehicle Owner:</v-list-tile-title>
            <v-list-tile-sub-title>{{ vehicle.vehicleOwner }}</v-list-tile-sub-title>
            <v-list-tile-sub-title>{{ getAccount({publicKey: vehicle.vehicleOwner}).name }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-btn color="success" @click="registerService(vehicle, inputTextArea)">Register Service</v-btn>
      </v-list>

      <h2>Result</h2>
      <v-list dense>
        <v-list-tile>
          <v-list-tile-content>Hash Saved on blockchain:</v-list-tile-content>
          <v-list-tile-content class="align-end">
            <a :href="'https://ipfs.infura.io/ipfs/'+serviceHash" target="_blank">
              {{ serviceHash }}
            </a>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-content>Saved Text on IPFS:</v-list-tile-content>
          <v-list-tile-content class="align-end">{{ savedText }}</v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-dialog
        v-model="loader"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            Please stand by
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>

import VehicleFactory from 'Embark/contracts/VehicleFactory';
import Vehicle from 'Embark/contracts/Vehicle';

import { mapState, mapGetters, mapMutations } from 'vuex';
import myMixin from '../mixins';
import { accounts } from '../mixins';

export default {
  mixins: [myMixin, accounts],
  name: 'RegisterService',
  data () {
    return {
      loader: false,
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
      this.loader = true;
      try {
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

          this.loader = false;
          this.$notify({
            group: 'top',
            title: 'Service Registered',
            text: ''
          });
        })
        .catch(err => {
          this.loader = false;
          this.$notify({
            group: 'top',
            title: 'Vehicle Owner needs to give Permission',
            text: ''
          });
        });
      } catch(err) {
        this.loader = false;
        this.$notify({
          group: 'top',
          title: 'Error occurred',
          text: ''
        });
      }
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
