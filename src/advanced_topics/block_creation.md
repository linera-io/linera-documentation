## Creating New Blocks

Unlike validators in most other platforms, and unlike the workers that belong to a single
validator, Linera validators do not need to exchange messages with each other directly.
Instead, the chain owners' `client` processes make the system progress by actively
providing the required data to the validators. E.g. each command like `client transfer`,
`publish` or `open_chain` performs multiple steps to append a block containing the
token transfer, application publishing or chain creation operation:

- The client creates a new block containing the desired operation and new incoming
  effects, if there are any. It also contains the most recent block's hash to designate
  its parent. The client sends the new block to all validators.
- The validators validate the block, i.e. check that the block satisfies the conditions
  listed above, and send a cryptographic signature to the client, indicating that they
  vote to append the new block. But only if they have not voted for a different block on
  the same height earlier!
- The client ideally receives a vote from every validator, but only two thirds are
  required: These constitute a "certificate", proving that the block was confirmed.
  The client sends the certificate to every validator.
- The validators "execute" the block: They update their own view of the most recent state
  of the chain by applying all effects and operations, and if it generated any cross-chain
  messages, they send these to the appropriate workers.

To guarantee that each incoming effect in a block was actually sent by another chain,
a validator will, in the second step, only _vote_ for a block, if it has already executed
the block that sent it.
However, when receiving a valid certificate for a block that receives an effect it has not
seen yet, it will accept and _execute_ the block anyway: The certificate is proof that most
other validators have seen the effect, so it must be correct.

This procedure applies to the simplest and lowest-latency kind of chain. Clients must be
careful to never propose multiple blocks at the same height: Once two conflicting blocks
have been signed by more than a third of the validators each, it becomes impossible to
ever collect votes for one block from two thirds of the validators, and the chain is
stuck.

Therefore in practice, most users should use _shared chains_ even if they are the only
chain owner. These have two instead of one confirmation steps. The latency is slightly
higher, but it is not possible to accidentally make a chain unextendable.
