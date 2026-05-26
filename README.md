# Linera Developer Documentation

Repository for the developer documentation of Linera hosted on https://linera.dev

## Initializing git submodules

The documentation is imported from a suitable commit in the repository `linera-protocol`.

```
git submodule update --init
```

To discard local changes to the submodule (the equivalent of `git checkout -f HEAD` for
files), use `git submodule update`.

## Checking source links

The published site is built from the `linera-protocol` submodule. When changing
the mdBook source path or the GitHub edit URL template in that submodule, verify
that generated "Edit" links point to repository paths without `..` segments.

For example, a page generated from `docs/protocol/overview.md` should link to:

```text
https://github.com/linera-io/linera-protocol/edit/main/docs/protocol/overview.md
```

Before publishing, check at least one top-level page and one nested developer
page so broken source-path mappings are caught before deployment.
