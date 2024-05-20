# Wallets

As in traditional blockchains, Linera wallets are in charge of holding user
private keys. However, instead of signing transactions, Linera wallets are meant
to sign blocks and propose them to extend the chains owned by their users.

In practice, wallets include a node which tracks a subset of Linera chains. We
will see in the [next section](node_service.md) how a Linera wallet can run a
GraphQL service to expose the state of its chains to web frontends.

> The command-line tool `linera` is the main way for developers to interact with
> a Linera network and manage the user wallets present locally on the system.

Note that this command-line tool is intended mainly for development purposes.
Our goal is that end users eventually manage their wallets in a
[browser extension](overview.html#web3-sdk).

## Selecting a Wallet

The private state of a wallet is conventionally stored in a file `wallet.json`,
while the state of its node is stored in a file `linera.db`.

To switch between wallets, you may use the `--wallet` and `--storage` options of
the `linera` tool, e.g. as in
`linera --wallet wallet2.json --storage rocksdb:linera2.db`.

You may also define the environment variables `LINERA_STORAGE` and
`LINERA_WALLET` to the same effect. E.g. `LINERA_STORAGE=$PWD/wallet2.json` and
`LINERA_WALLET=$PWD/wallet2.json`.

Finally, if `LINERA_STORAGE_$I` and `LINERA_WALLET_$I` are defined for some
number `I`, you may call `linera --with-wallet $I` (or `linera -w $I` for
short).

## Chain Management

### Listing Chains

To list the chains present in your wallet, you may use the command `show`:

```bash
linera wallet show
╭──────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────╮
│ Chain ID                                                         ┆ Latest Block                                                                         │
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

Each row represents a chain present in the wallet. On the left is the unique
identifier on the chain, and on the right is metadata for that chain associated
with the latest block.

### Default Chain

Each wallet has a default chain that all commands apply to unless you specify
another `--chain` on the command line.

The default chain is set initially, when the first chain is added to the wallet.
You can check the default chain for your wallet by running:

```bash
linera wallet show
```

The Chain ID which is in green text instead of white text is your default chain.

To change the default chain for your wallet, user the `set-default` command:

```bash
linera wallet set-default <chain-id>
```

### Opening a Chain

The Linera protocol defines semantics for how new chains are created, we call
this "opening a chain". A chain cannot be opened in a vacuum, it needs to be
created by an existing chain on the network.

#### Open a Chain for Your Own Wallet

To open a chain for your own wallet, you can use the `open-chain` command:

```bash
linera open-chain
```

This will create a new chain (using the wallet's default chain) and add it to
the wallet. Use the `wallet show` command to see your existing chains.

#### Open a Chain for Another Wallet

Opening a chain for another `wallet` requires an extra two steps. Let's
initialize a second wallet:

```bash
linera --wallet wallet2.json --storage rocksdb:linera2.db wallet init --genesis target/debug/genesis.json
```

First `wallet2` must create an unassigned keypair. The public part of that
keypair is then sent to the `wallet` who is the chain creator.

```bash
linera --wallet wallet2.json keygen
6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888 # this is the public key for the unassigned keypair
```

Next, using the public key, `wallet` can open a chain for `wallet2`.

```bash
linera open-chain --to-public-key 6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888
e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000
fc9384defb0bcd8f6e206ffda32599e24ba715f45ec88d4ac81ec47eb84fa111
```

The first line is the message ID specifying the cross-chain message that creates
the new chain. The second line is the new chain's ID.

Finally, to add the chain to `wallet2` for the given unassigned key we use the
`assign` command:

```bash
 linera --wallet wallet2.json assign --key 6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888 --message-id e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000
```

#### Opening a Chain with Multiple Users

The `open-chain` commands is a simplified version of `open-multi-owner-chain`,
which gives you fine-grained control over the set and kinds of owners and rounds
for the new chain, and the timeout settings for the rounds. E.g. this creates a
chain with two owners and two multi-leader rounds.

```bash
linera open-multi-owner-chain \
    --chain-id e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65010000000000000000000000 \
    --owner-public-keys 6443634d872afbbfcc3059ac87992c4029fa88e8feb0fff0723ac6c914088888 \
                        ca909dcf60df014c166be17eb4a9f6e2f9383314a57510206a54cd841ade455e \
    --multi-leader-rounds 2
```

The `change-ownership` command offers the same options to add or remove owners
and change round settings for an existing chain.

## Setting up Extra Wallets Automatically with `linera net up`

For testing, rather than using `linera open-chain` and `linera assign` as above,
it is often more convenient to pass the option `--extra-wallets N` to
`linera net up`.

This option will create create `N` additional user wallets and output Bash
commands to define the environment variables `LINERA_{WALLET,STORAGE}_$I` where
`I` ranges over `0..=N` (`I=0` being the wallet for the initial chains).

Once all the environment variables are defined, you may switch between wallets
using `linera --with-wallet I` or `linera -w I` for short.

## Automation in Bash

To automate the process of setting the variables `LINERA_WALLET*` and
`LINERA_STORAGE*` after creating a local test network in a shell, we provide a
Bash helper function `linera_spawn_and_read_wallet_variables`.

To define the function `linera_spawn_and_read_wallet_variables` in your shell,
run `source /dev/stdin <<<"$(linera net helper 2>/dev/null)"`. You may also add
the output of `linera net helper` to your `~/.bash_profile` for future sessions.

Once the function is defined, call
`linera_spawn_and_read_wallet_variables linera net up` instead of
`linera net up`.
