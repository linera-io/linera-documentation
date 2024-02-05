# Installation

Let's start with the installation of the Linera development tools.

## Overview

The Linera toolchain consist of two crates:

- `linera-sdk` is the main library to program Linera applications in Rust. It
  also includes the Wasm test runner binary `linera-wasm-test-runner`.

- `linera-service` defines four binaries:

  - `linera` -- the main client tool, to operate user wallets,
  - `linera-proxy` -- the Linera proxy, which acts as an ingress for validators,
  - `linera-server` -- the Linera workers behind the proxy,
  - `linera-db` -- a command line tool to manage persistent storage.

## OS Support

The Linera client and validators run as a set of native binaries. Below is a
matrix of supported operating systems.

| Linux x86 64-bit | Mac OS (M1 / M2) | Mac OS (x86) | Windows  |
| ---------------- | ---------------- | ------------ | -------- |
| ✓ Main platform  | ✓ Working        | ✓ Working    | Untested |

## Prerequisites

The required software may installed as follows on Linux:

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

For MacOS, see the installation section on
[GitHub](https://github.com/linera-io/linera-protocol/blob/main/INSTALL.md).

## Installing from crates.io

You may install binaries with

```bash
cargo install linera-sdk
cargo install linera-service
```

and use `linera-sdk` as a library for Linera Wasm applications:

```bash
cargo add linera-sdk
```

Note that installing binaries from `crates.io` may still require using a Rust
toolchain consistent with our GitHub
[repository](https://github.com/linera-io/linera-protocol). This manual is
tested with the following Rust toolchain:

```text
{{#include ../../linera-protocol/rust-toolchain.toml}}
```

## Installing from GitHub

Download the source from [GitHub](https://github.com/linera-io/linera-protocol):

```bash
git clone https://github.com/linera-io/linera-protocol.git
```

To install the Linera toolchain locally from source, you may run:

```bash
cargo install --path linera-sdk
cargo install --path linera-service
```

Alternatively, for developing and debugging, you may instead use the binaries
compiled in debug mode, e.g. using `export PATH="$PWD/target/debug:$PATH"`.

This manual has been tested against the following commit of the
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
