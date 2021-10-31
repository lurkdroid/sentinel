import { supportedNetworks } from "./constants";

export async function getExistingContracts(network: string): Promise<any> {
    if (!supportedNetworks.includes(network)) {
        throw Error('network not supported')
    }
    const droidWakerAbi = await import(`../deployed/${network}/DroidWaker.json`);
    const managerAbi = await import(`../deployed/${network}/SoliDroidManager.json`);
    const libraryAddresses = await import(`../deployed/${network}/libraryAddresses.json`);
    if (!droidWakerAbi) {
        throw Error('no droid waker abi')
    }
    if (!managerAbi) {
        throw Error('no manager waker abi')
    }
    if (!libraryAddresses) {
        throw Error('no library Addresses abi')
    }
    return {
        droidWakerAbi,
        managerAbi,
        libraries: {
            libraryAddresses
        }
    }
}