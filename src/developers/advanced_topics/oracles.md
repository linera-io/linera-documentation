# Oracles and Ethereum

> Oracles are a specific functionality of Linera chain that allows Linera
> applications to know the state of the world. One example is accessing to the
> state of Ethereum smart contract.

The oracles can be accessed via an HTTP POST operation which is part of the
`linera-sdk` API. This request is executed by the validators. It is essential
for the liveness of chains using the application that the validators have a high
chance of reading the same value for each request.

Access to the Ethereum blockchain is a particular case of oracles. The access is
provided by the `EthereumClient` type that contains the endpoint to the Ethereum
client. From the Ethereum client we have access to the followings functions:

- `get_balance` for accessing the balance of an Ethereum account at a specific
  block number.

- `read_events` for reading the event from a specified Ethereum smart contract
  from one block to a last block.

- `non_executive_call` for executing a function in an Ethereum smart contract at
  a specific block, with the result not being included in the chain.

None of those functions are changing the state of the Ethereum blockchain. They
are all about observing the chain. All those functions take a specific block
number in input since otherwise different validators could read different number
of blocks.

The smart contract `ethereum-tracker` provides one example of such a contract
and the end-to-end test `test_wasm_end_to_end_ethereum_tracker` how the
interaction is actually done.
