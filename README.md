# AutoLife the X-Ray of your car



## License



GPL (see LICENSE)



## Installation



Install [Git] https://github.com/acpardal/autolife



Install `npm install -g embark`

`npm install`



# on the console 1 run:

```terminal

embark simulator

```



# one the consolre 2 run:

```terminal

embark run

```



This project aims to register all the information about a vehicle during its lifecycle (maintenance, accidents, recalls, etc.).

This information will increase the transparency of the vehicle condition, increasing it second hand value. The information can also be put to other uses, e.g. negotiate better insurance premiums.

All the Vehicles are registered with its VIN (Vehicle Identification Number) and public address in a blockchain. 

With the control of the vehicle owner, third parties will be able to query the blockchain for information about the vehicle, and append events like:

- Maintenance - changed parts, damaged parts, number of kilometres, etc.)

- Insurance – badge for no accidents on that year

- Selling of the car

- Etc.



Technical Details:

Smart Contract VehicleFactory creates Vehicles and assigns them to an Address.

Owner can transfer ownership to someone (in future should be a change of token between owner wallets).


