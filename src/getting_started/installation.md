# Installation

Let's start with the installation of the Linera development tools.

## Overview

The Linera toolchain consist of two crates:

- `linera-sdk` is the main library to program Linera applications in Rust. It
  also includes the Wasm test runner binary `linera-wasm-test-runner`.

- `linera-service` defines a number of binaries, including:

  - `linera` -- the main client tool, used to operate development wallets,
  - `linera-proxy` -- the proxy service, acting as a public entrypoint for each
    validator,
  - `linera-server` -- the service run by each worker of a validator, hidden
    behind the proxy.

## Requirements

The operating systems currently supported by the Linera toolchain can be
summarized as follows:

| Linux x86 64-bit | Mac OS (M1 / M2) | Mac OS (x86) | Windows  |
| ---------------- | ---------------- | ------------ | -------- |
| ✓ Main platform  | ✓ Working        | ✓ Working    | Untested |

The main prerequisites to install the Linera toolchain are Rust, Wasm, and
Protoc. They can be installed as follows on Linux:

- Rust and Wasm

  - `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
  - `rustup target add wasm32-unknown-unknown`

- Protoc

  - `curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v21.11/protoc-21.11-linux-x86_64.zip`
  - `unzip protoc-21.11-linux-x86_64.zip -d $HOME/.local`
  - If `~/.local` is not in your path, add it:
    `export PATH="$PATH:$HOME/.local/bin"`

- On certain Linux distributions, you may have to install development packages
  such as `g++`, `libclang-dev` and `libssl-dev`.

For MacOS support and for additional requirements needed to test the Linera
protocol itself, see the installation section on
[GitHub](https://github.com/linera-io/linera-protocol/blob/main/INSTALL.md).

This manual was tested with the following Rust toolchain:

```text
{{#include ../../linera-protocol/rust-toolchain.toml}}
```

## Installing from crates.io

You may install the Linera binaries with

```bash
cargo install --locked linera-sdk@{{#include ../../RELEASE_VERSION}}
cargo install --locked linera-service@{{#include ../../RELEASE_VERSION}}
```

and use `linera-sdk` as a library for Linera Wasm applications:

```bash
cargo add linera-sdk@{{#include ../../RELEASE_VERSION}}
```

The version number `{{#include ../../RELEASE_VERSION}}` corresponds to the
current Devnet of Linera and may change frequently.

## Installing from GitHub

Download the source from [GitHub](https://github.com/linera-io/linera-protocol):

```bash
git clone https://github.com/linera-io/linera-protocol.git
cd linera-protocol
git checkout -t origin/{{#include ../../RELEASE_BRANCH}}  # Current release branch
```

To install the Linera toolchain locally from source, you may run:

```bash
cargo install --locked --path linera-sdk
cargo install --locked --path linera-service
```

Alternatively, for developing and debugging, you may instead use the binaries
compiled in debug mode, e.g. using `export PATH="$PWD/target/debug:$PATH"`.

This manual was tested against the following commit of the
[repository](https://github.com/linera-io/linera-protocol):

```text
{{#include ../../.git/modules/linera-protocol/HEAD}}
```

## Bash helper (optional)

Consider adding the output of `linera net helper` to your `~/.bash_profile` to
help with [automation](../core_concepts/wallets.md#automation-in-bash).

## Getting help

If installation fails, reach out to the team (e.g. on
[Discord](https://discord.gg/linera)) to help troubleshoot your issue or
[create an issue](https://github.com/linera-io/linera-protocol/issues/new) on
GitHub.
