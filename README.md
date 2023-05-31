# Linera Developer Documentation

Repository for the developer documentation of Linera hosted on https://linera.dev

## Initialize git submodules

```
git submodule update --init
```

To discard local changes to the submodule (the equivalent of `git checkout -f HEAD` for
files), use `git submodule update`. To commit local changes, use `git commit -a` as usual.

## Browse the developer docs locally (including local changes)

```
cargo install mdbook
mdbook serve
```
Then, open the URL as instructed.

## Formatting

This repository is formatted with prettier. To install prettier run `npm install -g
prettier`. To use prettier run `prettier --write src/`. The repository is automatically
checked for formatting in CI.
