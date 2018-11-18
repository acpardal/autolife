pragma solidity ^0.4.23;
contract Vehicle {
    uint public _VIN;
    uint[] public _vehicleParts;
    string public _color;
    string public _numWheels;
    address public _owner;
    bool public _recall = false;
    address public _oemAddress;
    mapping(address => bool) public _serviceProvidersMap;

    mapping(uint => string) public _servicePointer;
    uint public _servicePointerLength = 0;

    event Transfer(address indexed from, address indexed to);
    event ToggleRecall(bool actual);
    event AddService(string hash);
    event PermissionAdded(address serviceProvider);

    modifier onlyOEM() {
        require(
            msg.sender == _oemAddress,
            "Only owner can call this."
        );
        _;
    }

    constructor (uint VIN, uint[] vehicleParts, string color, string numWheels, address owner) public {
        _VIN = VIN;
        _vehicleParts = vehicleParts;
        _color = color;
        _numWheels = numWheels;
        _owner = owner;
        _oemAddress = tx.origin;
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

    function toggleRecall() public onlyOEM {
        _recall = !_recall;
        emit ToggleRecall(_recall);
    }

    /* IPFS HASH */
    function addService(string hash) public {
        require(_serviceProvidersMap[msg.sender] == true, "You don't have permission");
        _servicePointer[_servicePointerLength] = hash;
        _servicePointerLength += 1;
        emit AddService(hash);
    }

    function addPermissionToService(address serviceProvider) public {
        _serviceProvidersMap[serviceProvider] = true;
        emit PermissionAdded(serviceProvider);
    }

    function revokePermissionToService(address serviceProvider) public {
        _serviceProvidersMap[serviceProvider] = false;
    }
}