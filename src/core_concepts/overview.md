# Overview

Linera is a decentralized infrastructure optimized for Web3 applications that
require guaranteed performance for an unlimited number of active users.

The core idea of the Linera protocol is to run many lightweight blockchains,
called **microchains**, in parallel in a single set of validators.

## How does it work?

In Linera, user wallets operate their own microchains. The owner of a chain
chooses when to add new blocks to the chain and what goes inside the blocks.
Such chains with a single user are called **user chains**.

Users may add new blocks to their chains in order to process **incoming
messages** from other chains or to execute secure **operations** on their
accounts, for instance to transfer assets to another user.

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

## How does Linera compare to existing multi-chain infrastructure?

Linera is the first infrastructure designed to support many chains in parallel,
and notably an arbitrary number of **user chains** meant to be operated by user
wallets.

In traditional multi-chain infrastructures, each chain usually runs a full
blockchain protocol in a separate set of validators. Creating a new chain or
exchanging messages between chains is expensive. As a result, the total number
of chains is generally limited. Some chains may be specialized to a given use
case: these are called "app chains".

In contrast, Linera is optimized for a large number of user chains:

- Users only create blocks in their chain when needed;

- Creating a microchain does not require onboarding validators;

- All chains have the same level of security;

- Microchains communicate efficiently using the internal networks of validators;

- Validators are internally sharded (like a regular web service) and may adjust
  their capacity elastically by adding or removing internal workers.

> Besides user chains, the [Linera protocol](https://linera.io/whitepaper) is
> designed to support other types of microchains, called "permissioned" and
> "public" chains. Public chains are operated by validators. In this regard,
> they are similar to classical blockchains. Permissioned chains are meant to be
> used for temporary interactions between users, such as atomic swaps.

## Why build on top of Linera?

We believe that many high-value use cases are currently out of reach of existing
Web3 infrastructures because of the challenges of serving **many active users**
simultaneously without degrading user experience (unpredictable fees, latency,
etc).

Examples of applications that require processing time-sensitive transactions
created by many simultaneous users include:

- real-time micro-payments and micro-rewards,

- social data feeds,

- real-time auction systems,

- turn-based games,

- version control systems for software, data pipelines, or AI training
  pipelines.

Lightweight user chains are instrumental in providing elastic scalability but
they have other benefits as well. Because user chains have fewer blocks than
traditional blockchains, in Linera, the full-nodes of user chains will be
embedded into the users' wallets, typically deployed as a browser extension.

This means that Web UIs connected to a wallet will be able to query the state of
the user chain directly (no API provider, no light client) using familiar
frameworks (React/GraphQL). Furthermore, wallets will be able to leverage the
full node as well for security purposes, including to display meaningful
confirmation messages to users.

## What is the current state of the development of Linera?

The
[reference open-source implementation](https://github.com/linera-io/linera-protocol)
of Linera is under active development. It already includes a Web3 SDK with the
necessary features to prototype simple Web3 applications and test them locally
on the same machine and deploying them to the Devnet.

Web UIs (possibly reactive) can already be built on top of Wasm-embedded GraphQL
services, and tested locally in the browser.

The main limitations of our current Web3 SDK include:

- Web UIs need to query a local HTTP service acting as a wallet. This setup is
  meant to be temporary and for testing only: in the future, web UIs will
  securely connect to a Wallet installed as a browser extension, as usual.

- Only user chains are currently documented in this manual. Permissioned chains
  (aka "temporary" chains) were recently added. Support for public chains is in
  progress.

The main development workstreams of Linera, beyond its SDK, can be broken down
as follows.

### Core Protocol

- [x] User chains
- [x] Permissioned chains (core protocol only)
- [x] Cross-chain messages
- [x] Cross-chain pub/sub channels (initial version)
- [x] Bytecode publishing
- [x] Application creation
- [x] Reconfigurations of validators
- [x] Support for gas fees
- [x] Support for storage fees and storage limits
- [x] External service (aka. "Faucet") to help users create their first chain
- [x] Permissioned chains (adding operation access control, demo of atomic
      swaps, etc)
- [ ] Avoid repeatedly loading chain states from storage
- [ ] Blob storage usable by system and user applications
      (generalizing/replacing bytecode storage)
- [ ] Support for easy onboarding of user chains into a new application
      (removing the need to accept requests)
- [ ] Replace pub/sub channels by data streams (removing the need to accept
      subscriptions)
- [ ] Allow chain clients to control which chains they track (lazily/actively)
      and execute (do not execute all tracked chains)
- [ ] Multi-signed events to facilitate future bridges to external chains
- [ ] Public chains (adding leader election, inbox constraints, etc)
- [ ] Transaction scripts
- [ ] Support for dynamic shard assignment
- [ ] Support for archiving chains
- [ ] Tokenomics and incentives for all stakeholders
- [ ] Governance on the admin chain (e.g. DPoS, onboarding of validators)
- [ ] Permissionless auditing protocol

### Wasm VM integration

- [x] Support for the Wasmer VM
- [x] Support for the Wasmtime VM (experimental)
- [x] Test gas metering and deterministic execution across VMs
- [x] Composing Wasm applications on the same chain
- [x] Support for non-blocking (yet deterministic) calls to storage
- [x] Support for read-only GraphQL services in Wasm
- [x] Support for mocked system APIs
- [x] Improve host/guest stub generation to make mocks easier
- [ ] Support for running Wasm applications in the browser

### Storage

- [x] Object management library ("linera-views") on top of Key-Value store
      abstraction
- [x] Support for Rocksdb
- [x] Experimental support for DynamoDb
- [x] Derive macros for GraphQL
- [x] Support for ScyllaDb
- [x] Make library fully extensible by users (requires better GraphQL macros)
- [x] In-memory storage service for testing purposes
- [x] Support for Web storage (IndexedDB)
- [ ] Performance benchmarks and improvements (including faster state hashing)
- [ ] Better configuration management
- [ ] Local Write-Ahead Log
- [ ] Production-grade support for the chosen main database
- [ ] Tooling for debugging
- [ ] Make the storage library easy to use outside of Linera

### Validator Infrastructure

- [x] Simple TCP/UDP networking (used for benchmarks only)
- [x] GRPC networking
- [x] Basic frontend (aka. proxy) supporting fixed internal shards
- [x] Observability
- [x] Kubernetes support in CI
- [x] Deployment using a cloud provider
- [ ] Horizontally scalable frontend (aka. proxy)
- [ ] Dynamic shard assignment
- [ ] Cloud integration to demonstrate elastic scaling

### Web3 SDK

- [x] Traits for contract and service interfaces
- [x] Support for unit testing
- [x] Support for integration testing
- [x] Local GraphQL service to query and browse system state
- [x] Local GraphQL service to query and browse application states
- [x] Use GraphQL mutations to execute operations and create blocks
- [x] ABIs for contract and service interfaces
- [x] Allowing message sender to pay for message execution fees
- [ ] Wallet as a browser extension (no VM)
- [ ] Wallet as a browser extension (with Wasm VM)
- [ ] Easier communication with EVM chains
- [ ] Bindings to use native cryptographic primitives from Wasm
- [ ] Allowing applications to pay for user fees
- [ ] Allowing applications to use permissioned chains and public chains
