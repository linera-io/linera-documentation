# Application Binary Interface (ABI)

The Linera Application Binary Interface (ABI) defines how to interact with applications, including the data
structures, data types, and functions exposed by on-chain contracts and services,
across different architectures.

For a reference guide to the ABI check out the [crate docs](TODO).

## Building your ABI

### Defining your ABI

The core of your application must implement the `Abi` trait, which includes all
types that your application
exports. The `Abi` trait combines the `ContractAbi` and `ServiceAbi` traits.

```rust,ignore
pub trait Abi: ContractAbi + ServiceAbi {}
```

Both implementations can be found in `src/lib.rs`.

### Contract ABI

The `ContractAbi` trait defines the data types that your application uses in a
contract. Each type represents a specific part of the contract's behavior:

```rust,ignore
/// A trait that includes all the types exported by a Linera application contract.
pub trait ContractAbi {
    /// Immutable parameters specific to this application (e.g. the name of a token).
    type Parameters: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// Initialization argument passed to a new application on the chain that created it
    /// (e.g. an initial amount of tokens minted).
    type InitializationArgument: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The type of operation executed by the application.
    type Operation: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The type of effect executed by the application.
    type Effect: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The argument type when this application is called from another application on the same chain.
    type ApplicationCall: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The argument type when a session of this application is called from another
    /// application on the same chain.
    type SessionCall: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The type for the state of a session.
    type SessionState: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The response type of an application call.
    type Response: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;
}
```

All these types must implement the `Serialize`, `DeserializeOwned`, `Send`, `Sync`,
`Debug` traits, and have a `'static` lifetime.

In the case of our Counter example, we would like to change our `InitializationArgument`, `Operation` to `u64`, like so:

```rust,ignore
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
/// A trait that includes all the types exported by a Linera application service.
pub trait ServiceAbi {
    /// Immutable parameters specific to this application (e.g. the name of a token).
    type Parameters: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The type of a query receivable by the application's service.
    type Query: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// The response type of the application's service.
    type QueryResponse: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;
}
```

For our Counter example, we'll be using GraphQL to query our application so our `ServiceAbi`
should reflect that:

```rust,ignore
impl ServiceAbi for CounterAbi {
    type Query = async_graphql::Request;
    type QueryResponse = async_graphql::Response;
    type Parameters = ();
}
```

### Contract Marker Traits

In `contract.rs` and `service.rs` there are implementations of `WithContractAbi` and `WithServiceAbi`.

The marker traits are used to easily import contract and service types respectively.
