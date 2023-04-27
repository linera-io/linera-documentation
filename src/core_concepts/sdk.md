# Linera SDK

In this section we'll be exploring the Linera SDK by building a simple counter application.

This is going to cover most facets of building an app, with the notable exception of the front-end
which is covered in a future section.

## Linera SDK Crate

The `linera-sdk` crate exposes the basic traits required to create a Linera
application.

This section takes you over the steps to create a full Web 3 application with a
Linera application for the back end and a React front end.

## Creating your Linera Project

To create your Linera project, use the `linera project new` command to setup
the scaffolding and requisite files:

```bash
./linera project new ../../linera-examples/my-counter
```

`linera project new` bootstraps your project by creating the following key files:

- `Cargo.toml`: your project's manifest filled with the necessary dependencies to create an app
- `state.rs`: the file which holds your application's state
- `contract.rs`: the file which holds your application's contract, and the binary target for the contract bytecode
- `service.rs`: the file which holds your application's service, and the binary target for the service bytecode

## Creating the State

The `struct` which defines your application's state can be found in `state.rs`.

To represent our Counter, all we're going to need a single `u128`. To persist
the counter we'll be using Linera's [view](../advanced_topics/views.md) paradigm.

Views are a little like an [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping),
however instead of mapping your datastructures to a relational database like Postgres, they are
instead mapped onto key-value stores like [RocksDB](https://rocksdb.org/).

In vanilla Rust, we might represent our Counter as so:

```rust
struct Counter {
  value: u128
}
```

However to persist your data, you'll need to replace the existing `State` struct in `state.rs
with the following view:

```rust
/// The application state.
#[derive(RootView, Debug)]
pub struct Counter<C> {
    pub value: RegisterView<C, u128>,
}
```

The `RegisterView` supports modifying a single value of type `T`. There are different types of
views for different use-cases, but the majority of common data structures have already been implemented:

- A `Vec` maps to a `CollectionView`
- A `HashMap` maps to a `MapView`
- A `Queue` maps to a `QueueView`

For an exhaustive list refer to the Views [documentation](TODO).

## Creating the Contract

The `Contract` is the first component of your Linera application. It can
actually change the state of the application.

To create a contract, we need to implement the `Contract` trait, which is
as follows:

```rust
#[async_trait]
pub trait Contract: Sized {
    /// Message reports for application execution errors.
    type Error: Error;
    /// The desired storage backend to use to store the application's state.
    type Storage;

    /// Initializes the application on the chain that created it.
    async fn initialize(
        &mut self,
        context: &OperationContext,
        argument: &[u8],
    ) -> Result<ExecutionResult, Self::Error>;

    /// Applies an operation from the current block.
    async fn execute_operation(
        &mut self,
        context: &OperationContext,
        operation: &[u8],
    ) -> Result<ExecutionResult, Self::Error>;

    /// Applies an effect originating from a cross-chain message.
    async fn execute_effect(
        &mut self,
        context: &EffectContext,
        effect: &[u8],
    ) -> Result<ExecutionResult, Self::Error>;

    /// Handles a call from another application.
    async fn handle_application_call(
        &mut self,
        context: &CalleeContext,
        argument: &[u8],
        forwarded_sessions: Vec<SessionId>,
    ) -> Result<ApplicationCallResult, Self::Error>;

    /// Handles a call into a session created by this application.
    async fn handle_session_call(
        &mut self,
        context: &CalleeContext,
        session: Session,
        argument: &[u8],
        forwarded_sessions: Vec<SessionId>,
    ) -> Result<SessionCallResult, Self::Error>;
}
```

There's quite a bit going on here, so let's break it down and take one method at a time.

For this application, we'll be using the `initialize` and `execute_operation` command.

### Initialising our Application

The first thing we need to do is initialize our application by using `Contract::initialize`.

`Contract::initialize` is only called once when the application is created and only on the microchain that
created the application.

Deployment on other microchains will use the `Default` implementation of the application state if
`SimpleStateStorage` is used, or the Default value of all sub-views in the state if the `ViewStateStorage` is used.

For our `Counter` application, we'll want to initialize the state of the application to an arbitrary number that can
be specified on application creation using its initialization parameters:

```rust
    async fn initialize(
        &mut self,
        _context: &OperationContext,
        argument: &[u8],
    ) -> Result<ExecutionResult, Self::Error> {
        self.value.set(bcs::from_bytes(argument)?);
        Ok(ExecutionResult::default())
    }
```

> Note: We're using the [bcs](https://crates.io/crates/bcs) crate for serializing and deserializing values.
> This is a recurring theme throughout the Linera project. Using BCS for serialization is important
> because it enforces canonical serialization, meaning that every value of a given type has a **single
> valid representation**. This is especially important when computing hashes, signatures and certificates.

### Implementing the Increment Operation

Now that we have our counter's state and a way to initialize it to any value we would like, a way to increment
our counter's value. Changes made by block proposers to application states are broadly called 'operations'.

To create a new operation, we need to use the method `Contract::execute_operation`. In the counter's case,
it will be receiving a `u128` which needs to be deserialized and the used to increment the counter state like so:

```rust
    async fn execute_operation(
        &mut self,
        _context: &OperationContext,
        operation: &[u8],
    ) -> Result<ExecutionResult, Self::Error> {
        let increment: u128 = bcs::from_bytes(operation)?;
        let value = self.value.get_mut();
        *value += increment;
        Ok(ExecutionResult::default())
    }
```

## Creating the Service

The `Service` is the second component of your Linera application. It is compiled
into a separate Bytecode from the contract and is run independently. It is not
metered (meaning that querying an application's service does not consume gas),
and can be thought of as a read-only view into your application.

Your application state can be arbitrarily complex, and most of the time you
don't
want to expose this state in its entirety to those who would like to interact
with your app. Instead, you might prefer to define a distinct set of queries
that
can be made against your application.

The `Service` trait is how you define the interface into your application.
The `Service` trait is defined as follows:

```rust
#[async_trait]
pub trait Service {
    /// Message reports for service execution errors.
    type Error: Error;
    /// The desired storage backend to use to read the application's state.
    type Storage;

    /// Executes a read-only query on the state of this application.
    async fn query_application(
        self: Arc<Self>,
        context: &QueryContext,
        argument: &[u8],
    ) -> Result<Vec<u8>, Self::Error>;
}
```

Let's implement `Service` for our counter application.

First, we want to generate the necessary boilerplate for implementing the
service WIT interface, export the necessary resource types and functions so that
the host (the process running the bytecode) can call the service. Happilly,
there is a macro to perform this code generation, so simply add the following
to `service.rs`:

```rust
linera_sdk::service!(Counter<ReadOnlyViewStorageContext>);
```

Notice that the Counter context is `ReadOnlyViewStorageContext`. This ensures
that the host has a read-only view on the application's state.

Next, we need to implement the `Service` for `Counter`. To do this we need to
define `Service`'s associated types and implement `query_application`, as well
as define the `Error` type:

```rust
#[async_trait]
impl<C> Service for Counter<C>
    where
        C: Context + Send + Sync + Clone + 'static,
        ViewError: From<C::Error>,
{
    type Error = Error;
    type Storage = ViewStateStorage<Self>;

    async fn query_application(
        self: Arc<Self>,
        _context: &QueryContext,
        argument: &[u8],
    ) -> Result<Vec<u8>, Self::Error> {
        let graphql_request: async_graphql::Request = serde_json::from_slice(argument).map_err(|_| Error::InvalidQuery)?;
        let schema = Schema::build(self.clone(), MutationRoot {}, EmptySubscription).finish();
        let res = schema.execute(graphql_request).await;
        Ok(serde_json::to_vec(&res).unwrap())
    }
}

/// An error that can occur during the contract execution.
#[derive(Debug, Error, Eq, PartialEq)]
pub enum Error {
    /// Invalid query argument; Counter application only supports a single (empty) query.
    #[error(
    "Invalid query argument; Counter application only supports JSON encoded GraphQL queries"
    )]
    InvalidQuery,
}
```

Notice, that the input `argument` and returned `Vec<u8>` are both simple byte
arrays. Therefore, the inputs and outputs made to the service can be effectively
arbitrary. In our case, we'll be using the existing Linera GraphQL
infrastructure to make our app easy for a graphical front end to consume.

The final piece of the the service is the `MutationRoot`. This is a convencience
schema which is used for GraphQL introspection queries:

```rust
struct MutationRoot;

#[Object]
impl MutationRoot {
    #[allow(unused)]
    async fn execute_operation(&self, operation: CounterOperation) -> Vec<u8> {
        bcs::to_bytes(&operation).unwrap()
    }
}
```

We haven't included the imports in the above code; they are left as an
exercise to the reader. If you want the full source code and associated tests
check out
the [examples section](https://github.com/linera-io/linera-protocol/blob/main/linera-examples/counter-graphql/src/service.rs)
on GitHub.

## Variables types

The key variables from the linera-sdk modules that are important are

- The `Timestamp` in microsecond is the unix time, that is from 1970-01-01 00:00:00. See the example `crowd-funding` where
  it is used for implementing a deadline in an application.
- The `ChainId` on which the smart contracts is run. This is important when transfering from one microchain to another.
- The `Amount` for the amount of money.

## Deploying your Application

To deploy your application, you first need to navigate to `target/debug` where the `linera` binary is located.

1. The location of the contract bytecode
2. The location of the service bytecode
3. The hex encoded initialization arguments

```bash
./linera --storage rocksdb:linera.db --wallet wallet.json --max-pending-messages 10000 publish_and_create \
    ../../linera-examples/target/wasm32-unknown-unknown/release/my_counter_contract.wasm \
    ../../linera-examples/target/wasm32-unknown-unknown/release/my_counter_service.wasm \
    00
```

## Building a Front End for your Application

// todo

## Running your Web 3 App

// todo
