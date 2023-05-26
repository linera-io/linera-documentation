# Deploying your Application

To deploy your application, you first need to navigate to `target/debug` where the `linera` binary is located.

1. The location of the contract bytecode
2. The location of the service bytecode
3. The hex encoded initialization arguments

```bash
./linera --storage rocksdb:linera.db --wallet wallet.json publish-and-create \
  target/wasm32-unknown-unknown/release/counter_{contract,service}.wasm \
  --json-argument "42"
```
