# Hello, Linera

This section is about running a local development network, then compiling and deploying
your first application from scratch. It is assumed that you've already cloned the Linera
repository and have managed to successfully `cargo build` the workspace.

By the end of this section, you'll have a [microchain](../core_concepts/microchains.md)
running locally and a working application that can be queried using GraphQL.

## Starting the local network

The first step is to start your local development network.
A development network consists of a numbers of [validators](../advanced_topics/validators.md), each
of which consist of an ingress proxy (aka a "load balancer") and a number of workers (aka "physical shards").

To start a local network, navigate to the root of the `linera-protocol`
repository and run the following command:

```bash
./scripts/run_local.sh
```

This will start a validator with the default number of shards.

> The local network is running on operating system network ports, taking a number of ports
> to run locally. These ports are in the range P > 9000. Yet, there may be a collision, in
> which case you may want to configure the port numbers in the `configuration/` directory.

## Storing the wallet

`run_local.sh` generates your wallet under `target/debug/wallet.json`.

It is recommended that you move this file into a temporary directory. We'll call this
`<wallet>`.

This file is only valid for the lifetime of a single network. Every time your local
devnet is restarted this will need to be regenerated.

For convenience, let's export the wallet and storage locations:

```bash
export LINERA_WALLET=$(realpath target/debug/wallet.json)
export LINERA_STORAGE="rocksdb:$(dirname "$LINERA_WALLET")/linera.db"
```

For storage, choose an empty file next to the location of your wallet

## Interacting with the network

The main way of interacting with the network and deploying applications, is
using the `linera` client.

Check that you have the client, and it can communicate with the network by
running a command to synchronize the balance for your
[default chain](../core_concepts/wallet.md) with the rest of the network.

```bash
linera --wallet $LINERA_WALLET sync-balance
```

You should see an output of `10`.

## Building an example Application

Applications running on Linera are simply [Wasm](https://webassembly.org/)
bytecode. Each Linera validator and client has a built-in Wasm virtual machine
which can execute bytecode, all we have to do is build and publish the app on
the network.

We'll look at the anatomy of an application in
a [later section](../core_concepts/applications.md) but for now we want to compile one of the
example Linera applications which can be found in the `examples/`
subdirectory.

To do that, navigate to one of the example applications and compile it (the
compilation target is set to `wasm32_unknown_unknown` by default)

```bash
cd examples/counter && cargo build --release
```

## Publishing your Application

We can publish our compiled application to our local network by using
the `linera` client.

To deploy the application we can use the `publish-and-create` command and provide:

1. The location of the contract bytecode
2. The location of the service bytecode
3. The JSON encoded initialization arguments

```bash
linera --wallet $LINERA_WALLET \
  --storage $LINERA_STORAGE \
  publish-and-create \
  ../target/wasm32-unknown-unknown/release/counter_{contract,service}.wasm \
  --json-argument "42"
```

Congratulations! You've published your first application on Linera!

## Querying your Application

Now let's query our application to get the current counter value. To do that, we need to
use the client running in _service_ mode. This will expose a bunch of APIs locally which
we can use to interact with applications on the network.

```bash
linera --wallet $LINERA_WALLET --storage $LINERA_STORAGE service
```

<!-- TODO: add graphiql image here -->

Navigate to `http://localhost:8080` in your browser to access the GraphiQL, the
GraphQL IDE. We'll look at this in more detail in
a [future section](../core_concepts/wallet.md#graphql); for now, list the applications deployed on your
local network by running:

```gql
query {
  applications {
    id
    description
    link
  }
}
```

Since we've only deployed one application, the results returned have a single
entry.

At the bottom of the returned JSON there is a field called `link`, to interact
with your deployed application copy and past the link into a new browser tab.
Finally, to query the counter value of our deployed application, run:

```gql
query {
  value
}
```

This will return a value of `42`, which is the initialization argument we
specified when deploying our application.
