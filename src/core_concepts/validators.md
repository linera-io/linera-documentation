# Validators

The validators run servers that allow users to download and create blocks. They validate,
execute and cryptographically certify blocks on all microchains. That means every single
chain is backed by the full set of validators, and has the same level of security.

Concretely, they guarantee that:

* Each block is valid, i.e. it has the correct format, its operations are allowed, the
  received effects are in the correct order, and e.g. the balance was correctly computed.
* Every effect received by one chain was actually sent by another chain.
* If one block on a particular height is certified, no other block on the same height is.

To undermine these guarantees, at least one third of the validators (weighted by their
stake) would need to cheat---in a detectable way! (Staking is not yet implemented, but in
the future, malicious validators would forfeit their stakes.)

Since validators do not propose blocks on most chains, they do *not* guarantee that any
particular operation or effect will eventually be executed on a chain. Instead, chain
owners decide whether and when to propose new blocks, and which operations and effects to
include.
The Linera client implementation will automatically include all incoming effects in new
blocks. The operations are the actions the chain owner explicitly adds, e.g. transfer.


## Scalability

Since every chain uses the same validators, adding more chains does not require adding
additional validators. Instead, it requires each individual validator to scale up and
handle the additional load.

That is why Linera allows the same validator to run multiple `server`
processes—*workers*—on different machines, each one processing a different subset of
the microchains. The workers communicate directly with each other whenever a chain sends
an effect to another chain.


## Creating New Blocks

Unlike validators in most other platforms, and unlike the workers that belong to a single
validator, Linera validators do not need to exchange messages with each other directly.
Instead, the chain owners' `client` processes make the system progress by actively
providing the required data to the validators. E.g. each command like `client transfer`,
`publish` or `open_chain` performs multiple steps to append a block containing the
token transfer, application publishing or chain creation operation:

* The client creates a new block containing the desired operation and new incoming
  effects, if there are any. It also contains the most recent block's hash to designate
  its parent. The client sends the new block to all validators.
* The validators validate the block, i.e. check that the block satisfies the conditions
  listed above, and send a cryptographic signature to the client, indicating that they
  vote to append the new block. But only if they have not voted for a different block on
  the same height earlier!
* The client ideally receives a vote from every validator, but only two thirds are
  required: These constitute a "certificate", proving that the block was confirmed.
  The client sends the certificate to every validator.
* The validators "execute" the block: They update their own view of the most recent state
  of the chain by applying all effects and operations, and if it generated any cross-chain
  messages, they send these to the appropriate workers.

To guarantee that each incoming effect in a block was actually sent by another chain,
a validator will, in the second step, only *vote* for a block, if it has already executed
the block that sent it.
However, when receiving a valid certificate for a block that receives an effect it has not
seen yet, it will accept and *execute* the block anyway: The certificate is proof that most
other validators have seen the effect, so it must be correct.

This procedure applies to the simplest and lowest-latency kind of chain. Clients must be
careful to never propose multiple blocks at the same height: Once two conflicting blocks
have been signed by more than a third of the validators each, it becomes impossible to
ever collect votes for one block from two thirds of the validators, and the chain is
stuck.

Therefore in practice, most users should use _shared chains_ even if they are the only
chain owner. These have two instead of one confirmation steps. The latency is slightly
higher, but it is not possible to accidentally make a chain unextendable.


## Changing the Set of Validators

If a new validator wants to start participating, or an old one wants to leave, all chains
must be updated.

The system has has one designated *admin chain*, where the validators can join or leave
or, and where new *epochs* are defined. During every epoch, the set of validators is
fixed.

Chain owners must then create a block that receives the `SetCommittees` effect from the
admin chain, and have it certified by the old validators. Only the *next* block in their
chain will be certified by the new validator set!

That is why epochs are planned to change infrequently—possibly once per day or per
week—, and several subsequent epochs can overlap, so that chain owners have plenty of
time to migrate their chains.
