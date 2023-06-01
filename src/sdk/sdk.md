# Writing Linera Applications

In this section, we'll be exploring how to create Web3 applications using the SDK of Linera.

We'll use a simple "counter" application as a running example.

We'll focus on the back end of the application, which consists of two main parts: a "smart
contract" and its GraphQL service.

Both the contract and the service part of an application are meant to be compiled to Wasm
bytecode and written in Rust on top of the crate
[`linera-sdk`](https://crates.io/crates/linera-sdk).

This section should be seen as a guide versus a reference manual for the SDK. For the
reference manual, refer to the [documentation of the
crate](https://docs.rs/linera-sdk/latest/linera_sdk/).
