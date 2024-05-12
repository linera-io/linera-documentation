# Writing Tests

Linera applications can be tested using unit tests or integration tests. Both
are a bit different than usual Rust tests. Unit tests are executed inside a
WebAssembly virtual machine in an environment that simulates a single microchain
and a single application. System APIs are only available if they are mocked
using helper functions from `linera_sdk::test`.

Integration tests run outside a WebAssembly virtual machine, and use a simulated
validator for testing. This allows creating chains and adding blocks to them in
order to test interactions between multiple microchains and multiple
applications.

Applications should consider having both types of tests. Unit tests should be
used to focus on the application's internals and core functionality. Integration
tests should be used to test how the application behaves on a more complex
environment that's closer to the real network.

> In most cases, the simplest way to run both unit tests and integration tests
> is to call `linera project test` from the project's directory.

## Unit tests

Unit tests are written beside the application's source code (i.e., inside the
`src` directory of the project). There are several differences to normal Rust
unit tests:

- the target `wasm32-unknown-unknown` must be selected;

- the custom test runner `linera-wasm-test-runner` must be used;

- the
  [`#[webassembly_test]`](https://docs.rs/webassembly-test/latest/webassembly_test/)
  attribute must be used instead of the usual `#[test]` attribute.

The first two items are done automatically by `linera project test`.

Alternatively, one may set up the environment and run `cargo test` directly as
described [below](#manually-configuring-the-environment).

### Example

A simple unit test is shown below, which tests if the application's
`do_something` method changes the application state.

```rust,ignore
#[cfg(test)]
mod tests {
    use crate::state::ApplicationState;
    use webassembly_test::webassembly_test;

    #[webassembly_test]
    fn test_do_something() {
        let mut application = ApplicationState {
            // Configure the application's initial state
            ..ApplicationState::default()
        };

        let result = application.do_something();

        assert!(result.is_ok());
        assert_eq!(application, ApplicationState {
            // Define the application's expected final state
            ..ApplicationState::default()
        });
    }
}
```

### Mocking System APIs

Unit tests run in a constrained environment, so things like access to the
key-value store, cross-chain messages and cross-application calls can't be
executed. However, they can be simulated using mock APIs. The `linera-sdk::test`
module provides some helper functions to mock the system APIs.

Here's an example mocking the key-value store.

```rust,ignore
#[cfg(test)]
mod tests {
    use crate::state::ApplicationState;
    use linera_sdk::test::mock_key_value_store;
    use webassembly_test::webassembly_test;

    #[webassembly_test]
    fn test_state_is_not_persisted() {
        let mut storage = mock_key_value_store();

        // Assuming the application uses views
        let mut application = ApplicationState::load(storage.clone())
            .now_or_never()
            .expect("Mock key-value store returns immediately")
            .expect("Failed to load view from mock key-value store");

        // Assuming `do_something` changes the view, but does not persist it
        let result = application.do_something();

        assert!(result.is_ok());

        // Check that the state in memory is different from the state in storage
        assert_ne!(application, ApplicatonState::load(storage));
    }
}
```

### Running Unit Tests with `cargo test`

Running `linera project test` is easier, but if there's a need to run
`cargo test` explicitly to run the unit tests, Cargo must be configured to use
the custom test runner `linera-wasm-test-runner`. This binary can be built from
the repository or installed with `cargo install --locked linera-sdk`.

```bash
cd linera-protocol
cargo build -p linera-sdk --bin linera-wasm-test-runner --release
```

The steps above build the `linera-wasm-test-runner` and places the resulting
binary at `linera-protocol/target/release/linera-wasm-test-runner`.

With the binary available, the last step is to configure Cargo. There are a few
ways to do this. A quick way is to set the
`CARGO_TARGET_WASM32_UNKNOWN_UNKNOWN_RUNNER` environment variable to the path of
the binary.

A more persistent way is to change one of
[Cargo's configuration files](https://doc.rust-lang.org/cargo/reference/config.html#hierarchical-structure).
As an example, the following file can be placed inside the project's directory
at `PROJECT_DIR/.cargo/config.toml`:

```ignore
[target.wasm32-unknown-unknown]
runner = "PATH_TO/linera-wasm-test-runner"
```

After configuring the test runner, unit tests can be executed with

```bash
cargo test --target wasm32-unknown-unknown
```

Optionally, `wasm32-unknown-unknown` can be made the default build target with
the following lines in `PROJECT_DIR/.cargo/config.toml`:

```ignore
[build]
target = "wasm32-unknown-unknown"
```

## Integration Tests

Integration tests are usually written separately from the application's source
code (i.e., inside a `tests` directory that's beside the `src` directory).

Integration tests are normal Rust integration tests, and they are compiled to
the **host** target instead of the `wasm32-unknown-unknown` target used for unit
tests. This is because unit tests run inside a WebAssembly virtual machine and
integration tests run outside a virtual machine, starting isolated virtual
machines to run each operation of each block added to each chain.

> Integration tests can be run with `linera project test` or simply
> `cargo test`.

If you wish to use `cargo test` and have overridden your default target to be in
`wasm32-unknown-unknown` in `.cargo/config.toml`, you will have to pass a native
target to `cargo`, for instance `cargo test --target aarch64-apple-darwin`.

Integration tests use the helper types from `linera_sdk::test` to set up a
simulated Linera network, and publish blocks to microchains in order to execute
the application.

### Example

A simple test that sends a message between application instances on different
chains is shown below.

```rust,ignore
#[tokio::test]
async fn test_cross_chain_message() {
    let (validator, application_id) = TestValidator::with_current_application(vec![], vec![]).await;

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
