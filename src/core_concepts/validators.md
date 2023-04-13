# Validators

The validators run servers that allow users to download and create blocks. They validate,
execute and cryptographically certify blocks on all microchains. That means every single
chain is backed by the full set of validators, and has the same level of security.

Concretely, they guarantee that:

* Each block is valid, i.e. it has the correct format, its operations are allowed, the
  received effects are in the correct order, and e.g. the balance was correctly computed.
* Every effect received by one chain was actually sent by another chain.
* If one block on a particular height is certified, no other block on the same height is.

To undermine these guarantees, at least one third of the validators (weighted by their
stake) would need to cheat---in a detectable way! (Staking is not yet implemented, but in
the future, malicious validators would forfeit their stakes.)

Since validators do not propose blocks on most chains, they do *not* guarantee that any
particular operation or effect will eventually be executed on a chain. Instead, chain
owners decide whether and when to propose new blocks, and which operations and effects to
include.
The Linera client implementation will automatically include all incoming effects in new
blocks. The operations are the actions the chain owner explicitly adds, e.g. transfer.


## Scalability

Since every chain uses the same validators, adding more chains does not require adding
additional validators. Instead, it requires each individual validator to scale up and
handle the additional load.

That is why Linera allows the same validator to run multiple `server`
processes—*workers*—on different machines, each one processing a different subset of
the microchains. The workers communicate directly with each other whenever a chain sends
an effect to another chain.

## Anatomy of a Validator

To achieve scalability, Linera validators need to be horizontally scalable (sometimes 
referred to as 'elastic'). To achieve this scalability, the architecture of a validator
involves splitting the chains up over multiple 'shards' or 'workers' which are 
encapsulated by a single ingress/egress called the 'proxy'. 

The validator has an internal network enabling the proxy to speak with shards and shards
with each other. Each shard is also backed by its own data store which can be scaled 
independently of the rest of the validator

```
 example network                                            
                     │                                           │
                     │                                           │
                     │                                           │
┌────────────────────┼────────────────────┐ ┌────────────────────┼────────────────────┐
│ validator 1        │                    │ │ validator 2        │                    │
│              ┌─────┴─────┐              │ │              ┌─────┴─────┐              │
│              │   proxy   │              │ │              │   proxy   │              │
│        ┌─────┤           ├─────┐        │ │        ┌─────┤           ├─────┐        │
│        │     └───────────┘     │        │ │        │     └───────────┘     │        │
│        │                       │        │ │        │                       │        │
│        │                       │        │ │        │                       │        │
│  ┌─────┴─────┐           ┌─────┴─────┐  │ │  ┌─────┴─────┐           ┌─────┴─────┐  │
│  │   shard   │           │   shard   │  │ │  │   shard   │           │   shard   │  │
│  │     1     │           │     2     │  │ │  │     1     │           │     2     │  │
│  └─────┬─────┘           └─────┬─────┘  │ │  └─────┬─────┘           └─────┬─────┘  │
│        │                       │        │ │        │                       │        │
│  ┌─────┴─────┐           ┌─────┴─────┐  │ │  ┌─────┴─────┐           ┌─────┴─────┐  │
│  │    db1    │           │    db2    │  │ │  │    db1    │           │    db2    │  │
│  │           │           │           │  │ │  │           │           │           │  │
│  └───────────┘           └───────────┘  │ │  └───────────┘           └───────────┘  │
│                                         │ │                                         │
└─────────────────────────────────────────┘ └─────────────────────────────────────────┘

```

## Configuring Networks, Workers and Proxies

In [Your First App](../getting_started/first_app.md) we used the `run_local.sh` script
to start a local network. This should be sufficient for most usecases when you're running
a local network.

```bash
./scripts/run_local.sh
```

However, it is possible to customise and configure the parameters of the network.

`run_local.sh` uses the `validator_n.toml` file from the `configuration/` directory to configure validator number `n`.

```bash
./server generate --validators configuration/validator_{1,2,3,4}.toml --committee committee.json
```

generates keys and writes them, together with the options from the TOML files, to
`server_1.json`, ..., `server_4.json`. It also stores the set of the new validators'
public keys in `committee.json`.

```bash
./client --wallet wallet.json --genesis genesis.json create_genesis_config 10 --initial-funding 10 --committee committee.json
```

creates a configuration for the initial state of the network, `genesis.json`, with 10
chains, each with a balance of 10. It also creates a `wallet.json` for a client who owns
all those chains.

To start the newly configured network, each validator `n` must start their proxy:

```bash
./proxy server_n.json &
```

And all shards; for shard `i`:

```bash
./server run --storage rocksdb:server_n_i.db --server server_n.json --shard i --genesis genesis.json &
```

This will create a separate database file `server_n_i.db` for each shard. In a production
network, these would be running on different machines.


## Changing the Set of Validators

If a new validator wants to start participating, or an old one wants to leave, all chains
must be updated.

The system has has one designated *admin chain*, where the validators can join or leave
or, and where new *epochs* are defined. During every epoch, the set of validators is
fixed.

Chain owners must then create a block that receives the `SetCommittees` effect from the
admin chain, and have it certified by the old validators. Only the *next* block in their
chain will be certified by the new validator set!

That is why epochs are planned to change infrequently—possibly once per day or per
week—, and several subsequent epochs can overlap, so that chain owners have plenty of
time to migrate their chains.
