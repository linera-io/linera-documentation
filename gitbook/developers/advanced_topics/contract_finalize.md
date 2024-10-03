# Contract Finalization

When a transaction finishes executing successfully, there's a final step where
all loaded application contracts have their `Contract::store` implementation
called. This can be seen to be similar to executing a destructor. In that sense,
applications may want to perform some final operations after execution finished.
While finalizing, contracts may send messages, read and write to the state, but
are not allowed to call other applications, because they are all also in the
process of finalizing.

While finalizing, contracts can force the transaction to fail by panicking. The
block is then rejected, even if the entire transaction's operation had succeeded
before the application's `Contract::store` was called. This allows a contract to
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

impl Contract for MyContract {
    type Message = ();
    type InstantiationArgument = ();
    type Parameters = ();

    async fn load(runtime: ContractRuntime<Self>) -> Self {
        let state = MyState::load(ViewStorageContext::from(runtime.key_value_store()))
            .await
            .expect("Failed to load state");

        MyContract {
            state,
            runtime,
            active_sessions: HashSet::new(),
        }
    }

    async fn instantiate(&mut self, (): Self::InstantiationArgument) {}

    async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
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

    async fn store(&mut self) {
        assert!(
            self.active_sessions.is_empty(),
            "Some sessions have not ended"
        );

        self.state.save().await.expect("Failed to save state");
    }
}
```
