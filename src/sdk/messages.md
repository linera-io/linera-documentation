# Cross-Chain Messages

On Linera, applications are meant to be multi-chain: They are instantiated on
every chain where they are used. An application has the same application ID and
bytecode everywhere, but a separate state on every chain. To coordinate, the
instances can send _cross-chain messages_ to each other. A message sent by an
application is always handled by the _same_ application on the target chain: The
handling code is guaranteed to be the same as the sending code, but the state
may be different.

For your application, you can specify any serializable type as the `Message`
type in your `ContractAbi` implementation. To send a message, return it among
the
[`ExecutionOutcome`](https://docs.rs/linera-sdk/latest/linera_sdk/struct.ExecutionOutcome.html)'s
`messages`:

```rust,ignore
    pub messages: Vec<OutgoingMessage<Message>>,
```

`OutgoingMessage`'s `destination` field specifies either a single destination
chain, or a channel, so that it gets sent to all subscribers.

If the `authenticated` field is `true`, the callee is allowed to perform actions
that require authentication on behalf of the signer of the original block that
caused this call.

The `message` field contains the message itself, of the type you specified in
the `ContractAbi`.

You can also use
[`ExecutionOutcome::with_message`](https://docs.rs/linera-sdk/latest/linera_sdk/struct.ExecutionOutcome.html#method.with_message)
and
[`with_authenticated_message`](https://docs.rs/linera-sdk/latest/linera_sdk/struct.ExecutionOutcome.html#method.with_authenticated_message)
for convenience.

During block execution in the _sending_ chain, messages are returned via
`ExecutionOutcome`s. The returned message is then placed in the _target_ chain
inbox for processing. There is no guarantee that it will be handled: For this to
happen, an owner of the target chain needs to include it in the
`incoming_messages` in one of their blocks. When that happens, the contract's
`execute_message` method gets called on their chain.

## Example: Fungible Token

In the
[`fungible` example application](https://github.com/linera-io/linera-protocol/tree/main/examples/fungible),
such a message can be the transfer of tokens from one chain to another. If the
sender includes a `Transfer` operation on their chain, it decreases their
account balance and sends a `Credit` message to the recipient's chain:

```rust,ignore
async fn execute_operation(
    &mut self,
    context: &OperationContext,
    operation: Self::Operation,
) -> Result<ExecutionOutcome<Self::Message>, Self::Error> {
    match operation {
        Operation::Transfer {
            owner,
            amount,
            target_account,
        } => {
            // ...
            self.debit(owner, amount).await?;
            let message = Message::Credit {
                owner: target_account.owner,
                amount,
            };
            Ok(ExecutionOutcome::default().with_message(target_account.chain_id, message))
        }
        // ...
    }
}
```

On the recipient's chain, `execute_message` is called, which increases their
account balance.

```rust,ignore
async fn execute_message(
    &mut self,
    context: &MessageContext,
    message: Message,
) -> Result<ExecutionOutcome<Self::Message>, Self::Error> {
    match message {
        Message::Credit { owner, amount } => {
            self.credit(owner, amount).await;
            Ok(ExecutionOutcome::default())
        }
        // ...
    }
}
```
