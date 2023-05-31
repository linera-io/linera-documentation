# Linera SDK

In this section we'll be exploring the Linera SDK by building a simple counter application.

This is going to cover most facets of building an app.

## Linera SDK Crate

The `linera-sdk` crate exposes the basic traits required to create a Linera
application.

This section takes you over the steps to create a full Web3 application with a
Linera application for the back end and a React front end.

## Creating your Linera Project

To create your Linera project, use the `linera project new` command to set up
the scaffolding and requisite files:

```bash
linera project new my-counter
```

`linera project new` bootstraps your project by creating the following key files:

- `Cargo.toml`: your project's manifest filled with the necessary dependencies to create an app
- `state.rs`: the file which holds your application's state
- `contract.rs`: the file which holds your application's contract, and the binary target for the contract bytecode
- `service.rs`: the file which holds your application's service, and the binary target for the service bytecode
- `lib.rs`: the file which holds your application's ABI definition.
