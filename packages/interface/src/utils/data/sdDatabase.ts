// const _addresses = require('./solidroid-address.json');
import _addresses from '../addresses.json';

export declare interface DbToken {
  id: number;
  name: string;
  symbol: string;
  address: string;
  img_32: string;
  icon: string;
  isQuote: boolean;
  decimals: number;
}

export function managerAddress(network: string): string {
  console.log(
    "manager address retrieved:",
    { network },
    _addresses[network].manager.address
  );
  return _addresses[network].manager.address;
}

export function getTokenByAddress(network: string, address: string): DbToken {
  return _addresses[network].tokens.find(token=>token.address=address);
}

export function getDBTokens(network: string): Array<DbToken> {
  return _addresses[network].tokens;
}
