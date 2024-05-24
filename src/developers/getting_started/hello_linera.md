# Hello, Linera

This section is about interacting with the Devnet, running a local development
network, then compiling and deploying your first application from scratch.

By the end of this section, you'll have a
[microchain](../core_concepts/microchains.md) on the Devnet and/or on your local
network, and a working application that can be queried using GraphQL.

## Using the Devnet

The Linera Devnet is a deployment of the Linera protocol that's useful for
developers. It should not be considered stable, and can be restarted from a
clean slate and new genesis at any time.

To interact with the Devnet, some tokens are needed. A Faucet service is
available to create new microchains and obtain some test tokens. To do so, this
must be configured when initializing the wallet:

```bash
linera wallet init --with-new-chain --faucet https://faucet.{{#include ../../../RELEASE_DOMAIN}}.linera.net
```

This creates a new microchain on Devnet with some initial test tokens, and the
chain is automatically added to the newly instantiated wallet.

> Make sure to use a Linera toolchain
> [compatible with the current Devnet](installation.md#installing-from-cratesio).

## Starting a Local Test Network

Another option is to start your own local development network. A development
network consists of a number of [validators](../advanced_topics/validators.md),
each of which consist of an ingress proxy (aka. a "load balancer") and a number
of workers (aka. "physical shards").

To start a local network, run the following command:

```bash
linera net up
```

This will start a validator with the default number of shards and create a
temporary directory storing the entire network state.

This will set up a number of initial chains and create an initial wallet to
operate them.

### Using the Initial Test Wallet

`linera net up` prints Bash statements on its standard output to help you
configure your terminal to use the initial wallet of the new test network, for
instance:

```bash
export LINERA_WALLET="/var/folders/3d/406tbklx3zx2p3_hzzpfqdbc0000gn/T/.tmpvJ6lJI/wallet.json"
export LINERA_STORAGE="rocksdb:/var/folders/3d/406tbklx3zx2p3_hzzpfqdbc0000gn/T/.tmpvJ6lJI/linera.db"
```

This wallet is only valid for the lifetime of a single network. Every time a
local network is restarted, the wallet needs to be reconfigured.

## Interacting with the Network

> In the following examples, we assume that either the wallet was initialized to
> interact with the Devnet or the variables `LINERA_WALLET` and `LINERA_STORAGE`
> are both set and point to the initial wallet of the running local network.

The main way of interacting with the network and deploying applications is using
the `linera` client.

To check that the network is working, you can synchronize your
[default chain](../core_concepts/wallets.md) with the rest of the network and
display the chain balance as follows:

```bash
linera sync
linera query-balance
```

You should see an output number, e.g. `10`.

## Building an Example Application

Applications running on Linera are [Wasm](https://webassembly.org/) bytecode.
Each validator and client has a built-in Wasm virtual machine (VM) which can
execute bytecode.

Let's build the `counter` application from the `examples/` subdirectory:

```bash
cd examples/counter && cargo build --release --target wasm32-unknown-unknown
```

## Publishing your Application

You can publish the bytecode and create an application using it on your local
network using the `linera` client's `publish-and-create` command and provide:

1. The location of the contract bytecode
2. The location of the service bytecode
3. The JSON encoded initialization arguments

```bash
linera publish-and-create \
  ../target/wasm32-unknown-unknown/release/counter_{contract,service}.wasm \
  --json-argument "42"
```

Congratulations! You've published your first application on Linera!

## Querying your Application

Now let's query your application to get the current counter value. To do that,
we need to use the client running in
[_service_ mode](../core_concepts/node_service.md). This will expose a bunch of
APIs locally which we can use to interact with applications on the network.

```bash
linera service
```

<!-- TODO: add graphiql image here -->

Navigate to `http://localhost:8080` in your browser to access the GraphiQL, the
[GraphQL](https://graphql.org) IDE. We'll look at this in more detail in a
[later section](../core_concepts/node_service.md#graphiql-ide); for now, list
the applications deployed on your default chain e476… by running:

```gql
query {
  applications(
    chainId: "e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65"
  ) {
    id
    description
    link
  }
}
```

Since we've only deployed one application, the results returned have a single
entry.

At the bottom of the returned JSON there is a field `link`. To interact with
your application copy and paste the link into a new browser tab.

Finally, to query the counter value, run:

```gql
query {
  value
}
```

This will return a value of `42`, which is the initialization argument we
specified when deploying our application.
