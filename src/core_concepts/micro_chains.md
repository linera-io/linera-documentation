# Microchains

This section provides an introduction to microchains - the main building block
of the Linera Protocol. For a more formal treatment of microchains, refer to
the [whitepaper](https://static1.squarespace.com/static/62d6e9b8bf6051136f934527/t/63a0b9041c1f491f5b3a9d30/1671477510830/Linera_whitepaper_v1.pdf).

## Background

A microchain is a specialized type of blockchain designed to address the
limitations of traditional blockchains by offering predictable performance,
security, and responsiveness on a large scale. Unlike regular blockchains,
microchains allow users to manage the production of blocks in their own chains
for optimal performance.

They separate the role of proposing new blocks from validating them, providing
more flexibility and configurability. Microchains can
be single-owner, permissioned, or public, depending on who is authorized to
propose blocks. They can also create new microchains, transfer control to other
users, and deactivate when needed.

## Cross-Chain Messaging

In traditional blockchains, like the original Nakamoto blockchain found in
Bitcoin, the entire state transition of the system in the form of a list of
transactions, is present in each block. Since microchains have state which is
segregated from each other, a new mechanism is required for chains to
communicate with one another.

Cross-chain messaging is a way for different blockchains or microchains to
communicate with each other asynchronously. This method allows applications and
data to be distributed across multiple chains for better scalability. When an
operation in one chain triggers a change in another chain, a cross-chain request
is created. These requests are implemented using remote procedure calls (RPCs)
within the validators' internal network, ensuring that each request is executed
only once.

Instead of immediately modifying the target chain, messages are
placed in the target chain's **inbox**, a commutative data structure where the
order of insertions does not matter. The owner(s) of the receiving chain can
then
execute an operation that picks the message from the inbox and applies its
effect to the chain state.

Below is an example set of chains sending asynchronous messages to each other
over consecutive blocks.

```
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

## Chain Ownership Semantics

Linera currently supports single owner chains. However, microchains can create
new microchains for other users, and control of a chain can be transferred to
another user by changing the owner id. A chain is permanently deactivated when
its owner id is set to `None`.

For more detail and examples on how to open and close chains, see the wallet
section on [chain management](wallet.md#opening-a-chain).

