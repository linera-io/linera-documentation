# Main features

**Infrastructure**

- Finality time under 0.5 seconds for most blocks, including a certificate of
  execution.

- New microchains created in one transaction from an existing chain.

- No theoretical limit in the number of microchains, hence the number of
  transactions per second (TPS).

- Bridge-friendly block headers compatible with EVM signatures

**On-chain applications**

- Rich programming model allowing applications to distribute computation across
  chains using asynchronous messages, shared immutable data, and event streams.

- Full synchronous composability inside each microchain.

- Support for heavy (multi-second) transactions and direct oracle queries to
  external web services and data storage layers.

**Web client and wallet infrastructure**

- Real-time push-notifications from validators to web clients.

- Block synchronization and VM execution for selected microchains, allowing
  instant pre-confirmation of user transactions.

- Trustless reactive programming using familiar Web2 frameworks.

- On-chain applications programmed in Rust to run on Wasm, or Solidity on
  EVM(\*).

_Features marked with (\*) are under active development on the main branch._
