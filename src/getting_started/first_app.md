# Your First App

This section is about deploying your first application from scratch.
It is assumed that you've already cloned the Linera repository and have managed
to successfully `cargo build` the workspace.

By the end of this section, you'll have a working application running on your
[microchain](../core_concepts/micro_chains.md).

## Starting the local network

The first step is to start your local development network.
The local development network consists of 4 [validators](../core_concepts/validators.md), each
of which consist of an ingress proxy and 4 workers or shards.

To start your local network, navigate to the root of the `linera-protocol`
repository and run the following command:

```bash
./scripts/run_local.sh
```

you will the see the names of the 4 validators running in your local network,
something like:

```bash
$ ./scripts/run_local.sh
    Finished dev [unoptimized + debuginfo] target(s) in 0.13s
5b611b86cc1f54f73a4abfb4a2167c7327cc85a74cb2a5502431f67b554850b4
f65a585f05852f0610e2460a99c23faa3969f3cfce8a519f843a793dbfb4cb84
abfbf26c6f45955067f60de0317816454dbd54459dc773f185fbcaf8c72d5041
140f3259cae9ea2a3b50cbcba2495661aea42641ef44751dec0a29b192ccf32f

```

> The local network is running on operating system network ports, taking a total
> of 20 ports to run locally. These ports are in the range P > 9000 however
> there
> may be a collision, in which case you may want to configure the port numbers
> in
> the `configuration/` directory.

The `run_local.sh` script also initialises a test wallet for you, but more on
that later.

## Interacting with the network

The main way of interactive with the network and deploying applications, is
using your wallet. The wallet was compiled as a result of running `cargo build`
in the previous section and can be found under `target/debug/client`.

Check that you have your wallet, and it can communicate with the network by
first navigating to `target/debug` and then running a command to synchronize the
balance for
your [default chain](../core_concepts/wallet.md) with the rest of the network.

```bash
cd target/debug && ./client --wallet wallet.json --genesis genesis.json sync_balance
```

You should see an output of `10`. If you're curious why we're passing all these
files to the client, we'll get to that in the [wallet section](../core_concepts/wallet.md).

## Building and example Application

Applications running on Linera are simply [WASM](https://webassembly.org/)
bytecode. Each Linera validator and client has a built-in WASM virtual machine
which can execute bytecode, all we have to do is build and publish the app on
the network.

We'll look at the anatomy of an application in
a [later section](../core_concepts/applications.md) but for now we want to compile one of the
example Linera applications which can be found in the `linera-examples/`
subdirectory.

To do that, navigate to one of the example applications and compile it (the
compilation target is set to `wasm32_unknown_unknown` by default)

```
cd linera-examples/counter-graphql && cargo build --release 
```

## Publishing your Application

We can publish our compiled application to our local network by using
the `client`. To do that, navigate back to `./target/debug`.

To deploy the application we can use the `publish` command and provide:

1. The location of the contract bytecode
2. The location of the service bytecode
3. The hex encoded initialisation arguments

```bash
./client --storage rocksdb:client.db --wallet wallet.json --genesis genesis.json --max-pending-messages 10000 publish \
    ../../linera-examples/target/wasm32-unknown-unknown/release/counter_graphql_contract.wasm \
    ../../linera-examples/target/wasm32-unknown-unknown/release/counter_graphql_service.wasm \
    35
```

Congratulations! You've published your first application on Linera!

## Querying your Application

Now that we've published our application on the network, let's query it to get
the current counter value. To interact with an application on the network, we
need to use the client running in 'service' mode. This will expose a bunch of
API's locally which we can use to interact with applications on the network.

To run the client in service mode, make sure you're in `./target/debug` and run:

```bash
./client --storage rocksdb:client.db --wallet wallet.json --genesis genesis.json --max-pending-messages 10000 service 
```

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

This will return a value of `35`, which is the initialisation argument we
specified when deploying our application.
