# ![AutoLife](./app/js/assets/logo.png)

## License

GPL (see LICENSE)

## Installation

Install Git 
run `git clone clone https://github.com/acpardal/autolife`

Install embark with commands:
```console
npm install -g embark
npm install
```

### on the console 1 run:

```console
embark simulator
```
### on the console 2 run:

```console
embark run
```
# Objectives of the project

This project aims to register all the information about a vehicle during its lifecycle (maintenance, accidents, recalls, etc.).

This information will increase the transparency of the vehicle condition, increasing it second hand value. The information can also be put to other uses, e.g. negotiate better insurance premiums.

All the Vehicles are registered with its VIN (Vehicle Identification Number) and public address in a blockchain. 

With the control of the vehicle owner, third parties will be able to query the blockchain for information about the vehicle, and append events like:

- Maintenance - changed parts, damaged parts, number of kilometres, etc.)

- Insurance – badge for no accidents on that year

- Selling of the car

- Etc.



# Technical Details:

Smart Contract VehicleFactory creates Vehicles and assigns them to an Address.

Owner can transfer ownership to someone (in future should be a change of token between owner wallets).

OEM Address: 0xf7e72ECF2D28edD42478EbeEEF10950F3f9acF9C

First Buyer: 0xE3941192de7eD3a8B928FEFDe5cC1e0d42010773

Second Buyer: 0xE3941192de7eD3a8B928FEFDe5cC1e0d42010773
