# The Wallet

The Linera client is the main way to interact with the network and manage
users' wallets. Like most wallets, a Linera wallet holds user private and
public keys. Unlike most wallet applications, the Linera client also acts as a
partial node, executing blocks for chains owned by a user.

The state of the wallet lives in `wallet.json`, while the state of the chains
running on your local partial node are stored in `linera.db`.

## Chain Management

User chains are managed explicitly via the client.

### Listing Chains

To see the chains owned by your wallet, you can use the `show` command:

```bash
linera --storage $LINERA_STORAGE --wallet $LINERA_WALLET wallet show
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

Each wallet has a default chain that all commands apply to unless you specify another
`--chain` on the command line.

The default chain is set initially, when the first chain is added to the wallet.
You can check the default chain for your wallet by running:

```bash
linera --storage $LINERA_STORAGE --wallet $LINERA_WALLET wallet show
```

The Chain Id which is in green text instead of white text is your default chain.

To change the default chain for your wallet, user the `set-default` command:

```bash
linera --storage $LINERA_STORAGE --wallet $LINERA_WALLET wallet set-default <chain-id>
```

### Opening a Chain

The Linera protocol defines semantics for how new chains are created, we call
this 'opening a chain'. A chain cannot be opened in a vacuum, it needs to be
created by an existing chain on the network.

#### Open a Chain for Your Own Wallet

To open a chain for your own wallet, you can use the `open-chain` command:

```bash
linera --wallet $LINERA_WALLET --storage $LINERA_STORAGE  open-chain
```

This will create a new chain (using the wallet's default chain) and add it to
the wallet. Use the `wallet show` command to see your existing chains.

#### Open a Chain for Another Wallet

Opening a chain for another `wallet` requires an extra two steps.
Let's initialize a second wallet:

```bash
linera --wallet wallet2.json --storage rocksdb:linera2.db wallet init --genesis target/debug/genesis.json
```

First `wallet2` must create an unassigned keypair. The public part of that keypair
is then sent to the `wallet` who is the chain creator.

```bash
linera --wallet wallet2.json keygen
6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888 # this is the public key for the unassigned keypair
```

Next, using the public key, `wallet` can open a chain for `wallet2`.

```bash
linera --wallet $LINERA_WALLET open-chain --to-public-key 6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888
e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000
fc9384defb0bcd8f6e206ffda32599e24ba715f45ec88d4ac81ec47eb84fa111
```

The first line is the message ID specifying the cross-chain message that creates the new
chain. of the newly created chain. The second line is the new chain's ID.

Finally, to add the chain to `wallet2` for the given unassigned key we use
the `assign` command:

```bash
 linera --wallet wallet2.json assign --key 6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888 --message-id e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000
```
