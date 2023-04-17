# The Wallet

The Linera Wallet is the main way to interact with the network. Like most
wallets, the Linera Wallet holds user private and public keys. Unlike most
wallets, the Linera Wallet also acts as a partial node, executing blocks for
chains owned by a user.

The state of the wallet lives in `wallet.json`, while the state of the chains
running on your local partial node are stored in `client.db`.

## Chain Management

User chains are managed explicitly via the wallet.

### Listing Chains

To see the chains owned by your wallet, you can use the `show` command:

```bash
$ ./client --storage rocksdb:client.db  --wallet wallet.json --genesis genesis.json wallet show
╭──────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────╮
│ Chain Id                                                         ┆ Latest Block                                                                         │
╞══════════════════════════════════════════════════════════════════╪══════════════════════════════════════════════════════════════════════════════════════╡
│ 668774d6f49d0426f610ad0bfa22d2a06f5f5b7b5c045b84a26286ba6bce93b4 ┆ Public Key:         3812c2bf764e905a3b130a754e7709fe2fc725c0ee346cb15d6d261e4f30b8f1 │
│                                                                  ┆ Owner:              c9a538585667076981abfe99902bac9f4be93714854281b652d07bb6d444cb76 │
│                                                                  ┆ Block Hash:         -                                                                │
│                                                                  ┆ Timestamp:          2023-04-10 13:52:20.820840                                       │
│                                                                  ┆ Next Block Height:  0                                                                │
├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┼╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤
│ 91c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f646 ┆ Public Key:         29c19718a26cb0d5c1d28102a2836442f53e3184f33b619ff653447280ccba1a │
│                                                                  ┆ Owner:              efe0f66451f2f15c33a409dfecdf76941cf1e215c5482d632c84a2573a1474e8 │
│                                                                  ┆ Block Hash:         51605cad3f6a210183ac99f7f6ef507d0870d0c3a3858058034cfc0e3e541c13 │
│                                                                  ┆ Timestamp:          2023-04-10 13:52:21.885221                                       │
│                                                                  ┆ Next Block Height:  1                                                                │
╰──────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────╯

```

Each row represents a chain owned by the wallet. On the left is the unique
identifier on the chain, and on the right is metadata for that chain associated
with the latest block.

### Default Chain

Each wallet has a default chain. Since wallets can hold multiple chains, a
default chain removes ambiguity in which chain is selected when performing an
operation.

The default chain is set initially, when the first chain is added to the wallet.
You can check the default chain for your wallet by running :

```bash
$ ./client --storage rocksdb:client.db --wallet wallet.json --genesis genesis.json wallet show
```

The Chain Id which is in green text instead of white text is your default chain.

To change the default chain for you wallet, user the `set-default` command:

```bash
$ ./client --storage rocksdb:client.db --wallet wallet.json --genesis genesis.json wallet set-default <chain-id>
```

### Opening a Chain

The Linera protocol defines semantics for how new chains are created, we call
this 'opening a chain'. A chain cannot be opened in a vacuum, it needs to be
created by an existing chain on the network. In the future, one of the Linera
public chains will open chains for new users - but for now an existing
single-chain owner is required to open a chain for a new wallet on the network.

#### Open a Chain for your own wallet

To open a chain for your own wallet, you can use the `open_chain` command:

```bash
$ ./client --storage rocksdb:client.db  --wallet wallet.json --genesis genesis.json open_chain
```

This will create a new chain (using the wallet's default chain) and add it to
the wallet. Use the `wallet show` command to see your existing chains.

#### Open a Chain for another wallet

Opening a chain for another `wallet` (let's call it `wallet2`) requires an extra
two
steps.

First `wallet2` must create an unassigned keypair. The public part of that
keypair
is then sent to the `wallet` who is the chain creator.

```bash
$ ./client --wallet wallet2.json --genesis genesis.json keygen
6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888 # this is the public key for the unassigned keypair
```

Next, using the public key, `wallet` can open a chain for `wallet2`.

```bash
./client --wallet wallet.json --genesis genesis.json open_chain --to-owner 6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888
21afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda3
91c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f6460000000000000000000100000221afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda36443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c91408888891c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64600000000000000000100000000000000000403f5447c1953dd2d4367462bf5485a08f9b89ecf9e2fc37b4c04cda0766763aa13677270633a3132372e302e302e313a39333030010000000000000034537eb025224f15bbc763ebc90431277e20923acfdc6fd2e0c3e2fabc26849313677270633a3132372e302e302e313a3932303001000000000000008e45fae6f0030f195b5818fdd7c4656da8a40c3401a248ecde6a6c0a8caf81a413677270633a3132372e302e302e313a393430300100000000000000a093522fb18888c54c3c3e9c2e808ee08d9aebc8fc8a8a42e751c0399cffb4ca13677270633a3132372e302e302e313a3931303001000000000000000400000000000000030000000000000002000000000000000300000000000000c5f4299a00f9050001cd127942d23e32ab5137a9ea07edd4db726da61affe4b7cdcdf85d71ff898f3d01b2e90cb542d342e8fc1f5b7e9ed9abbc6b04c9f08f234130ed346f7357076d2602000021afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda300000221afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda36443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c91408888891c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64600000000000000000100000000000000000403f5447c1953dd2d4367462bf5485a08f9b89ecf9e2fc37b4c04cda0766763aa13677270633a3132372e302e302e313a39333030010000000000000034537eb025224f15bbc763ebc90431277e20923acfdc6fd2e0c3e2fabc26849313677270633a3132372e302e302e313a3932303001000000000000008e45fae6f0030f195b5818fdd7c4656da8a40c3401a248ecde6a6c0a8caf81a413677270633a3132372e302e302e313a393430300100000000000000a093522fb18888c54c3c3e9c2e808ee08d9aebc8fc8a8a42e751c0399cffb4ca13677270633a3132372e302e302e313a393130300100000000000000040000000000000003000000000000000200000000000000000091c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64600000421afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda391c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64601008095a889f7025d24dffccb5f9700439efd671de5dd453f9d2432ab73e6602613010334537eb025224f15bbc763ebc90431277e20923acfdc6fd2e0c3e2fabc2684938942c4b9c4efec2ca802d3841c5936cf1c7670794be06f4789e411ea3dd5398ca66a69630e9d0e7e3a5429e60a4332a3d927cbc22758bffe3784a7793b476903a093522fb18888c54c3c3e9c2e808ee08d9aebc8fc8a8a42e751c0399cffb4ca760f4f9c51ee0440cb6b26ca8d2e13a8265defe240c7bcb6d7c4fcc4532f36634b80ca3690f1d6c8c08a8befbb2c0ef1bd68a8b88fdef65aab973d61a31e93068e45fae6f0030f195b5818fdd7c4656da8a40c3401a248ecde6a6c0a8caf81a4138630adeca4b0b44f9904f95510048387177d16260207143dccf1946788ac7b491bbcd60d0d18f18acfed6138afbe45e0b5bea67e000da6e81facbcf0d62407
```

The first line is the Chain Id of the newly created chain. The second line is
the operation certificate.

Finally, to add the chain to `wallet2` for the given unassigned key we use
the `assign` command:

```bash
 ./client --wallet wallet2.json --genesis genesis.json assign --key 6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888 --chain 21afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda3 --certificate 91c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f6460000000000000000000100000221afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda36443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c91408888891c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64600000000000000000100000000000000000403f5447c1953dd2d4367462bf5485a08f9b89ecf9e2fc37b4c04cda0766763aa13677270633a3132372e302e302e313a39333030010000000000000034537eb025224f15bbc763ebc90431277e20923acfdc6fd2e0c3e2fabc26849313677270633a3132372e302e302e313a3932303001000000000000008e45fae6f0030f195b5818fdd7c4656da8a40c3401a248ecde6a6c0a8caf81a413677270633a3132372e302e302e313a393430300100000000000000a093522fb18888c54c3c3e9c2e808ee08d9aebc8fc8a8a42e751c0399cffb4ca13677270633a3132372e302e302e313a3931303001000000000000000400000000000000030000000000000002000000000000000300000000000000c5f4299a00f9050001cd127942d23e32ab5137a9ea07edd4db726da61affe4b7cdcdf85d71ff898f3d01b2e90cb542d342e8fc1f5b7e9ed9abbc6b04c9f08f234130ed346f7357076d2602000021afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda300000221afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda36443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c91408888891c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64600000000000000000100000000000000000403f5447c1953dd2d4367462bf5485a08f9b89ecf9e2fc37b4c04cda0766763aa13677270633a3132372e302e302e313a39333030010000000000000034537eb025224f15bbc763ebc90431277e20923acfdc6fd2e0c3e2fabc26849313677270633a3132372e302e302e313a3932303001000000000000008e45fae6f0030f195b5818fdd7c4656da8a40c3401a248ecde6a6c0a8caf81a413677270633a3132372e302e302e313a393430300100000000000000a093522fb18888c54c3c3e9c2e808ee08d9aebc8fc8a8a42e751c0399cffb4ca13677270633a3132372e302e302e313a393130300100000000000000040000000000000003000000000000000200000000000000000091c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64600000421afead36b9abfe5b0556c955f87cd167e2271eaa301546ca579be516db6eda391c7b394ef500cd000e365807b770d5b76a6e8c9c2f2af8e58c205e521b5f64601008095a889f7025d24dffccb5f9700439efd671de5dd453f9d2432ab73e6602613010334537eb025224f15bbc763ebc90431277e20923acfdc6fd2e0c3e2fabc2684938942c4b9c4efec2ca802d3841c5936cf1c7670794be06f4789e411ea3dd5398ca66a69630e9d0e7e3a5429e60a4332a3d927cbc22758bffe3784a7793b476903a093522fb18888c54c3c3e9c2e808ee08d9aebc8fc8a8a42e751c0399cffb4ca760f4f9c51ee0440cb6b26ca8d2e13a8265defe240c7bcb6d7c4fcc4532f36634b80ca3690f1d6c8c08a8befbb2c0ef1bd68a8b88fdef65aab973d61a31e93068e45fae6f0030f195b5818fdd7c4656da8a40c3401a248ecde6a6c0a8caf81a4138630adeca4b0b44f9904f95510048387177d16260207143dccf1946788ac7b491bbcd60d0d18f18acfed6138afbe45e0b5bea67e000da6e81facbcf0d62407
```

## Node Service

So far we've seen how to interact with the wallet while treating it as a binary
in your terminal. However, the wallet also acts as a partial node which:

1. Executes blocks
2. Exposes an GraphQL API and IDE for dynamically interacting with applications
   and the system
3. Listens for notifications from validators and automatically updates local
   chains.

To interact with the node service, simply run the wallet in `service` mode:

```bash
./client --storage rocksdb:client.db --wallet wallet.json --genesis genesis.json --max-pending-messages 10000 service
```

This will run the node service on port 8080 by default (this can be overridden
using the `--port` flag).

### A Note on GraphQL

Linera uses GraphQL as the primary query language for interfacing with different
parts of the system. GraphQL is a query language developed by Facebook which
enables client to craft queries such that they receive exactly what they want
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
