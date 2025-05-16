# Using EVM-Based Smart Contracts on Linera

It is possible to use Ethereum Virtual Machine (EVM)-based smart contracts on
Linera. These contracts are typically written in Solidity.

EVM smart contracts have access Linera-specific functionality of Linera through
the `Linera.sol` library which exposes necessary interfaces for integration.

This allows smart contracts originally deployed on Ethereum to be migrated to
Linera and progressively adapted to Linera’s architecture and features.

## Publishing EVM Smart Contracts

The process for publishing EVM smart contracts is similar to that for Wasm smart
contracts, with the key difference being the need to specify the virtual machine
used (the default is Wasm).

For EVM contracts, there is only one bytecode file (unlike Wasm, which requires
separate `contract` and `service` binaries). Therefore, the same file must be
passed twice:

```bash
linera publish-and-create \
  counter.bytecode counter.bytecode \
  --vm-runtime evm \
  --json-parameters "42"
```

Here, `counter.bytecode` contains the compiled contract, and "42" is passed as a
constructor argument via the `--json-parameters` flag.

Constructor arguments for the EVM contract are passed through application
parameters. Instantiation-specific arguments are provided separately.

## Calling other smart contracts.

EVM smart contracts on Linera can invoke other EVM contracts using standard
Solidity syntax.

### EVM Contracts calling Wasm smart contracts.

To call a Wasm smart contract from an EVM contract, use the following Solidity
command:

```solidity
	bytes memory return_value = Linera.try_call_application(address, input);
```

- `address`: the address of the Wasm smart contract, as a `bytes32`.
- `input`: the bytes representing the BCS-serialized `ContractAbi::Operation`
  input.

The serialization code can be generated using the `serde-reflection` crate.

### Wasm Smart Contracts calling EVM Contracts.

Wasm smart contracts can call EVM contracts using the `alloy-sol-types` crate.
This crate enables construction of Solidity-compatible types and supports RLP
serialization/deserialization.

The Wasm contract call-evm-counter demonstrates this functionality.

- For operations, the input type is `Vec<u8>`.

- For service calls, the input type is `EvmQuery`.

Note: Linera distinguishes between contract and service code execution contexts.

## Multichain EVM applications.

To operate across multiple chains, an EVM application must implement the
following functions:

```solidity
    function instantiate(bytes memory input) external
    function execute_message(bytes memory input) external
```

- `instantiate` is called on the creator chain.

- `execute_message` handles incoming cross-chain messages.

Additional SDK functions available include:

```solidity
    Linera.chain_ownership()
    Linera.read_data_blob()
    Linera.assert_data_blob_exists()
    Linera.validation_round()
    Linera.message_id()
    Linera.message_is_bouncing()
```

## Difference between EVM applications in Ethereum and Linera.

- `Reentrancy`: Reentrancy is not supported on Linera. Contracts relying on it
  will fail with a clean error.

- `Address Computation`: Contract addresses are computed differently from
  Ethereum.

- `Gas Limits`: Following Infura's practice, Linera imposes a gas limit of
  20,000,000 for service calls in EVM contracts. Contract execution is similarly
  constrained.
