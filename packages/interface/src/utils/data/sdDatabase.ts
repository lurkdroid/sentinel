const _addresses = require('./solidroid-address.json');


export declare interface DbToken {
    id:number;
    name: string;
    symbol: string;
    address: string;
    img_32: string;
    icon: string;
    isQuote: boolean;
    decimals: number
}

export function managerAddress(network:string):string{
    return _addresses[network].manager.address;
}

export function getDBToken(network:string,address:string):string{
    return _addresses[network].manager.address;
}

export function getDBTokens(network:string):Array<DbToken>{
    return _addresses[network].tokens;
}

