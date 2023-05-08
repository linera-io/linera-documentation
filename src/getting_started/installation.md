# Installation

This section is about installing Linera and running it from source.

## OS Support

The Linera client and validators run as a set of native binaries. Below is a matrix of supported operating systems.

```ignore
| Linux x86 64-bit | Mac OS (M1 / M2) | Mac OS (x86)     | Windows  |
| ---------------- | ---------------- | ---------------- | ---------|
| ✓ Most tested    | ✓ Working        | ✓ Working        | Untested |
```

## Prerequisites

To install Linera you will need to download the source from [GitHub](https://github.com/linera-io/linera-protocol).

To clone the repository run:

```bash
git clone git@github.com:linera-io/linera-protocol.git
```

## Dependencies

To install Linera from scratch, you will require the following dependencies:

- [Rust + wasm32-unknown-unknown target](https://www.rust-lang.org/tools/install)
- [protoc](https://grpc.io/docs/protoc-installation/)

For OS specific installation instructions see the installation section on [GitHub](https://github.com/linera-io/linera-protocol/blob/main/INSTALL.md).

## Checking your Installation

Running `cargo build` at the root of the repository will build all requisite binaries in the workspace.

If `cargo build` fails, reach out to the team to help troubleshoot your issue or [create an issue](https://github.com/linera-io/linera-protocol/issues/new) on GitHub.
