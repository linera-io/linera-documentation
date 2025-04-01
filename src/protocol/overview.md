# Overview

Linera is a decentralized protocol optimized for Web3 applications that require
guaranteed performance for an unlimited number of active users.

The core idea of the Linera protocol is to run many parallel chains, called
**microchains**, in a single set of validators, so that they can run the same
applications and easily share data and liquidity.

## How does it work?

In Linera, user wallets operate their own chains. The owner of a chain chooses
when to add new blocks to the chain and what goes inside the blocks. Such chains
with a single user are called **user chains**.

Users may add new blocks to their chains in order to process **incoming
messages** from other chains or to execute secure **operations** on their
accounts, for instance to transfer assets to another user.

> Besides user chains, the [Linera protocol](https://linera.io/whitepaper) is
> designed to support other types of microchains, called "multi-user" and
> "public" chains. Public chains are operated by validators. In this regard,
> they are similar to classical blockchains. Multi-user chains are meant to be
> used for temporary interactions between users, such as atomic swaps, auctions,
> or on-chain games.

<!--
Importantly, validators ensure that all new blocks are **valid**. For instance,
transfer operations must originate from accounts with sufficient funds; and
incoming messages must have been actually sent from another chain. Blocks are
verified by validators in the same way for every chain.

A Linera **application** is a Wasm program that defines its own state and
operations. Users can publish bytecode and initialize an application on one
chain, and it will be automatically deployed to all chains where it is needed,
with a separate state on each chain.

To ensure coordination across chains, an application may rely on asynchronous
**cross-chain messages**. Message payloads are application-specific and opaque
to the rest of the system.

```ignore
                               ┌───┐     ┌───┐     ┌───┐
                       Chain A │   ├────►│   ├────►│   │
                               └───┘     └───┘     └───┘
                                                     ▲
                                           ┌─────────┘
                                           │
                               ┌───┐     ┌─┴─┐     ┌───┐
                       Chain B │   ├────►│   ├────►│   │
                               └───┘     └─┬─┘     └───┘
                                           │         ▲
                                           │         │
                                           ▼         │
                               ┌───┐     ┌───┐     ┌─┴─┐
                       Chain C │   ├────►│   ├────►│   │
                               └───┘     └───┘     └───┘
```

The number of applications present on a single chain is not limited. On the same
chain, applications are **composed** as usual using synchronous calls.

The current Linera SDK uses **Rust** as a source language to create Wasm
applications. It relies on the normal Rust toolchains so that Rust programmers
can work in their preferred environments.
-->

## How does Linera compare to existing multi-chain protocols?

Linera is the first blockchain designed to run a virtually unlimited number of
chains in parallel, including one dedicated **user chain** per user wallet.

In traditional multi-chain protocols, each chain usually runs a full blockchain
protocol in a separate set of validators. Creating a new chain or exchanging
messages between chains is expensive. As a result, the total number of chains is
generally limited.

In contrast, **Linera is designed to run as many microchains as needed**:

- Users only create blocks in their chain when needed;

- Creating a microchain does not require onboarding validators;

- All chains have the same level of security;

- Microchains communicate efficiently using the internal networks of validators;

- Validators are internally sharded (like a regular web service) and may adjust
  their capacity elastically by adding or removing internal workers.
