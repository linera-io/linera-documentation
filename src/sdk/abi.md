# Application Binary Interface (ABI)

The Linera Application Binary Interface (ABI) defines how to interact with applications, including the data
structures, data types, and functions exposed by on-chain contracts and services,
across different architectures.

For a reference guide to the ABI check out the [crate docs](TODO).

## Building your ABI

### Defining your ABI

The library part of your application (generally in `src/lib.rs`) must define a public
empty struct that implements the `Abi` trait. The `Abi` trait combines the `ContractAbi`
and `ServiceAbi` traits to include the types that your application exports.

```rust,ignore
{{#include ../../linera-protocol/linera-base/src/abi.rs:abi}}
```

### Contract ABI

The `ContractAbi` trait defines the data types that your application uses in a
contract. Each type represents a specific part of the contract's behavior:

```rust,ignore
{{#include ../../linera-protocol/linera-base/src/abi.rs:contract_abi}}
```

All these types must implement the `Serialize`, `DeserializeOwned`, `Send`, `Sync`,
`Debug` traits, and have a `'static` lifetime.

In the case of our Counter example, we would like to change our `InitializationArgument`, `Operation` to `u64`, like so:

```rust
# extern crate linera_base;
# use linera_base::abi::ContractAbi;
# struct CounterAbi;
impl ContractAbi for CounterAbi {
    type InitializationArgument = u64;
    type Parameters = ();
    type Operation = u64;
    type ApplicationCall = ();
    type Effect = ();
    type SessionCall = ();
    type Response = ();
    type SessionState = ();
}
```

### Service ABI

The `ServiceAbi` is in principle very similar to the `ContractAbi`, just for the service
component of your application.

The `ServiceAbi` trait defines the types used by the service part of your application:

```rust,ignore
{{#include ../../linera-protocol/linera-base/src/abi.rs:service_abi}}
```

For our Counter example, we'll be using GraphQL to query our application so our `ServiceAbi`
should reflect that:

```rust
# extern crate linera_base;
# extern crate async_graphql;
# use linera_base::abi::ServiceAbi;
# struct CounterAbi;
impl ServiceAbi for CounterAbi {
    type Query = async_graphql::Request;
    type QueryResponse = async_graphql::Response;
    type Parameters = ();
}
```

### Contract Marker Traits

In `contract.rs` and `service.rs` there are implementations of `WithContractAbi` and `WithServiceAbi`.

The marker traits are used to easily import contract and service types respectively.
