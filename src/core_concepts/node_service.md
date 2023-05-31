## Node Service

So far we've seen how to use the Linera client treating it as a binary
in your terminal. However, the client also acts as a partial node which:

1. Executes blocks
2. Exposes an GraphQL API and IDE for dynamically interacting with applications
   and the system
3. Listens for notifications from validators and automatically updates local
   chains.

To interact with the node service, simply run `linera` in `service` mode:

```bash
linera --storage $LINERA_STORAGE --wallet $LINERA_WALLET service
```

This will run the node service on port 8080 by default (this can be overridden
using the `--port` flag).

### A Note on GraphQL

Linera uses GraphQL as the primary query language for interfacing with different
parts of the system. GraphQL is a query language developed by Facebook which
enables clients to craft queries such that they receive exactly what they want
and nothing more.

GraphQL is used extensively during application development, especially to query
the state of an application from a front-end for example.

To learn more about GraphQL check out
the [official docs](https://graphql.org/learn/).

### GraphiQL IDE

Conveniently, the node service exposes a GraphQL IDE called GraphiQL. To use
GraphiQL start the node service and navigate to `localhost:8080/`.

Using the schema explorer on the left of the GraphiQL IDE you can dynamically
explore the state of the system and your applications.

![graphiql.png](graphiql.png)

## GraphQL API

The node service also exposes a GraphQL API which corresponds to the set of
system operations. You can explore the full set of operations by using the
aforementioned schema explorer under `MutationRoot`.
