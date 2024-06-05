# Cross-Chain Messages

On Linera, applications are meant to be multi-chain: They are instantiated on
every chain where they are used. An application has the same application ID and
bytecode everywhere, but a separate state on every chain. To coordinate, the
instances can send _cross-chain messages_ to each other. A message sent by an
application is always handled by the _same_ application on the target chain: The
handling code is guaranteed to be the same as the sending code, but the state
may be different.

For your application, you can specify any serializable type as the `Message`
type in your `Contract` implementation. To send a message, use the
[`ContractRuntime`](https://docs.rs/linera-sdk/latest/linera_sdk/struct.ContractRuntime.html)
made available as an argument to the contract's [`Contract::load`] constructor.
The runtime is usually stored inside the contract object, as we did when
[writing the contract binary](./contract.md). We can then call
[`ContractRuntime::prepare_message`](https://docs.rs/linera-sdk/latest/linera_sdk/struct.ContractRuntime.html#prepare_message)
to start preparing a message, and then
[`send_to`](https://docs.rs/linera-sdk/latest/linera_sdk/struct.MessageBuilder.html#send_to)
to send it to a destination chain.

```rust,ignore
    self.runtime
        .prepare_message(message_contents)
        .send_to(destination_chain_id);
```

It is also possible to send a message to a subscription channel, so that the
message is forwarded to the subscribers of that channel. All that has to be done
is specify a
[`ChannelName`](https://docs.rs/linera-base/latest/linera_base/identifiers/struct.ChannelName.html)
as the destination parameter to `send_to`.

After block execution in the _sending_ chain, sent messages are placed in the
_target_ chains' inboxes for processing. There is no guarantee that it will be
handled: For this to happen, an owner of the target chain needs to include it in
the `incoming_messages` in one of their blocks. When that happens, the
contract's `execute_message` method gets called on their chain.

While preparing the message to be sent, it is possible to enable authentication
forwarding and/or tracking. Authentication forwarding means that the message is
executed by the receiver with the same authenticated signer as the sender of the
message, while tracking means that the message is sent back to the sender if the
receiver rejects it. The example below enables both flags:

```rust,ignore
    self.runtime
        .prepare_message(message_contents)
        .with_tracking()
        .with_authentication()
        .send_to(destination_chain_id);
```

## Example: Fungible Token

In the [`fungible`
example
application](https://github.com/linera-io/linera-protocol/tree/{{#include
../../../.git/modules/linera-protocol/HEAD}}/examples/fungible), such a message
can be the transfer of tokens from one chain to another. If the sender includes
a `Transfer` operation on their chain, it decreases their account balance and
sends a `Credit` message to the recipient's chain:

```rust,ignore
async fn execute_operation(&mut self, operation: Self::Operation) -> Self::Response {
    match operation {
        // ...
        Operation::Transfer {
            owner,
            amount,
            target_account,
        } => {
            self.check_account_authentication(owner)?;
            self.state.debit(owner, amount).await?;
            self.finish_transfer_to_account(amount, target_account, owner)
                .await;
            FungibleResponse::Ok
        }
        // ...
    }
}

async fn finish_transfer_to_account(
    &mut self,
    amount: Amount,
    target_account: Account,
    source: AccountOwner,
) {
    if target_account.chain_id == self.runtime.chain_id() {
        self.state.credit(target_account.owner, amount).await;
    } else {
        let message = Message::Credit {
            target: target_account.owner,
            amount,
            source,
        };
        self.runtime
            .prepare_message(message)
            .with_authentication()
            .with_tracking()
            .send_to(target_account.chain_id);
    }
}
```

On the recipient's chain, `execute_message` is called, which increases their
account balance.

```rust,ignore
async fn execute_message(&mut self, message: Message) {
    match message {
        Message::Credit {
            amount,
            target,
            source,
        } => {
            // ...
            self.state.credit(receiver, amount).await;
        }
        // ...
    }
}
```
