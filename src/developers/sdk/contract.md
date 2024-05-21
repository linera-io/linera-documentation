# Writing the Contract Binary

The contract binary is the first component of a Linera application. It can
actually change the state of the application.

To create a contract, we need to create a new type and implement the `Contract`
trait for it, which is as follows:

```rust,ignore
pub trait Contract: WithContractAbi + ContractAbi + Sized {
    /// The type of message executed by the application.
    type Message: Serialize + DeserializeOwned + Debug;

    /// Immutable parameters specific to this application (e.g. the name of a token).
    type Parameters: Serialize + DeserializeOwned + Clone + Debug;

    /// Instantiation argument passed to a new application on the chain that created it
    /// (e.g. an initial amount of tokens minted).
    type InstantiationArgument: Serialize + DeserializeOwned + Debug;

    /// Creates a in-memory instance of the contract handler.
    async fn load(runtime: ContractRuntime<Self>) -> Self;

    /// Instantiates the application on the chain that created it.
    async fn instantiate(&mut self, argument: Self::InstantiationArgument);

    /// Applies an operation from the current block.
    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response;

    /// Applies a message originating from a cross-chain message.
    async fn execute_message(&mut self, message: Self::Message);

    /// Finishes the execution of the current transaction.
    async fn store(self);
}
```

The full trait definition can be found
[here](https://github.com/linera-io/linera-protocol/blob/{{#include
../../../.git/modules/linera-protocol/HEAD}}/linera-sdk/src/lib.rs).

There's quite a bit going on here, so let's break it down and take one method at
a time.

For this application, we'll be using the `load`, `execute_operation` and `store`
methods.

## The Contract Lifecycle

To implement the application contract, we first create a type for the contract:

```rust,ignore
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

When a transaction is executed, the contract type is created through a call to
`Contract::load` method. This method receives a handle to the runtime that the
contract can use, and should use it to load the application state. For our
implementation, we will load the state and create the `CounterContract`
instance:

```rust,ignore
    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = Counter::load(ViewStorageContext::from(runtime.key_value_store()))
            .await
            .expect("Failed to load state");
        CounterContract { state, runtime }
    }
```

When the transaction finishes executing successfully, there's a final step where
all loaded application contracts are called in order to do any final checks and
persist its state to storage. That final step is a call to the `Contract::store`
method, which can be thought of as similar to executing a destructor. In our
implementation we will persist the state back to storage:

```rust,ignore
    async fn store(mut self) {
        self.state.save().await.expect("Failed to save state");
    }
```

It's possible to do more than just saving the state, and the
[Contract finalization section](../advanced_topics/contract_finalize.md)
provides more details on that.

## Instantiating our Application

The first thing that happens when an application is created from a bytecode is
that it is instantiated. This is done by calling the contract's
`Contract::instantiate` method.

`Contract::instantiate` is only called once when the application is created and
only on the microchain that created the application.

Deployment on other microchains will use the `Default` value of all sub-views in
the state if the state uses the view paradigm.

For our example application, we'll want to initialize the state of the
application to an arbitrary number that can be specified on application creation
using its instatiation parameters:

```rust,ignore
    async fn instantiate(&mut self, value: u64) {
        self.state.value.set(value);
    }
```

## Implementing the Increment Operation

Now that we have our counter's state and a way to initialize it to any value we
would like, we need a way to increment our counter's value. Execution requests
from block proposers or other applications are broadly called 'operations'.

To handle an operation, we need to implement the `Contract::execute_operation`
method. In the counter's case, the operation it will be receiving is a `u64`
which is used to increment the counter by that value:

```rust,ignore
    async fn execute_operation(&mut self, operation: u64) {
        let current = self.value.get();
        self.value.set(current + operation);
    }
```

## Declaring the ABI

Finally, to link our `Contract` trait implementation with the ABI of the
application, the following code is added:

```rust,ignore
impl WithContractAbi for CounterContract {
    type Abi = counter::CounterAbi;
}
```
