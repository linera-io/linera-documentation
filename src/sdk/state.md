# Creating the Application State

The `struct` which defines your application's state can be found in `state.rs`.

To represent our Counter, all we're going to need a single `u128`. To persist
the counter we'll be using Linera's [view](../advanced_topics/views.md) paradigm.

Views are a little like an [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping),
however instead of mapping your datastructures to a relational database like Postgres, they are
instead mapped onto key-value stores like [RocksDB](https://rocksdb.org/).

In vanilla Rust, we might represent our Counter as so:

```rust,ignore
struct Counter {
  value: u128
}
```

However to persist your data, you'll need to replace the existing `State` struct in `state.rs
with the following view:

```rust,ignore
/// The application state.
#[derive(RootView, Debug)]
pub struct Counter<C> {
    pub value: RegisterView<C, u128>,
}
```

The `RegisterView` supports modifying a single value of type `T`. There are different types of
views for different use-cases, but the majority of common data structures have already been implemented:

- A `Vec` maps to a `CollectionView`
- A `HashMap` maps to a `MapView`
- A `Queue` maps to a `QueueView`

For an exhaustive list refer to the Views [documentation](../advanced_topics/views.md).
