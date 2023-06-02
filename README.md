# special-l2-relativity

<img width="664" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/d82187c6-68f7-4ac6-8fe9-24d491b64d29">

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

<img width="665" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/abdab0fa-0010-42b6-b9a7-64fbb29d7f2f">

<img width="654" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/bc196af5-867f-477d-978e-57d93ca1a205">

## Anomalies

<img width="590" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/096bf2d8-8207-4291-bc2c-42083342b2db">
<img width="955" alt="image" src="https://github.com/shotaronowhere/special-l2-relativity/assets/10378902/93008515-464f-440f-8bdd-f510882a5080">
