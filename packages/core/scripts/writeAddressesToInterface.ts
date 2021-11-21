import fs from 'fs';
import path from 'path';

import { importAll } from '../deployed';

const writeAddresses = async () => {
  const networks = ["kovan", "matic"] as const;
  const addresses: any = {};
  await Promise.all(
    networks.map(async (network) => {
      const networkAddress = await importAll(network);
      addresses[network] = networkAddress;
    })
  );

  const fileToInterface = path.resolve(
    __dirname,
    "../../interface/src/utils/addresses.json"
  );

  fs.writeFileSync(fileToInterface, JSON.stringify(addresses));
};

writeAddresses().catch((e) => {
  console.log("error writing the addresses", e);
});
