import VehicleFactory from 'Embark/contracts/VehicleFactory';
import Vehicle from 'Embark/contracts/Vehicle';
let myMixin = {
  data() {
    return {
      listOfVehicles: []
    }
  },
  methods: {
    async getListOfVehicles() {
      let vehiclesAddr = await VehicleFactory.methods.getVehicles().call();
      if(vehiclesAddr) {
        let list = [];
        vehiclesAddr.forEach(async addr => {
          let vehicle = await this.getVehicle(addr);
          list.push(Object.assign({ addr: addr }, vehicle));
        });
        this.listOfVehicles = list;
      }
    },
    async getVehicle(addr) {
      let VehicleContract = Vehicle.clone();
      VehicleContract.options.address = addr;
      let vehicle = {};
      vehicle.VIN = await VehicleContract.methods._VIN().call();
      vehicle.color = await VehicleContract.methods._color().call();
      vehicle.vehicleOwner = await VehicleContract.methods._owner().call();
      vehicle.numWheels = await VehicleContract.methods._numWheels().call();
      vehicle.vehicleParts = await VehicleContract.methods.getParts().call();
      vehicle.recall = await VehicleContract.methods._recall().call();
      let length = Number(await VehicleContract.methods._servicePointerLength().call());
      let services = [];
      for(let i=0; i<length; i++) {
        let service = await VehicleContract.methods._servicePointer(i).call();
        services.push(service);
      }
      vehicle.vehicleServices = services;
      return vehicle;
    },
  }
}

export default myMixin;

let accounts = {
  data() {
    return {
      accounts: []
    }
  },
  created() {
    EmbarkJS.onReady((error) => {
      if (error) {
        console.error('Error while connecting to web3', error);
        return;
      }
      web3.eth.getAccounts((err, accounts) => {
        this.accounts = [{
          name: 'Mercedes',
          publicKey: accounts[0]
        },
        {
          name: 'André Pardal',
          publicKey: accounts[1]
        },
        {
          name: 'Sebastião Barata',
          publicKey: accounts[2]
        }]
      });
    });
  },
  methods: {
    getAccount(account) {
      let result = {}
      if(account && account.name) {
        return this.accounts.find(acc => acc.name == account.name) || {}
      }
      if(account && account.publicKey) {
        return this.accounts.find(acc => acc.publicKey == account.publicKey) || {}
      }
      return result;
    }
  }
}

export {
  accounts
}