# Overview

Linera is a decentralized protocol optimized for Web3 applications that require
guaranteed performance for an unlimited number of active users.

The core idea of the [Linera protocol](https://linera.io/whitepaper) is to run
many parallel chains, called **microchains**, in a single set of validators,
allowing chains to easily share applications, data, and liquidity.

## How does it work?

In Linera, each user wallet is given a dedicated chain, in which they can
propose blocks any time. Such chains with a single user are called **user
chains**. They are meant to be used as a personal blockspace to hold assets,
receive assets, and initiate interactions with Linera applications.

Linera users propose blocks directly to their chains. Importantly, Linera
validators ensure that all blocks are validated and finalized in the same way
across all the chains.

> Besides user chains, the Linera protocol supports two other types of
> microchains, called **multi-user** and **public** chains. Public chains are
> operated by validators, and generally used by a specific application.
> Multi-user chains are shared between several users and are generally used for
> temporary interactions, such as atomic swaps, auctions, or on-chain games.

## Main features

Infrastructure:

- Finality time under 0.5 seconds for most blocks, including a proof of
  execution.

- New microchains created in one transaction from an existing chain.

- No theoretical limit in the number of microchains, hence the number of
  transactions per second (TPS).

- Bridge-friendly block headers compatible with EVM signatures

On-chain applications:

- Rich programming model allowing applications to distribute computation across
  chains using asynchronous messages, shared immutable data, and event
  streams(\*).

- Full synchronous composability inside each microchain.

- Support for heavy (multi-second) transactions and direct oracle queries to
  external web services and data storage layers.

Web client and wallet infrastructure:

- Real-time push-notifications from validators to web clients.

- Block synchronization and VM execution for selected microchains, allowing
  instant pre-confirmation of user transactions.

- Trustless reactive programming using familiar Web2 frameworks.

- On-chain applications programmed in Rust to run on Wasm, or Solidity on
  EVM(\*).

_Features marked with (\*) are planned for Q2'25._

## How does Linera compare to traditional multi-chain protocols?

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

- Users may run heavy transactions in their microchain without affecting other
  users.
