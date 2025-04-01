# Roadmap

## Testnet #1 -- Archimedes

SDK:

- First Web demos running a Linera client in the browser

Core protocol:

- Blob storage used internally

- Multi-user chains

Infrastructure:

- Fixed number of workers per validator

- Onboarding of external validators

## Testnet #2 -- Babbage

SDK:

- Official Web client framework

- Oracle queries

- Support for POW public chains

- Simplified user and application addresses (`AccountOwner`)

Core protocol:

- More scalable reconfigurations

- Local blob storage for user applications

- No more "request-application" operations

- Bridge-friendly block headers compatible with EVM signatures

Infrastructure:

- Better hotfix releases

- Multi-proxy configuration

## Testnet #3

SDK:

- Browser extension and wallet connect

- Event streams (deprecating pub/sub channels)

- Experimental support for EVM

- Compatibility with EVM addresses

Core protocol:

- More scalable client-side execution

- Protocol upgradability (block format, VM & SDK)

- Simplify chain creation and support "chain-as-a-service" created by other
  blockchains

Infrastructure:

- High-TPS configuration

- Block indexing and Walrus archives

## Testnet #4

SDK:

- Stable support for EVM

- Transaction scripts

- Application upgradability

Core protocol:

- Governance chain

- Final tokenomics and incentives

- Public chains

- Support for archiving chains

Infrastructure:

- Security audits

## Mainnet and beyond

SDK:

- Account abstraction and fee masters

- Linera light clients for other chains (Solidity, Sui Move)

Core Protocol

- Permissionless auditing protocol

- Performance improvements

Infrastructure:

- Support for dynamic shard assignment and elasticity

- Geographic sharding

- Support for more cloud vendors

- Native bridges
