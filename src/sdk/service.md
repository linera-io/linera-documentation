# Writing the Service Binary

The service binary is the second component of a Linera application. It is compiled into a
separate Bytecode from the contract and is run independently. It is not metered (meaning
that querying an application's service does not consume gas), and can be thought of as a
read-only view into your application.

Application states can be arbitrarily complex, and most of the time you don't want to
expose this state in its entirety to those who would like to interact with your app.
Instead, you might prefer to define a distinct set of queries that can be made against
your application.

The `Service` trait is how you define the interface into your application.
The `Service` trait is defined as follows:

```rust,ignore
/// The service interface of a Linera application.
#[async_trait]
pub trait Service: WithServiceAbi + ServiceAbi {
    /// Type used to report errors to the execution environment.
    type Error: Error + From<serde_json::Error>;

    /// The desired storage backend used to store the application's state.
    type Storage: ServiceStateStorage;

    /// Executes a read-only query on the state of this application.
    async fn query_application(
        self: Arc<Self>,
        context: &QueryContext,
        argument: Self::Query,
    ) -> Result<Self::QueryResponse, Self::Error>;
}
```

The full service trait definition can be found [here](https://github.com/linera-io/linera-protocol/blob/main/linera-sdk/src/lib.rs).

Let's implement `Service` for our counter application.

First, we want to generate the necessary boilerplate for implementing the
service WIT interface, export the necessary resource types and functions so that
the host (the process running the bytecode) can call the service. Happily,
there is a macro to perform this code generation, so just add the following
to `service.rs`:

```rust,ignore
linera_sdk::service!(Counter);
```

Next, we need to implement the `Service` for `Counter`. To do this we need to
define `Service`'s associated types and implement `query_application`, as well
as define the `Error` type:

```rust,ignore
#[async_trait]
impl Service for Counter {
    type Error = Error;
    type Storage = ViewStateStorage<Self>;

    async fn query_application(
        self: Arc<Self>,
        _context: &QueryContext,
        request: Request,
    ) -> Result<Response, Self::Error> {
        let schema = Schema::build(
            // implemented in the next section
            QueryRoot { value: *self.value.get() },
            // implemented in the next section
            MutationRoot {},
            EmptySubscription,
        )
        .finish();
        Ok(schema.execute(request).await)
    }
}

/// An error that can occur during the contract execution.
#[derive(Debug, Error)]
pub enum Error {
    /// Invalid query argument; could not deserialize GraphQL request.
    #[error("Invalid query argument; could not deserialize GraphQL request")]
    InvalidQuery(#[from] serde_json::Error),
}
```

Finally, as before, the following code is needed to incorporate the ABI definitions into your
`Service` implementation:

```rust,ignore
impl WithServiceAbi for Counter {
    type Abi = counter::CounterAbi;
}
```

## Adding GraphQL compatibility

Finally, we want our application to have GraphQL compatibility. To achieve this we need a `QueryRoot`
for intercepting queries and a `MutationRoot` for introspection queries for mutations.

```rust,ignore
struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn increment(&self, value: u64) -> Vec<u8> {
        bcs::to_bytes(&value).unwrap()
    }
}

struct QueryRoot {
    value: u64,
}

#[Object]
impl QueryRoot {
    async fn value(&self) -> &u64 {
        &self.value
    }
}
```

We haven't included the imports in the above code; they are left as an exercise to the
reader (but remember to import `async_graphql::Object`). If you want the full source code
and associated tests check out the [examples
section](https://github.com/linera-io/linera-protocol/blob/main/examples/counter/src/service.rs)
on GitHub.
