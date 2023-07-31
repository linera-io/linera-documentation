# Deploying the Application

To deploy your application, build your contract in release mode with
`cargo build --release` and then use the `publish-and-create` command while also
specifying:

1. The location of the contract bytecode
2. The location of the service bytecode
3. The hex encoded initialization arguments

```bash
linera publish-and-create \
  target/wasm32-unknown-unknown/release/my-counter_{contract,service}.wasm \
  --json-argument "42"
```
