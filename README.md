# Linera Developer Documentation

Repository for the developer documentation of Linera hosted on https://linera.dev

## Initializing git submodules

```
git submodule update --init
```

To discard local changes to the submodule (the equivalent of `git checkout -f HEAD` for
files), use `git submodule update`.

## Updating the submodule `linera-protocol`

To commit local changes, use `git commit -a` as usual.

IMPORTANT: The HEAD of linera-protocol should be a commit hash (not a branch name).

The complete workflow may look like this:

```bash
cd linera-protocol
git fetch origin
git checkout $(git rev-parse origin/main)
cargo clean
cargo build -p linera-sdk
cd ..
mdbook test -L linera-protocol/target/debug/deps
git commit -a
```

## Browsing the developer docs locally (including local changes)

```
cargo install mdbook
mdbook serve
```
Then, open the URL as instructed.

## Formatting

This repository is formatted with prettier. To install prettier run `npm install -g
prettier`. To use prettier run `prettier --write src`. The repository is automatically
checked for formatting in CI.
