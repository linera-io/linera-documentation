# Validators

Validators run the servers that allow users to download and create blocks. They validate, execute and cryptographically certify the blocks of all the chains.

> In Linera, every chain is backed by the same set of validators and has the same level of security.

The main function of validators is to guarantee the integrity of the infrastructure in the sense that:

* Each block is valid, i.e. it has the correct format, its operations are allowed, the received messages are in the correct order, and e.g. the balance was correctly computed.
* Every message received by one chain was actually sent by another chain.
* If one block on a particular height is certified, no other block on the same height is.

These properties are guaranteed to hold as long as two third of the validators (weighted by their stake) follow the protocol. In the future, deviating from the protocol may cause a validator to be considered malicious and to lose their _stake_.

Validators also play a role in the liveness of the system by making sure that the history of the chains stays available. However, since validators do not propose blocks on most chains (see [next section](../../developer-manual/advanced\_topics/block\_creation.html)), they do _not_ guarantee that any particular operation or message will eventually be executed on a chain. Instead, chain owners decide whether and when to propose new blocks, and which operations and messages to include. The current implementation of the Linera client automatically includes all incoming messages in new blocks. The operations are the actions the chain owner explicitly adds, e.g. transfer.

## Architecture of a validator

Since every chain uses the same validators, adding more chains does not require adding validators. Instead, it requires each individual validator to scale out by adding more computation units, also known as "workers" or "physical shards".

In the end, a Linera validator resembles a Web2 service made of

* a load balancer (aka. ingress/egress), currently implemented by the binary `linera-proxy`,
* a number of workers, currently implemented by the binary `linera-server`,
* a shared database, currently implemented by the abstract interface `linera-storage`.

```ignore
Example of Linera network

                    │                                             │
                    │                                             │
┌───────────────────┼───────────────────┐     ┌───────────────────┼───────────────────┐
│ validator 1       │                   │     │ validator N       │                   │
│             ┌─────┴─────┐             │     │             ┌─────┴─────┐             │
│             │   load    │             │     │             │   load    │             │
│       ┌─────┤  balancer ├────┐        │     │       ┌─────┤  balancer ├──────┐      │
│       │     └───────────┘    │        │     │       │     └─────┬─────┘      │      │
│       │                      │        │     │       │           │            │      │
│       │                      │        │     │       │           │            │      │
│  ┌────┴─────┐           ┌────┴─────┐  │     │  ┌────┴───┐  ┌────┴────┐  ┌────┴───┐  │
│  │  worker  ├───────────┤  worker  │  │ ... │  │ worker ├──┤  worker ├──┤ worker │  │
│  │    1     │           │    2     │  │     │  │    1   │  │    2    │  │    3   │  │
│  └────┬─────┘           └────┬─────┘  │     │  └────┬───┘  └────┬────┘  └────┬───┘  │
│       │                      │        │     │       │           │            │      │
│       │                      │        │     │       │           │            │      │
│       │     ┌───────────┐    │        │     │       │     ┌─────┴─────┐      │      │
│       └─────┤  shared   ├────┘        │     │       └─────┤  shared   ├──────┘      │
│             │ database  │             │     │             │ database  │             │
│             └───────────┘             │     │             └───────────┘             │
└───────────────────────────────────────┘     └───────────────────────────────────────┘

```

Inside a validator, components communicate using the internal network of the validator. Notably, workers use direct Remote Procedure Calls (RPCs) with each other to deliver cross-chain messages.

Note that the number of workers may vary for each validator. Both the load balancer and the shared database are represented as a single entity but are meant to scale out in production.

> For local testing during development, we currently use a single worker and RocksDB as a database.
