import VehicleFactory from 'Embark/contracts/VehicleFactory';
import Vehicle from 'Embark/contracts/Vehicle';
let myMixin = {
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
      return vehicle;
    },
  }
}

export default myMixin;