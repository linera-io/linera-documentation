# Overview

Linera is a decentralized infrastructure optimized for Web3 applications that require processing high volumes of time-sensitive transactions created by many users in parallel.

The core idea of the Linera protocol is to run many lightweight blockchains, called **microchains**, in parallel in a single set of validators.

## How does it work?

In Linera, end users (or rather their wallets) are expected to operate their own microchains, called **user chains**. The owner of a chain chooses when to add new blocks to the chain and what goes inside the blocks.

Users may add new blocks to their chains in order to process **incoming messages** from other chains or to execute secure **operations** on their accounts, for instance to transfer assets to another user.

Importantly, validators ensure that all new blocks are **valid**. For instance, transfer operations must originate from accounts with sufficient funds; and incoming messages must have been actually sent from another chain. Blocks are verified by validators in the same way for every chain.

A Linera **application** is a Wasm program that defines its own state and operations.
Users can publish bytecode and initialize an application on one chain, and it will be
automatically deployed to all chains where it is needed, with a separate state on each
chain.

To ensure coordination across chains, an application may rely on asynchronous **cross-chain
messages**. Message payloads are application-specific and opaque to the
rest of the system.

The number of applications present on a single chain is not limited. On the same chain, applications are **composed** as usual using synchronous calls.

The current Linera SDK uses **Rust** as a source language to create Wasm applications. It relies on the normal Rust toolchains so that Rust programmers can work in their preferred environments.

Linera applications are structured using the familiar notion of **Rust crate**: the external interfaces of an application (including initialization parameters, operations, messages, and cross-application calls) generally go into the library part of its crate, while the core of each application is compiled into binary files for the Wasm architecture.

## How does Linera compare to existing multi-chain infrastructure?

Linera is the first infrastructure designed to support many chains in parallel, and notably an arbitrary number of **user chains** meant to be operated by user wallets.

In traditional multi-chain infrastructures, each chain usually runs a full blockchain protocol in a separate set of validators. Creating a new chain or exchanging messages between chains is expensive. As a result, the total number of chains is generally limited. Some chains may be specialized to a given use case: these are called "app chains".

In contrast, Linera is optimized for a large number of user chains:

- Users only create blocks in their chain when needed;

- Creating a microchain does not require onboarding validators;

- All chains have the same level of security;

- Microchains communicate efficiently using the internal networks of validators;

- Validators are internally sharded (like a regular web service) and may adjust their capacity elastically by adding or removing internal workers.

The specifications of the Linera protocol (see the [whitepaper](https://linera.io/whitepaper)) also include other types of microchains, called "permissioned" and "public". Public chains are operated by validators and similar to classical blockchains in this regard. Permissioned chains are meant to be used for temporary interactions between users, such as atomic swaps.

## Why build on top of Linera?

We believe that many high-value use cases are currently out of reach of existing Web3 infrastructures because of the challenges of serving **many active users** simultaneously without degrading user experience (unpredictable fees, latency, etc).

Examples of applications that require processing time-sensitive transactions created by many simultaneous users include:

- real-time micro-payments and micro-rewards,

- social data feeds,

- real-time auction systems,

- turn-based games,

- version control systems for software, data pipelines, or AI training pipelines.

Lightweight user chains are instrumental in providing elastic scalability but they have other benefits as well. Because user chains have fewer blocks than traditional blockchains, in Linera, the full-nodes of user chains will be embedded into the users' wallets, typically deployed as a browser extension.

This means that Web UIs connected to a wallet will be able to query the state of the user chain directly (no API provider, no light client) using familiar frameworks (React/GraphQL). Furthermore, wallets will be able to leverage the full node as well for security purposes, including to display meaningful confirmation messages to users.

## What is the current state of the development of Linera?

The current [open-source implementation](https://github.com/linera-io/linera-protocol) of Linera is under active development. Yet, it already includes a Web3 SDK with the necessary features to prototype simple Web3 applications and test them locally on the same machine. Notably, Web UIs (possibly reactive) can already be built on top of Wasm-embedded GraphQL services, and tested locally in the browser.

The main limitations of our current Web3 SDK include:

- Web UIs need to query a local HTTP service acting as a wallet. This setup is meant to be temporary and for testing only: in the future, web UIs will securely connect to a Wallet installed as a browser extension, as usual.

- Gas metering is activated in the Wasm VM but the accounting and purchase of fuel is not implemented yet. (As a placeholder, apps are given a fixed amount of fuel for free at every block.) Other aspects of the systems that incur costs to validators (e.g. uploading large bytecode) are also not yet protected by fees and/or hard limits.

- Only user chains are currently available for testing. Support for other types of chain (called "public" and "permissioned") will be added later.

The main development workstreams of Linera, beyond its SDK, can be broken down as follows.

### [Core Protocol](https://github.com/orgs/linera-io/projects/2)

- [x] User chains
- [x] Permissioned chain (core protocol only)
- [x] Cross-chain messages
- [x] Cross-chain pub/sub channels (initial version)
- [x] Bytecode publishing
- [x] Application creation
- [x] Reconfigurations of validators
- [x] Fixed gas limits for user applications (placeholder)
- [ ] Support for easy onboarding of user chains into a new application
- [ ] Permissioned chains (missing operation access control, demo of atomic swaps)
- [ ] Public chains (missing leader election, inbox constraints)
- [ ] Improved pub/sub channels (removing the need to accept subscriptions)
- [ ] Gas fees (including system operations and messaging)
- [ ] Blob storage for applications (generalizing bytecode storage)
- [ ] External services to help users create their first chain and migrate their chain to new configurations
- [ ] Support for archiving chains
- [ ] Wallet-friendly chain clients (compile to Wasm/JS, do not maintain execution states for other chains)
- [ ] General tokenomics and incentives for all stakeholders
- [ ] Governance on the admin chain (e.g. DPoS, onboarding of validators)
- [ ] Auditing procedures

### [Wasm VM integration](https://github.com/orgs/linera-io/projects/3)

- [x] Support for the Wasmer VM
- [x] Support for the Wasmtime VM (experimental)
- [x] Test gas metering and deterministic execution across VMs
- [x] Composing Wasm applications on the same chain (initial version)
- [x] Enhanced composability with "sessions"
- [x] Support for non-blocking (yet deterministic) calls to storage
- [x] Support for read-only GraphQL services in Wasm
- [x] Support for mocked system APIs (initial version)
- [ ] More efficient cross-application calls and better reentrancy
- [ ] Improve host/guest stub generation to make mocks easier (currently wit-bindgen)
- [ ] Compile user full node to Wasm/JS

### [Storage](https://github.com/orgs/linera-io/projects/1)

- [x] Object management library ("linera-views") on top of Key-Value store abstraction
- [x] Support for Rocksdb
- [x] Preliminary support for DynamoDb
- [x] Preliminary derive macros for GraphQL
- [ ] Make library fully extensible by users (requires better GraphQL macros)
- [ ] Support additional remote databases
- [ ] Support global object locks (needed for dynamic sharding)
- [ ] Tooling for debugging and performance diagnostics
- [ ] Make the storage library easy to use outside of Linera

### [Networking](https://github.com/orgs/linera-io/projects/4)

- [x] Simple TCP/UDP networking (used for benchmarks only)
- [x] GRPC networking
- [x] Basic frontend (aka proxy) supporting fixed internal shards
- [ ] Observability
- [ ] New frontend to support dynamic shard assignment
- [ ] Cloud integration to demonstrate elastic scaling

### [Web3 SDK](https://github.com/orgs/linera-io/projects/5)

- [x] Initial traits for contract and service interfaces
- [x] Support for unit testing
- [x] Support for integration testing
- [x] Local GraphQL service to query and browse system state
- [x] Local GraphQL service to query and browse application states
- [x] Use GraphQL mutations to execute operations and create blocks
- [x] Support for unit tests (initial)
- [x] Support for integration tests
- [ ] Final (type-safe) traits for contract and service interfaces
- [ ] Support for handling gas fees
- [ ] Safety programming guidelines (including reentrancy)
- [ ] Bindings to use native cryptographic primitives from Wasm
- [ ] Allowing applications to create permissioned chains and public chains
- [ ] Wallet as a browser extension (no VM)
- [ ] Wallet as a browser extension (with Wasm VM)
