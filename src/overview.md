# Overview

Linera is a decentralized infrastructure optimized for web3 applications that require processing high volumes of time-sensitive transactions created by many users in parallel.

The core idea of the Linera protocol is to give each user a lightweight blockchain, called a _microchain_, and to run all the microchains in parallel in a single set of validators.

## How does it work?

Each Linera user _owns_ one or several microchains. Concretely, the _owner_ of a chain chooses when to add a new block in the chain and what goes inside the block. Users typically add new blocks to their chains to process _incoming messages_ or to execute secure _operations_ on their accounts, for instance to transfer assets to another user.

Importantly, validators ensure that new blocks are _valid_, that is, can be safely executed according to the rules of the infrastructure. For instance, a block initiating a transfer from the wrong account or from an account with insufficient funds will be rejected.

Linera applications are meant to be multi-chain: once published and initialized, applications are deployed automatically to the chains where they are needed. To coordinate the state of an application across chains, Linera provides developers with the ability to exchange cheap and efficient cross-chain asynchronous messages. <!-- Incoming messages from another chains are first placed into an inbox. They are executed later when they are picked in a block of the receiving chain. -->
Inside a chain, applications may compose arbitrarily using synchronous function calls.

## How does Linera compare to existing multi-chain infrastructure?

Linera is the first infrastructure designed to support an arbitrary number of lightweight user chains.

In existing multi-chain infrastructures, each chain runs a full blockchain protocol in a separate set of validators. Creating a new chain or exchanging messages between chains is expensive. As a result, the total number of chains is generally limited. Some chains may be specialized to a given use case: these are called "app chains".

In contrast, Linera is optimized for a large number of user chains:

- Users only create blocks in their chain when needed;

- Creating a microchain does not require onboarding validators;

- Microchains communicate efficiently using the internal networks of validators;

- Validators are internally sharded (like a regular web service) and may adjust their capacity elastically by adding or removing internal workers.

<!--Linera integrates many chains in a unique set of validators, which greatly facilitates cross-chain communication. The execution model of Linera is designed to be language-agnostic and developer-friendly, and Linera applications are composable and multi-chain. Linera also relies on delegated proof of stake (DPoS) for security and supports regularly changing sets of validators. Microchains are designed to be auditable independently, allowing for distributed audits by the community.-->

## Why build on top of Linera?

We believe that many high-value use cases are currently out of reach of existing web3 infrastructure because of the challenges of serving many active users simultaneously without degrading user experience. High-value use cases
that require processing time-sensitive transactions created by many simultaneous users include:

- real-time micro-payments and micro-rewards,

- social data feeds,

- marketplaces for software (e.g. based on a decentralized software repository),

- marketplaces for AI.

Lightweight user chains are instrumental in providing elastic scalability but they have other benefits as well. Because user chains have fewer blocks than traditional blockchain, we intend to embed the full-nodes of user chains in user wallets, notably browser extensions and mobile devices.
