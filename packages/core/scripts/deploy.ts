import { deployManager } from '../deploy/deploy-manager';
import { meta } from '../utils/constants';
import { context } from '../utils/context';


async function main() {

  const network = await context.netwrok();//need to get this way for hradhat/ganache cli issue
  console.log(network)
  await deployManager(meta, network);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
