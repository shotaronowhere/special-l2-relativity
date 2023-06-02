# special-l2-relativity

<img width="666" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/1f974d5c-a905-4017-a7e0-3761250fb37e">


L1 timestamp were set by miners in proof-of-work, with limitations on time deviations. In proof-of-stake, validators are assumed synchronized in time and blocks are produced like clockwork in 12 second slots on Ethereum, or 5 second slots on Gnosis.
L2 timestamps on the other hand are usually set by the sequencer within some boundary of the L1 timestamp when a batch of L2 txns is posted to L1. For example, on Optimism, this boundary is defined by max_sequencer_drift and on Arbitrum, the time boundary is defined by maxTimeVariation. Optimism recommends deployment configurations with the max_sequencer_drift set to 10 minutes. Arbitrum, on the other hand, sets its maxTimeVariation at 24 hours behind L1 or 4 hours ahead. This means the sequencer can set the L2 timestamp within this boundary, though the L2 timestamp is guaranteed to be monotonically increasing.

## Run

```
yarn timewarp
```

## Config Environment Variables

Set the values shown in `.env.dist` as environmental variables. To copy it into a `.env` file:

```bash
cp .env.dist .env
```

(you'll still need to edit some variables, i.e., `L2_RPC`)


## Results

<img width="664" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/1c75746e-a5d6-4c97-ac30-3b6a2f0e6e85">

<img width="650" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/09ef5a43-258a-44b9-bfbc-688d82e7ad7b">

## Anomalies

<img width="588" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/40463289-4b46-4dd2-aab5-ce6b9f4ec528">

<img width="663" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/e5400947-6883-4f25-a261-8e1bc7830c61">

