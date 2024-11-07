# Writing the Service Binary

The service binary is the second component of a Linera application. It is
compiled into a separate Bytecode from the contract and is run independently. It
is not metered (meaning that querying an application's service does not consume
gas), and can be thought of as a read-only view into your application.

Application states can be arbitrarily complex, and most of the time you don't
want to expose this state in its entirety to those who would like to interact
with your app. Instead, you might prefer to define a distinct set of queries
that can be made against your application.

The `Service` trait is how you define the interface into your application. The
`Service` trait is defined as follows:

```rust,ignore
pub trait Service: WithServiceAbi + ServiceAbi + Sized {
    /// Immutable parameters specific to this application.
    type Parameters: Serialize + DeserializeOwned + Send + Sync + Clone + Debug + 'static;

    /// Creates a in-memory instance of the service handler.
    async fn new(runtime: ServiceRuntime<Self>) -> Self;

    /// Executes a read-only query on the state of this application.
    async fn handle_query(&self, query: Self::Query) -> Self::QueryResponse;
}
```

The full service trait definition can be found
[here](https://github.com/linera-io/linera-protocol/blob/{{#include
../../../.git/modules/linera-protocol/HEAD}}/linera-sdk/src/lib.rs).

Let's implement `Service` for our counter application.

First, we create a new type for the service, similarly to the contract:

```rust,ignore
pub struct CounterService {
    state: Counter,
}
```

Just like with the `CounterContract` type, this type usually has two types: the
application `state` and the `runtime`. We can omit the fields if we don't use
them, so in this example we're omitting the `runtime` field, since its only used
when constructing the `CounterService` type.

We need to generate the necessary boilerplate for implementing the service
[WIT interface](https://component-model.bytecodealliance.org/design/wit.html),
export the necessary resource types and functions so that the service can be
executed. Fortunately, there is a macro to perform this code generation, so just
add the following to `service.rs`:

```rust,ignore
linera_sdk::service!(CounterService);
```

Next, we need to implement the `Service` trait for `CounterService` type. The
first step is to define the `Service`'s associated type, which is the global
parameters specified when the application is instantiated. In our case, the
global parameters aren't used, so we can just specify the unit type:

```rust,ignore
#[async_trait]
impl Service for CounterService {
    type Parameters = ();
}
```

Also like in contracts, we must implement a `load` constructor when implementing
the `Service` trait. The constructor receives the runtime handle and should use
it to load the application state:

```rust,ignore
    async fn load(runtime: ServiceRuntime<Self>) -> Self {
        let state = Counter::load(ViewStorageContext::from(runtime.key_value_store()))
            .await
            .expect("Failed to load state");
        Ok(CounterService { state })
    }
```

Services don't have a `store` method because they are read-only and can't
persist any changes back to the storage.

The actual functionality of the service starts in the `handle_query` method. We
will accept GraphQL queries and handle them using the
[`async-graphql` crate](https://github.com/async-graphql/async-graphql). To
forward the queries to custom GraphQL handlers we will implement in the next
section, we use the following code:

```rust,ignore
    async fn handle_query(&mut self, request: Request) -> Response {
        let schema = Schema::build(
            // implemented in the next section
            QueryRoot { value: *self.state.value.get() },
            // implemented in the next section
            MutationRoot {},
            EmptySubscription,
        )
        .finish();
        schema.execute(request).await
    }
}
```

Finally, as before, the following code is needed to incorporate the ABI
definitions into your `Service` implementation:

```rust,ignore
impl WithServiceAbi for Counter {
    type Abi = counter::CounterAbi;
}
```

## Adding GraphQL compatibility

Finally, we want our application to have GraphQL compatibility. To achieve this
we need a `QueryRoot` to respond to queries and a `MutationRoot` for creating
serialized `Operation` values that can be placed in blocks.

In the `QueryRoot`, we only create a single `value` query that returns the
counter's value:

```rust,ignore
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

In the `MutationRoot`, we only create one `increment` method that returns a
serialized operation to increment the counter by the provided `value`:

```rust,ignore
struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn increment(&self, value: u64) -> Vec<u8> {
        bcs::to_bytes(&value).unwrap()
    }
}
```

We haven't included the imports in the above code; they are left as an exercise
to the reader (but remember to import `async_graphql::Object`). If you want the
full source code and associated tests check out the [examples
section](https://github.com/linera-io/linera-protocol/blob/{{#include ../../../.git/modules/linera-protocol/HEAD}}/examples/counter/src/service.rs)
on GitHub.
