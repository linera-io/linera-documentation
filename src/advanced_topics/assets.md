# Applications that Handle Assets

In general, if you send tokens to a chain owned by someone else, you rely on
them for asset availability: If they don't handle your messages, you don't have
access to your tokens.

Fortunately, Linera provides a solution based on temporary chains: If the number
of parties who want to participate is limited, we can make them all chain owners
using the `linera change-ownership` command, allow only one application's
operations on the chain, and allow only that operation to close the chain, using
`linera change-application-permissions`.

Such an application should have a designated operation or message that causes it
to close the chain: When that is executed, it should send back all remaining
assets, and call the runtime's `close_chain` method.

Once the chain is closed, owners can still create blocks rejecting messages.
That way, even assets that are in flight can be returned.

The
[`matching-engine` example application](https://github.com/linera-io/linera-protocol/tree/main/examples/matching-engine)
does this:

```rust,ignore
    async fn execute_operation(&mut self, operation: Operation) -> Result<(), Self::Error> {
        match operation {
            // ...
            Operation::CloseChain => {
                for order_id in self.state.orders.indices().await? {
                    match self.modify_order(order_id, ModifyAmount::All).await {
                        Ok(transfer) => self.send_to(transfer),
                        // Orders with amount zero may have been cleared in an earlier iteration.
                        Err(MatchingEngineError::OrderNotPresent) => continue,
                        Err(error) => return Err(error),
                    }
                }
                self.runtime
                    .close_chain()
                    .map_err(|_| MatchingEngineError::CloseChainError)?;
            }
        }
    }
```

This enables doing atomic swaps using the Matching Engine: If you make a bid,
you are guaranteed that at any point in time you can either get back the tokens
you are offering, or the tokens you bought.
