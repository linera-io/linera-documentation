# Linera Developer Documentation

Repository for the developer documentation of Linera (eventually) to be hosted on https://linera.dev

## Browse the developer docs on github.io

You may preview the website (refreshed after every commit):

* here: https://linera-io.github.io/linera-documentation/364a04086bc8f2bf91ec3406a2aac5f7e4e675b9/index.html

* or equivalently: https://linera-io.github.io/linera-documentation then password: “2023lineraftw”

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
