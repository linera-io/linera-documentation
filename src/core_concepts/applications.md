# Applications

The programming model of Linera is designed so that developers can take advantage of
microchains to scale their applications.

Linera uses the WebAssembly Virtual Machine (Wasm) to execute user applications.
Currently, the [Linera SDK](../sdk.md) is focused on the [Rust](https://www.rust-lang.org/)
programming language.

## The Application Deployment Lifecycle

Linera Applications are designed to be powerful yet re-usable. For this reason
there is a distinction between the bytecode and an application
instance on the network.

Applications undergo a lifecycle transition aimed at making development easy and
flexible:

1. The bytecode is built from a Rust project with the `linera-sdk`
   dependency.
2. The bytecode is published to the network on a microchain, and assigned an
   identifier.
3. A user can create a new application instance, by providing
   the bytecode identifier and initialization arguments. This
   process returns an application identifier which can be used to reference and
   interact with the application.
4. The same bytecode identifier can be used as many times is needed by as many
   users are needed to create distinct applications.

Importantly, the application deployment lifecycle is abstracted from the user, and
an application can be published with a single command:

```bash
linera --storage $LINERA_STORAGE --wallet $LINERA_WALLET publish-and-create <contract-path> <service-path> <init-args>
```

This will publish the bytecode as well as initialize the application for you.

## Anatomy of an Application

An **application** is broken into two major components, the _contract_ and the _service_.

The **contract** is gas-metered, and is the part of the application which executes operations
and messages, make cross-application calls and modifies the application's state. The
details are covered in more depth in the [SDK docs](../sdk.md).

The **service** is non-metered and read-only. It is used primarily to query the
state of an application and populate the presentation layer (think front-end)
with the data required for a user interface.

Finally, the application's state is shared by the contract and service in
the form of a [View](./../advanced_topics/views.md), but more on that later.

## Operations and Messages

> For this section we'll be using a simplified version of the example application called
> "fungible" where users can send tokens to each other.

At the system-level, interacting with an application can be done via operations
and messages.

**Operations** are defined by an application developer and each
application can have a completely different set of operations. Chain owners then
actively create operations and put them in their block proposals to interact
with an application.

Taking the "fungible token" application as an example, an operation
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

**Messages** result from the execution of operations or other messages.
Messages can be sent from one chain to another. Block
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

### Authentication

Operations are always authenticated and messages may be authenticated. The signer of a block becomes
the authenticator of all the operations in that block. As operations are executed by applications,
messages can be created to be sent to other chains. When they are created, they can be configured to
be authenticated. In that case, the message receives the same authentication as the operation that
created it. If handling an incoming message creates new messages, those may also be configured to
have the same authentication as the received message.

In other words, the block signer can have its authority propagated across chains through series of
messages. This allows applications to safely store user state in chains that the user may not have
the authority to produce blocks. The application may also allow only the authorized user to change
that state, and not even the chain owner is able to override that.

An example where this is used is in the Fungible application, where a `Claim` operation allows
retrieving money from a chain the user does not control (but the user still trusts will produce a
block receiving their message). Without the `Claim` operation, users would only be able to store
their tokens on their own chains, and multi-owner and public chains would have their tokens shared
between anyone able to produce a block.

With the `Claim` operation, users can store their tokens on another chain where they're able to
produce blocks or where they trust the owner will produce blocks receiving their messages. Only they
are able to move their tokens, even on chains where ownership is shared or where they are not able
to produce blocks.

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
