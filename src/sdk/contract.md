# Writing the Contract Binary

The contract binary is the first component of a Linera application. It can
actually change the state of the application.

To create a contract, we need to implement the `Contract` trait, which is as
follows:

```rust,ignore
#[async_trait]
pub trait Contract: WithContractAbi + ContractAbi + Send + Sized {
    /// The type used to report errors to the execution environment.
    type Error: Error + From<serde_json::Error> + From<bcs::Error> + 'static;

    /// The desired storage backend used to store the application's state.
    type Storage: ContractStateStorage<Self> + Send + 'static;

    /// Initializes the application on the chain that created it.
    async fn initialize(
        &mut self,
        context: &OperationContext,
        argument: Self::InitializationArgument,
    ) -> Result<ExecutionOutcome<Self::Message>, Self::Error>;

    /// Applies an operation from the current block.
    async fn execute_operation(
        &mut self,
        context: &OperationContext,
        operation: Self::Operation,
    ) -> Result<ExecutionOutcome<Self::Message>, Self::Error>;

    /// Applies a message originating from a cross-chain message.
    async fn execute_message(
        &mut self,
        context: &MessageContext,
        message: Self::Message,
    ) -> Result<ExecutionOutcome<Self::Message>, Self::Error>;

    /// Handles a call from another application.
    async fn handle_application_call(
        &mut self,
        context: &CalleeContext,
        argument: Self::ApplicationCall,
        forwarded_sessions: Vec<SessionId>,
    ) -> Result<ApplicationCallResult<Self::Message, Self::Response, Self::SessionState>, Self::Error>;

    /// Handles a call into a session created by this application.
    async fn handle_session_call(
        &mut self,
        context: &CalleeContext,
        session: Self::SessionState,
        argument: Self::SessionCall,
        forwarded_sessions: Vec<SessionId>,
    ) -> Result<SessionCallResult<Self::Message, Self::Response, Self::SessionState>, Self::Error>;

}
```

The full trait definition can be found
[here](https://github.com/linera-io/linera-protocol/blob/main/linera-sdk/src/lib.rs).

There's quite a bit going on here, so let's break it down and take one method at
a time.

For this application, we'll be using the `initialize` and `execute_operation`
methods.

## Initializing our Application

The first thing we need to do is initialize our application by using
`Contract::initialize`.

`Contract::initialize` is only called once when the application is created and
only on the microchain that created the application.

Deployment on other microchains will use the `Default` implementation of the
application state if `SimpleStateStorage` is used, or the `Default` value of all
sub-views in the state if the `ViewStateStorage` is used.

For our example application, we'll want to initialize the state of the
application to an arbitrary number that can be specified on application creation
using its initialization parameters:

```rust,ignore
    async fn initialize(
        &mut self,
        _context: &OperationContext,
        value: u64,
    ) -> Result<ExecutionOutcome<Self::Message>, Self::Error> {
        self.value.set(value);
        Ok(ExecutionOutcome::default())
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
