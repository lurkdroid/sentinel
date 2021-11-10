const _addresses = require('./solidroid-address.json');


export function managerAddress(network:string):string{
    return _addresses[network].manager.address;
}