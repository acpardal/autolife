pragma solidity ^0.4.23;
contract Vehicle {
    uint public _VIN;
    uint[] public _vehicleParts;
    string public _color;
    string public _numWheels;
    address public _owner;

    event Transfer(address indexed from, address indexed to);

    constructor (uint VIN, uint[] vehicleParts, string color, string numWheels, address owner) public {
        _VIN = VIN;
        _vehicleParts = vehicleParts;
        _color = color;
        _numWheels = numWheels;
        _owner = owner;
    }

    function transfer(address to) public returns (bool ok) {
        require(to != address(0), "to already has a vehicle");
        require(msg.sender == _owner, "You don't own the vehicle");
        _owner = to;
        emit Transfer(msg.sender, to);
        return true;
    }

    function getParts() public view returns (uint[]) { 
        return _vehicleParts;
    }
}