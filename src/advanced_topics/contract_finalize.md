# Contract Finalization

When a transaction finishes executing successfully, there's a final step where
all loaded application contracts are allowed to `finalize`, similarly to
executing a destructor. The default implementation of `finalize` just persists
the application's state:

```rust,ignore
    /// Finishes the execution of the current transaction.
    async fn finalize(&mut self) -> Result<(), Self::Error> {
        Self::Storage::store(self.state_mut()).await;
        Ok(())
    }
```

Applications may want to override the `finalize` method, which allows performing
some clean-up operations after execution finished. While finalizing, contracts
may send messages, read and write to the state, but are not allowed to call
other applications, because they are all also finalizing.

> If `finalize` is overriden, the default implementation is **not** executed, so
> the developer must ensure that the application's state is persisted correctly.

While finalizing, contracts can force the transaction to fail by panicking or
returning an error. The block is then rejected, even if the entire transaction's
operation had succeeded before `finalize` was called. This allows a contract to
reject transactions if other applications don't follow any required constraints
it establishes after it responds to a cross-application call.

As an example, a contract that executes a cross-application call with
`Operation::StartSession` may require the same caller to perform another
cross-application call with `Operation::EndSession` before the transaction ends.

```rust,ignore
pub struct MyContract {
    state: MyState;
    runtime: ContractRuntime<Self>;
    active_sessions: HashSet<ApplicationId>;
}

#[async_trait]
impl Contract for MyContract {
    type Error = MyError;
    type State = MyState;
    type Storage = ViewStateStorage<Self>;
    type Message = ();

    async fn new(state: Self::State, runtime: ContractRuntime<Self>) -> Result<Self, Self::Error> {
        MyContract {
            state,
            runtime,
            active_sessions: HashSet::new(),
        }
    }

    fn state_mut(&mut self) -> &mut Self::State {
        &mut self.state
    }

    async fn initialize(
        &mut self,
        argument: Self::InitializationArgument,
    ) -> Result<(), Self::Error> {
        Ok(())
    }

    async fn execute_operation(
        &mut self,
        operation: Self::Operation,
    ) -> Result<Self::Response, Self::Error> {
        let caller = self.runtime
            .authenticated_caller_id()
            .expect("Missing caller ID");

        match operation {
            Operation::StartSession => {
                assert!(
                    self.active_sessions.insert(caller_id),
                    "Can't start more than one session for the same caller"
                );
            }
            Operation::EndSession => {
                assert!(
                    self.active_sessions.remove(&caller_id),
                    "Session was not started"
                );
            }
        }
    }

    async fn execute_message(&mut self, message: Self::Message) -> Result<(), Self::Error> {
        unreachable!("This example doesn't support messages");
    }

    async fn finalize(&mut self) -> Result<(), Self::Error> {
        assert!(
            self.active_sessions.is_empty(),
            "Some sessions have not ended"
        );

        Self::Storage::store(self.state_mut()).await;

        Ok(())
    }
}
```
