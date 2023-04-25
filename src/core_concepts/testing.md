# Testing

Linera applications can be tested using unit tests or integration tests. Both are a bit different
than usual Rust tests. Unit tests are executed inside a WebAssembly virtual machine in an
environment that simulates a single microchain and a single application. System APIs are only
available if they are mocked using helper functions from `linera_sdk::test`.

Integration tests run outside a WebAssembly virtual machine, and uses a simulated validator for
testing.  This allows testing interactions between multiple microchains and multiple applications. However, it
is also more low-level, because testing the application requires interacting with microchains, so
execution only happens when blocks are published.

Applications should consider having both types of tests. Unit tests should be used to focus on the
application's internals and core functionality. Integration tests should be used to test how the
application behaves on a more complex environment that's closer to the real network.
