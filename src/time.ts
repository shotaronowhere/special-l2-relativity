import { providers, BigNumber } from 'ethers'
import * as dotenv from "dotenv";
import { getL2Network } from '@arbitrum/sdk'
import { SequencerInbox__factory } from "@arbitrum/sdk/dist/lib/abi/factories/SequencerInbox__factory"
import { NODE_INTERFACE_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants"
import { NodeInterface__factory } from "@arbitrum/sdk/dist/lib/abi/factories/NodeInterface__factory"
import * as csv from 'fast-csv';
import * as fs from 'fs';
const csvStream = csv.format({ headers: true });

var writeStream = fs.createWriteStream("outputfile.csv");
csvStream.pipe(writeStream).on('end', () => process.exit());

dotenv.config();

const envVars = ['L1_RPC', 'L2_RPC'];

for (const envVar of envVars) {
  if (!process.env[envVar]) {
    throw new Error(`Error: set your '${envVar}' environmental variable `)
  }
}
console.log('Environmental variables properly set 👍')

  /**
 * Set up: instantiate L1 / L2 wallets connected to providers
 */

  const l2ProviderArbGoerli = new providers.JsonRpcProvider(process.env.L2_RPC)
  const l1ProviderGoerli = new providers.JsonRpcProvider(process.env.L1_RPC)

const main = async () => {
  // just in case using sequencer feed
  // go back 20k blocks to find a likely L1 confirmed block
  const currentL2Blocknumber = await l2ProviderArbGoerli.getBlockNumber()-20000;
  const currentBlock = await l2ProviderArbGoerli.getBlock(currentL2Blocknumber);
  const L2time = currentBlock?.timestamp;
  console.log('Current (20k l2 blocks ago) L2 Block Timestamp: ', L2time);
  const l2Network = await getL2Network(l2ProviderArbGoerli)
  const nodeInterface = NodeInterface__factory.connect( NODE_INTERFACE_ADDRESS, l2ProviderArbGoerli)
  const sequencer = SequencerInbox__factory.connect(l2Network.ethBridge.sequencerInbox, l1ProviderGoerli)
  for (let block = 55176108; block > 0; block-=100) {
    let currentBlock: providers.Block | undefined = undefined;
    let count_tries = 0;
    while(!currentBlock) {
      try {
        currentBlock = await l2ProviderArbGoerli.getBlock(block)
        } catch(e){
            console.log("get l2 block fail, try again", block, count_tries);
            count_tries++;
            if (count_tries>10) break;
      }
    }
    if (!currentBlock) {
        console.log("get l2 block fail, skip", block);
        continue;
    }
    const L2time = currentBlock?.timestamp;
    // Call the nodeInterface precompile to get the batch number first
    let result: BigNumber | undefined = undefined;
    count_tries = 0;
    while(!result) {
      try {
          result = (await nodeInterface.functions.findBatchContainingBlock(block)).batch
      } catch(e){
            console.log("nodeInterface l2 block fail, try again", block, count_tries);
            count_tries++;
            if (count_tries>10) break;
      }
    }
    if (!result) {
        console.log("Check l2 block fail, skip", block);
        continue;
    }
      /**
        * We use the batch number to query the L1 sequencerInbox's SequencerBatchDelivered event
        * then, we get its emitted transaction hash.
      */
      const queryBatch = sequencer.filters.SequencerBatchDelivered(result!)
      let emittedEvent: any = undefined;
      count_tries = 0;
      while(!emittedEvent) {
        try{
          emittedEvent = await sequencer.queryFilter(queryBatch)
        } catch {
          console.log("sequencer SequencerBatchDelivered fail, try again", result!, count_tries);
          count_tries++;
          if (count_tries>10) break;
        }
      }
      if (!emittedEvent) {
        console.log("Check l2 block fail, skip", block);
        continue;
    }

      // If no event has been emitted, it just returns ""
      if(emittedEvent.length === 0) {
          console.log('no event emitted');
      } else {
        const L2time = currentBlock?.timestamp;
        // Call the nodeInterface precompile to get the batch number first
        let L1time: number | undefined = undefined;
        count_tries = 0;
        while(!L1time) {
          try {
            L1time = (await emittedEvent[0].getBlock()).timestamp;
          } catch(e){
                console.log("nodeInterface l2 block fail, try again", block, count_tries);
                count_tries++;
                if (count_tries>10) break;
          }
        }
        if (!L1time) {
            console.log("Check l2 block fail, skip", block);
            continue;
        }
          const txnhash = emittedEvent[0].transactionHash;
          const timeDiff = L1time-L2time;
          csvStream.write({ L1time: L1time, L2time: L2time, timeDiff: timeDiff, L2block: block, L2gasUsed: currentBlock.gasUsed.toNumber(), L1TxnHash: txnhash });
        }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })