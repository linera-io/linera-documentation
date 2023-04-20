# Linera SDK

## Linera SDK Crate

The `linera-sdk` crate exposes the basic traits required to create a Linera
application.

This section takes you over the steps to create a full Web 3 application with a
Linera application for the back end and a React front end.

## Creating your Linera Project

## Creating the State

## Creating the Contract

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

## Deploying your Application

## Building a Front End for your Application

## Running your Web 3 App