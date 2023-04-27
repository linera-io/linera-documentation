# Applications

This section is all about building applications in Linera. The Linera programming
model is designed to provide a rich ecosystem to enable developers to take advantage
of the scaling architecture of microchains.

Linera uses the WebAssembly VM to execute user applications. For now
the [SDK](./sdk.md) used to develop Linera applications is exclusively for
the [Rust](https://www.rust-lang.org/) programming language. This will be
covered in depth in the [next section](./sdk.md).

## The Application Deployment Lifecycle

Linera Applications are designed to be powerful yet re-usable. For this reason
there is a distinction between the application bytecode and an application
instance on the network.

Applications undergo a lifecycle transition aimed at making development easy and
flexible:

1. The application bytecode is built from a Rust project with the `linera-sdk`
   dependency.
2. The application bytecode is published to the network on a given microchain.
   The bytecode location itself is then opaque to the rest of the network, the
   only way to reference it is with a bytecode identifier.
3. After the bytecode is published, a user can create a new application instance
   by referencing the bytecode and providing initialisation parameters. This
   process returns an application identifier which can be used to reference and
   interact with the application.
4. The same bytecode identifier can be used as many times is needed by as many
   users are needed to create distinct applications.

Happily, the application deployment lifecycle is abstracted from the user, and
an application can be published with a single command:

```bash
./linera --storage rocksdb:linera.db --wallet wallet.json --genesis genesis.json --max-pending-messages 10000 publish <contract-path> <service-path> <init-args>
```

This will publish the bytecode as well as initialise the application for you.

## Anatomy of an Application

An application is broken into two major components, the 'contract' and the '
service'.

The contract is gas-metered (for more details,
see [execution model](../advanced_topics/execution_model.md)), and is the part
of the application which executes operations and effects, make cross-application
calls and modifies the application's state. The details are covered in more
depth in the
[SDK docs](./sdk.md).

The service, is non-metered and read-only. It is used primarily to query the
state of an application and hydrate the presentation layer (think front-end)
with the data required for a user interface.

Finally, spanning both the contract and service is the Application's state in
the form of a [View](./../advanced_topics/views.md), but more on that later.

## Operations and Effects

> For this section we'll be using the example of a hypothetical 'fungible token'
> application where users can send tokens to each other.

At the system-level, interacting with an application can be done via operations
and effects.

**Operations** are defined by an application developer and each
application can have a completely different set of operations. Chain owners then
actively create operations and put them in their block proposals to interact
with an application.

Using our hypothetical 'fungible token' application as an example, an operation
for a user to transfer funds to another user would look like this:

```rust
/// An operation.
#[derive(Deserialize, Serialize)]
pub enum Operation {
    /// A transfer from a (locally owned) account to a (possibly remote) account.
    Transfer {
        owner: AccountOwner,
        amount: Amount,
        target_account: Account,
    },
    // Meant to be extended here
}
```

**Effects** are outcomes of execution (of operations or other effects).
Effects from one chain can be sent in a cross-chain message to another. Block
proposers also actively include effects in their block proposal, but unlike with
operations, they are only allowed to include them in the right order (possibly
skipping some), and only if they were actually created by another chain (or the
same chain, earlier).

Using our hypothetical 'fungible token' application as an example, an effect
to credit an account would look like this:

```rust
/// An effect.
#[derive(Deserialize, Serialize)]
pub enum Effect {
    Credit { owner: AccountOwner, amount: Amount },
    // Meant to be extended here
}
```

## Interacting with an Application

To interact with an application, we follow the same principle as interacting
with the Linera network system and we use the wallet.

When [run in 'service' mode](wallet.md#node-service), the wallet exposes a
GraphQL API for every application running on that chain. To interface with an
application running on a given chain, run the wallet in `service` mode for that
chain and the API for the application is then available
at `localhost:8080/<application-id>`.

Simple navigating there with your browser will open a GraphiQL interface which
enables you to graphically explore the state of your application.

## End-to-End Front-end?

## Registering an Application across Chains

Let us assume that User A has Chain X, and User B has Chain Y. Let us also
assume that Application 1 is deployed on Chain X.

User A can interact with Application 1 since it is deployed on their Chain (
Chain X), however User B cannot see Application 1 since his Chain, Chain Y has
not registered the application.

In order for User B to use Application 1, Application 1 _must_ first make a
cross-chain request to Chain Y in order for tha application to get registered on
Chain Y. Once that is done, User B can interact with Application 1 on Chain Y.

If this was not the case, every chain would run every application, and we would
end up with microchains which are simply full-scale Nakamoto blockchains. This '
discovering' strategy enables Chains to only care about a finite subset of the
state of the entire network.
