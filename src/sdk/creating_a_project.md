# Creating a Linera Project

To create your Linera project, use the `linera project new` command. The command
should be executed outside the `linera-project` folder. It sets up the
scaffolding and requisite files:

```bash
linera project new my-counter
```

`linera project new` bootstraps your project by creating the following key
files:

- `Cargo.toml`: your project's manifest filled with the necessary dependencies
  to create an app;
- `src/lib.rs`: the application's ABI definition;
- `src/state.rs`: the application's state;
- `src/contract.rs`: the application's contract, and the binary target for the
  contract bytecode;
- `src/service.rs`: the application's service, and the binary target for the
  service bytecode.
- `.cargo/config.toml`: modifies the default target used by `cargo` to be
  `wasm32-unknown-unknown`
