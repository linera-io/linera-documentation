# Linera Developer Documentation

Repository for the developer documentation of Linera (eventually) to be hosted on https://linera.dev

## Browse the developer docs on github.io

You may preview the website here (refreshed after every commit on the main): https://linera-io.github.io/linera-documentation/index.html

## Initialize git submodules

```
git submodule update --init
```

## Browse the developer docs locally (including local changes)

```
cargo install mdbook
mdbook serve
```
Then, open the URL as instructed.

## Formatting

This repository is formatted with prettier. To install prettier run `npm install -g prettier`.
To use prettier run `prettier --write src/`. The repository is automatically checked for 
formatting in CI.
