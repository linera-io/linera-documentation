# Writing Tests

Linera applications can be tested using normal Rust unit tests or integration
tests. Unit tests use a mock runtime for execution, so it's useful for testing
the application as if it were running by itself on a single chain. Integration
tests use a simulated validator for testing. This allows creating chains and
adding blocks to them in order to test interactions between multiple microchains
and multiple applications.

Applications should consider having both types of tests. Unit tests should be
used to focus on the application's internals and core functionality. Integration
tests should be used to test how the application behaves on a more complex
environment that's closer to the real network.

> For Rust tests, the `cargo test` command can be used to run both the unit and
> integration tests.

## Unit tests

Unit tests are written beside the application's source code (i.e., inside the
`src` directory of the project). The main purpose of a unit test is to test
parts of the application in an isolated environment. Anything that's external is
usually mocked. When the `linera-sdk` is compiled with the `test` feature
enabled, the `ContractRuntime` and `SystemRuntime` types are actually mock
runtimes, and can be configured to return specific values for different tests.

### Example

A simple unit test is shown below, which tests if the application contract's
`do_something` method changes the application state.

```rust,ignore
#[cfg(test)]
mod tests {
    use crate::{ApplicationContract, ApplicationState};
    use linera_sdk::{util::BlockingWait, ContractRuntime};

    #[test]
    fn test_do_something() {
        let runtime = ContractRuntime::new();
        let mut contract = ApplicationContract::load(runtime).blocking_wait();

        let result = contract.do_something();

        // Check that `do_something` succeeded
        assert!(result.is_ok());
        // Check that the state in memory was updated
        assert_eq!(contract.state, ApplicationState {
            // Define the application's expected final state
            ..ApplicationState::default()
        });
        // Check that the state in memory is different from the state in storage
        assert_ne!(
            contract.state,
            ApplicatonState::load(ViewStorageContext::from(runtime.key_value_store()))
        );
    }
}
```

## Integration Tests

Integration tests are usually written separately from the application's source
code (i.e., inside a `tests` directory that's beside the `src` directory).

Integration tests use the helper types from `linera_sdk::test` to set up a
simulated Linera network, and publish blocks to microchains in order to execute
the application.

### Example

A simple test that sends a message between application instances on different
chains is shown below.

```rust,ignore
#[tokio::test]
async fn test_cross_chain_message() {
    let parameters = vec![];
    let instantiation_argument = vec![];

    let (validator, application_id) =
        TestValidator::with_current_application(parameters, instantiation_argument).await;

    let mut sender_chain = validator.get_chain(application_id.creation.chain_id).await;
    let mut receiver_chain = validator.new_chain().await;

    sender_chain
        .add_block(|block| {
            block.with_operation(
                application_id,
                Operation::SendMessageTo(receiver_chain.id()),
            )
        })
        .await;

    receiver_chain.handle_received_messages().await;

    assert_eq!(
        receiver_chain
            .query::<ChainId>(application_id, Query::LastSender)
            .await,
        sender_chain.id(),
    );
}
```
