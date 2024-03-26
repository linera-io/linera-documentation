# Writing the Contract Binary

The contract binary is the first component of a Linera application. It can
actually change the state of the application.

To create a contract, we need to create a new type and implement the `Contract`
trait for it, which is as follows:

```rust,ignore
#[async_trait]
pub trait Contract: WithContractAbi + ContractAbi + Send + Sized {
    /// The type used to report errors to the execution environment.
    type Error: Error + From<serde_json::Error> + From<bcs::Error> + 'static;

    /// The type used to store the persisted application state.
    type State: Sync;

    /// The desired storage backend used to store the application's state.
    type Storage: ContractStateStorage<Self> + Send + 'static;

    /// The type of message executed by the application.
    type Message: Serialize + DeserializeOwned + Send + Sync + Debug + 'static;

    /// Creates a in-memory instance of the contract handler from the application's `state`.
    async fn new(state: Self::State, runtime: ContractRuntime<Self>) -> Result<Self, Self::Error>;

    /// Returns the current state of the application so that it can be persisted.
    fn state_mut(&mut self) -> &mut Self::State;

    /// Initializes the application on the chain that created it.
    async fn initialize(
        &mut self,
        argument: Self::InitializationArgument,
    ) -> Result<(), Self::Error>;

    /// Applies an operation from the current block.
    async fn execute_operation(
        &mut self,
        operation: Self::Operation,
    ) -> Result<Self::Response, Self::Error>;

    /// Applies a message originating from a cross-chain message.
    async fn execute_message(&mut self, message: Self::Message) -> Result<(), Self::Error>;

    /// Finishes the execution of the current transaction.
    async fn finalize(&mut self) -> Result<(), Self::Error> {
        Self::Storage::store(self.state_mut()).await;
        Ok(())
    }
}
```

The full trait definition can be found
[here](https://github.com/linera-io/linera-protocol/blob/main/linera-sdk/src/lib.rs).

There's quite a bit going on here, so let's break it down and take one method at
a time.

For this application, we'll be using the `initialize` and `execute_operation`
methods.

## The Contract handler lifecycle

To implement the application contract, we first create a type to be the contract
handler:

```rust
pub struct CounterContract {
    state: Counter,
    runtime: ContractRuntime<Self>,
}
```

This type usually contains at least two fields: the persistent `state` defined
earlier and a handle to the runtime. The runtime provides access to information
about the current execution and also allows sending messages, among other
things. Other fields can be added, and they can be used to store volatile data
that only exists while the current transaction is being executed, and discarded
afterwards.

When a transaction is executed, first the application's state is loaded, then
the contract handler type is created by calling the `Contract::new` method. This
method receives the state and a handle to the runtime that the contract handler
can use. For our implementation, we will just store the received parameters:

```rust,ignore
    async fn new(state: Counter, runtime: ContractRuntime<Self>) -> Result<Self, Self::Error> {
        CounterContract { state, runtime }
    }
```

When the transaction finishes executing successfully, there's a final step where
all loaded application contracts are allowed to `finalize`, similarly to
executing a destructor. The default implementation of `finalize` just persists
the application's state, and that's why we must provide it access to the state
through the `state_mut` method:

```rust,ignore
    fn state_mut(&mut self) -> &mut Self::State {
        &mut self.state
    }
```

Applications may want to override the `finalize` method in more advanced
scenarios, but they must ensure the don't forget to *persist* their state if
they do so. For more information see the
[Contract finalization section](../advanced_topics/contract_finalize.md).

## Initializing our Application

The first thing that happens when an application is created from a bytecode is
that it is initialized. This is done by calling the contract handler's
`Contract::initialize` method.

`Contract::initialize` is only called once when the application is created and
only on the microchain that created the application.

Deployment on other microchains will use the `Default` implementation of the
application state if `SimpleStateStorage` is used, or the `Default` value of all
sub-views in the state if the `ViewStateStorage` is used.

For our example application, we'll want to initialize the state of the
application to an arbitrary number that can be specified on application creation
using its initialization parameters:

```rust,ignore
    async fn initialize(&mut self, value: u64) -> Result<(), Self::Error> {
        self.state.value.set(value);
        Ok(())
    }
```

## Implementing the Increment Operation

Now that we have our counter's state and a way to initialize it to any value we
would like, a way to increment our counter's value. Changes made by block
proposers to application states are broadly called 'operations'.

To create a new operation, we need to use the method
`Contract::execute_operation`. In the counter's case, it will be receiving a
`u64` which is used to increment the counter:

```rust,ignore
    async fn execute_operation(
        &mut self,
        _context: &OperationContext,
        operation: u64,
    ) -> Result<ExecutionOutcome<Self::Message>, Self::Error> {
        let current = self.value.get();
        self.value.set(current + operation);
        Ok(ExecutionOutcome::default())
    }
```

## Declaring the ABI

Finally, to link our `Contract` trait implementation with the ABI of the
application, the following code is added:

```rust,ignore
impl WithContractAbi for Counter {
    type Abi = counter::CounterAbi;
}
```
