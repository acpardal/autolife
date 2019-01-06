pragma solidity 0.4.24;
import "./Vehicle.sol";

contract owned {
    constructor() public { owner = msg.sender; }
    address owner;

    modifier onlyOwner() { // Modifier
        require(
            msg.sender == owner,
            "Only owner can call this."
        );
        _;
    }
}

contract VehicleFactory is owned {

    event CreateVehicle(address indexed to, address vehicle);
    event Transfer(address indexed from, address indexed to, address vehicle);

    address[] public _vehicles = new address[](0);

    function createVehicle(uint VIN, uint[] vehicleParts, string color, string numWheels, address to) public onlyOwner returns (address vehicle) {
        address vehicleAdd = new Vehicle(VIN, vehicleParts, color, numWheels, to);
        _vehicles.push(vehicleAdd);
        emit CreateVehicle(to, vehicleAdd);
        return vehicleAdd;
    }

    function getVehicles() public view returns (address[]) { 
        return _vehicles;
    }
}