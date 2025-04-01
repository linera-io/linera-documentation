# Roadmap

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

- Only user chains are currently documented in this manual. Multi-user chains
  (aka "temporary" chains) were recently added. Support for public chains is in
  progress.

The main development workstreams of Linera, beyond its SDK, can be broken down
as follows.

### Core Protocol

- [x] User chains
- [x] Multi-user chains (core protocol only)
- [x] Cross-chain messages
- [x] Cross-chain pub/sub channels (initial version)
- [x] Bytecode publishing
- [x] Application creation
- [x] Reconfigurations of validators
- [x] Support for gas fees
- [x] Support for storage fees and storage limits
- [x] External service (aka. "Faucet") to help users create their first chain
- [x] Multi-user chains (adding operation access control, demo of atomic swaps,
      etc)
- [x] Avoid repeatedly loading chain states from storage
- [x] Blob storage usable by system and user applications
      (generalizing/replacing bytecode storage)
- [ ] Support for easy onboarding of user chains into a new application
      (removing the need to accept requests)
- [ ] Replace pub/sub channels with data streams (removing the need to accept
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
- [x] Support for running Wasm applications in the browser

### Storage

- [x] Object management library ("linera-views") on top of Key-Value store
      abstraction
- [x] Support for Rocksdb
- [x] Experimental support for DynamoDB
- [x] Derive macros for GraphQL
- [x] Support for ScyllaDB
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
- [x] Wallet as a browser extension (no VM)
- [x] Wallet as a browser extension (with Wasm VM)
- [ ] Easier communication with EVM chains
- [ ] Bindings to use native cryptographic primitives from Wasm
- [ ] Allowing applications to pay for user fees
- [ ] Allowing applications to use multi-user chains and public chains
