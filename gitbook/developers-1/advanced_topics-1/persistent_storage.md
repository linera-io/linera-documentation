# Persistent storage

Validators run the servers and the data is stored in persistent storage. As a
consequence we need a tool for working with persistent storage and so we have
added `linera-db` for that purpose.

## Available persistent storage

The persistent storage that are available right now are `RocksDB`, `DynamoDB`
and `ScyllaDB`. Each has its own strengths and weaknesses.

- [`RocksDB`](https://rocksdb.org/): Data is stored on disk and cannot be shared
  between shards but is very fast.

- [`DynamoDB`](https://aws.amazon.com/dynamodb/): Data is stored on a remote
  storage, that has to be on AWS. Data can be shared between shards.

- [`ScyllaDB`](https://www.scylladb.com/): Data is stored on a remote storage.
  Data can be shared between shards.

There is no fundamental obstacle to the addition of other persistent storage
solutions.

In addition, the `DynamoDB` and `ScyllaDB` have the notion of a table which
means that a given remote location can be used for several completely
independent purposes.

## The `linera-db` tool

When operating on a persistent storage some global operations can be required.
The command line tool `linera-db` helps in making them work.

The functionalities are the following:

- `list_tables`(`DynamoDB` and `ScyllaDB`): It lists all the tables that have
  been created on the persistent storage

- `initialize`(`RocksDB`, `DynamoDB` and `ScyllaDB`): It initializes a
  persistent storage.

- `check_existence`(`RocksDB`, `DynamoDB` and `ScyllaDB`): It tests the
  existence of a persistent storage. If the error code is 0 then the table
  exists, if the error code is 1 then the table is absent.

- `check_absence`(`RocksDB`, `DynamoDB` and `ScyllaDB`): It tests the absence of
  a persistent storage. If the error code is 0 then the table is absent, if the
  error code is 1 then the table does not exist.

- `delete_all`(`RocksDB`, `DynamoDB` and `ScyllaDB`): It deletes all the table
  of a persistent storage.

- `delete_single`(`DynamoDB` and `ScyllaDB`): It deletes a single table of a
  persistent storage.

If some error occurs during the operation, then the error code 2 is returned and
0 if everything went fine with the exception of `check_existence` and
`check_absence` for which the value 1 can occur if the connection with the
database was established correctly but the result is not what we expected.
