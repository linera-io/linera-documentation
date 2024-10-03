# Views

> Views are a specific functionality of the Linera system that allow to have
> data in memory and then seamlessly flush it to an underlying persistent
> datastore.

The [full documentation](https://docs.rs/linera-views/latest/linera_views/) is
available on the crate documentation with all functions having examples.

Concretely, what is provided is the following:

- A trait `View` that provides `load`, `rollback`, `clear`, `flush`, `delete`.
  The idea is that we can do operation on the data and then flush it to the
  database storing them.

- Several other traits `HashableView`, `RootView`, `CryptoHashView`,
  `CryptoHashRootView` that are important for computing hash.

- A number of standard containers: `MapView`, `SetView`, `LogView`, `QueueView`,
  `RegisterView` that implement the `View` and `HashableView` traits.

- Two containers `CollectionView` and `ReentrantCollectionView` that are similar
  to `MapView` but whose values are views themselves.

- Derive macros that allow to implement the above mentioned traits on struct
  data types whose entries are views.
