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
   by referencing the bytecode and providing initialization parameters. This
   process returns an application identifier which can be used to reference and
   interact with the application.
4. The same bytecode identifier can be used as many times is needed by as many
   users are needed to create distinct applications.

Happily, the application deployment lifecycle is abstracted from the user, and
an application can be published with a single command:

```bash
linera --storage $LINERA_STORAGE --wallet $LINERA_WALLET publish-and-create <contract-path> <service-path> <init-args>
```

This will publish the bytecode as well as initialize the application for you.

## Anatomy of an Application

An application is broken into two major components, the _contract_ and the _service_.

The contract is gas-metered (for more details,
see [execution model](../advanced_topics/execution_model.md)), and is the part
of the application which executes operations and messages, make cross-application
calls and modifies the application's state. The details are covered in more
depth in the
[SDK docs](./sdk.md).

The service is non-metered and read-only. It is used primarily to query the
state of an application and hydrate the presentation layer (think front-end)
with the data required for a user interface.

Finally, spanning both the contract and service is the Application's state in
the form of a [View](./../advanced_topics/views.md), but more on that later.

## Operations and Messages

> For this section we'll be using the example of a hypothetical "fungible token"
> application where users can send tokens to each other.

At the system-level, interacting with an application can be done via operations
and messages.

**Operations** are defined by an application developer and each
application can have a completely different set of operations. Chain owners then
actively create operations and put them in their block proposals to interact
with an application.

Using our hypothetical "fungible token" application as an example, an operation
for a user to transfer funds to another user would look like this:

```rust,ignore
# extern crate serde;
# use serde::{Deserialize, Serialize};
#[derive(Debug, Deserialize, Serialize)]
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

**Messages** are outcomes of execution (of operations or other messages).
Messages from one chain can be sent in a cross-chain message to another. Block
proposers also actively include messages in their block proposal, but unlike with
operations, they are only allowed to include them in the right order (possibly
skipping some), and only if they were actually created by another chain (or the
same chain, earlier).

In our "fungible token" application, a message to credit an account would look like this:

```rust,ignore
# extern crate serde;
# use serde::{Deserialize, Serialize};
#[derive(Debug, Deserialize, Serialize)]
pub enum Message {
    Credit { owner: AccountOwner, amount: Amount },
    // Meant to be extended here
}
```

## Interacting with an Application

To interact with an application, we run the Linera client
[in service mode](wallet.md#node-service). It exposes a GraphQL API for every
application running on that chain at `localhost:8080/<application-id>`.

Simple navigating there with your browser will open a GraphiQL interface which
enables you to graphically explore the state of your application.

## Registering an Application across Chains

If Alice is using an application on her chain and starts interacting with Bob
via the application, e.g. sends him some tokens using the `fungible` example,
the application automatically gets registered on Bob's chain, too, as soon as
he handles the incoming cross-chain messages. After that, he can execute the
application's operations on his chain, too, and e.g. send tokens to someone.

But there are also cases where Bob may want to start using an application he
doesn't have yet. E.g. maybe Alice regularly makes posts using the `social`
example, and Bob wants to subscribe to her.

In that case, trying to execute an application-specific operation would fail,
because the application is not registered on his chain.
He needs to request it from Alice first:

```bash
linera --wallet $LINERA_WALLET --storage $LINERA_STORAGE request-application <application-id> --target-chain-id <alices-chain-id>
```

Once Alice processes his message (which happens automatically if she is running
the client in service mode), he can start using the application.
