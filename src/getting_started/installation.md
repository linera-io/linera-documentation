# Installation

We start with the installation of Linera and how to run it from source.

## OS Support

The Linera client and validators run as a set of native binaries. Below is a matrix of supported operating systems.

| Linux x86 64-bit | Mac OS (M1 / M2) | Mac OS (x86) | Windows  |
| ---------------- | ---------------- | ------------ | -------- |
| ✓ Main platform  | ✓ Working        | ✓ Working    | Untested |

## Prerequisites

To install Linera, you will need to download the source from [GitHub](https://github.com/linera-io/linera-protocol).

To clone the repository, run:

```bash
git clone https://github.com/linera-io/linera-protocol.git
```

## Dependencies

To install Linera from scratch, you will require the following dependencies:

- [Rust + wasm32-unknown-unknown target](https://www.rust-lang.org/tools/install)
- [protoc](https://grpc.io/docs/protoc-installation/)

For OS specific installation instructions see the installation section on [GitHub](https://github.com/linera-io/linera-protocol/blob/main/INSTALL.md).

## Installing Linera Locally

To install Linera locally, at the root of the repository run:

```
cargo install --path linera-service --debug
```

This will install three binaries:

1. `linera` - the Linera client
2. `server` - the Linera worker
3. `proxy` - the Linera proxy which acts as an ingress for validators

If installation fails, reach out to the team (e.g. on [discord](https://discord.gg/linera)) to help troubleshoot your issue or [create an issue](https://github.com/linera-io/linera-protocol/issues/new) on GitHub.
