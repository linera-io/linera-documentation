# Roadmap

## Testnet #1 -- Archimedes (released Nov 2024)

**SDK**

- Released Rust SDK v0.13+

- First Web demos running a Linera client in the browser

- Blob storage for user data

**Core protocol**

- Blob storage for application bytecode and user data

- Multi-user chains (e.g. used in on-chain game demo)

- Initial support for fees

**Infrastructure**

- Fixed number of workers per validator

- Onboarding of 20+ external validators

## Testnet #2 -- Babbage (planned Apr 2025)

**SDK**

- Official Web client framework

- Support for native oracles: http queries and non-deterministic computations

- Support for POW public chains

- Simplified user and application addresses

**Core protocol**

- More scalable reconfigurations

- No more "request-application" operations

- Bridge-friendly block headers compatible with EVM signatures

**Infrastructure**

- Better hotfix release process

- Support for resizing workers offline

- Multi-proxy configuration

## Testnet #3

**SDK**

- Browser extension and wallet connect

- Event streams (deprecating pub/sub channels)

- Experimental support for EVM

- Compatibility with EVM addresses

**Core protocol**

- More scalable client with partial chain execution and optimized block
  synchronization

- Execution cache for faster server-side and client-side block execution

- Protocol upgradability, including block format, virtual machines, and system
  APIs

- Simplify chain creation and support externally created microchains

**Infrastructure**

- High-TPS configuration

- Block indexing and Walrus archives

## Testnet #4

**SDK**

- Stable support for EVM

- Transaction scripts

- Application upgradability

**Core protocol**

- Governance chain

- Final tokenomics and incentives

- Public chains

- Support for archiving chains

**Infrastructure**

- Security audits

## Mainnet and beyond

**SDK**

- Account abstraction and fee masters

- Linera light clients for other chains (Solidity, Sui Move)

**Core Protocol**

- Permissionless auditing protocol

- Performance improvements

**Infrastructure**

- Support for dynamic shard assignment and elasticity

- Geographic sharding

- Support for more cloud vendors

- Native bridges
