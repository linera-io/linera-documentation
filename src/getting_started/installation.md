# Installation

We start with the installation of Linera and how to run it from source.

## OS Support

The Linera client and validators run as a set of native binaries. Below is a
matrix of supported operating systems.

| Linux x86 64-bit | Mac OS (M1 / M2) | Mac OS (x86) | Windows  |
| ---------------- | ---------------- | ------------ | -------- |
| ✓ Main platform  | ✓ Working        | ✓ Working    | Untested |

## Prerequisites

To install Linera, you will need to download the source from
[GitHub](https://github.com/linera-io/linera-protocol).

To clone the repository, run:

```bash
git clone https://github.com/linera-io/linera-protocol.git
```

This manual has been tested against the following commit:

```text
{{#include ../../.git/modules/linera-protocol/HEAD}}
```

## Dependencies

To install Linera from scratch, you will require the following dependencies:

- [Rust + wasm32-unknown-unknown target](https://www.rust-lang.org/tools/install)
- [protoc](https://grpc.io/docs/protoc-installation/)
- On Debian/Ubuntu-based Linux distributions you may have to install the
  packages `g++`, `libclang-dev` and `libssl-dev`.

For OS-specific installation instructions see the installation section on
[GitHub](https://github.com/linera-io/linera-protocol/blob/main/INSTALL.md).

## Installing Linera Locally

To install Linera locally, at the root of the repository run:

```bash
cargo install --path linera-sdk
cargo install --path linera-service
```

The first command is used to install the Wasm test runner
`linera-wasm-test-runner`.

The second command will install four binaries:

1. `linera` - the Linera client
2. `linera-server` - the Linera worker
3. `linera-proxy` - the Linera proxy, which acts as an ingress for validators
4. `linera-db` - a command line tool for operating on persistent storage

If installation fails, reach out to the team (e.g. on
[Discord](https://discord.gg/linera)) to help troubleshoot your issue or
[create an issue](https://github.com/linera-io/linera-protocol/issues/new) on
GitHub.
