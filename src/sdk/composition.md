# Calling other Applications

We have seen that cross-chain messages sent by an application on one chain are
always handled by the _same_ application on the target chain.

This section is about calling other applications using _cross-application
calls_.

Such calls happen on the same chain and typically use the `call_application`
method implemented by default in the trait `Contract`:

```rust,ignore
async fn call_application<A: ContractAbi + Send>(
    &mut self,
    authenticated: bool,
    application: ApplicationId<A>,
    call: &A::ApplicationCall,
    forwarded_sessions: Vec<SessionId>,
) -> Result<(A::Response, Vec<SessionId>), Self::Error> { .. }
```

The `authenticated` argument specifies whether the callee is allowed to perform
actions that require authentication on behalf of the signer of the original
block that caused this call.

The `application` argument is the callee's application ID, and `A` is the
callee's ABI.

`call` are the arguments of the application call, in a type defined by the
callee.

`forwarded_sessions` are session data that need to be consumed within this
transaction. Sessions will be explained in a separate section.

## Example: Crowd-Funding

The `crowd-funding` example application allows the application creator to launch
a campaign with a funding target. That target can be an amount specified in any
type of token based on the `fungible` application. Others can then pledge tokens
of that type to the campaign, and if the target is not reached by the deadline,
they are refunded.

If Alice used the `fungible` example to create a Pugecoin application (with an
impressionable pug as its mascot), then Bob can create a `crowd-funding`
application, use Pugecoin's application ID as `CrowdFundingAbi::Parameters`, and
specify in `CrowdFundingAbi::InitializationArgument` that his campaign will run
for one week and has a target of 1000 Pugecoins.

Now let's say Carol wants to pledge 10 Pugecoin tokens to Bob's campaign.

First she needs to make sure she has his crowd-funding application on her chain,
e.g. using the `linera request-application` command. This will automatically
also register Alice's application on her chain, because it is a dependency of
Bob's.

Now she can make her pledge by running the `linera service` and making a query
to Bob's application:

```json
mutation { pledgeWithTransfer(owner: "User:841…6c0", amount: "10") }
```

This will add a block to Carol's chain containing the pledge operation that gets
handled by `CrowdFunding::execute_operation`, resulting in one cross-application
call and two cross-chain messages:

First `CrowdFunding::execute_operation` calls the `fungible` application on
Carol's chain to transfer 10 tokens to Carol's account on Bob's chain:

```rust,ignore
self.call_application(
    true,                 // The call is authenticated by Carol, who signed this block.
    Self::fungible_id()?, // The Pugecoin application ID.
    &fungible::ApplicationCall::Transfer {
        owner,            // Carol
        amount,           // 10 tokens
        destination,      // Bob's chain.
    },
    vec![],
).await?;
```

This causes `Fungible::handle_application_call` to be run, which will create a
cross-chain message sending the amount 10 to the Pugecoin application instance
on Bob's chain.

After the cross-application call returns, `CrowdFunding::execute_operation`
continues to create another cross-chain message
`crowd_funding::Message::PledgeWithAccount`, which informs the crowd-funding
application on Bob's chain that the 10 tokens are meant for the campaign.

When Bob now adds a block to his chain that handles the two incoming messages,
first `Fungible::execute_message` gets executed, and then
`CrowdFunding::execute_message`. The latter makes another cross-application call
to transfer the 10 tokens from Carol's account to the crowd-funding
application's account (both on Bob's chain). That is successful because Carol
does now have 10 tokens on this chain and she authenticated the transfer
indirectly by signing her block. The crowd-funding application now makes a note
in its application state on Bob's chain that Carol has pledged 10 Pugecoin
tokens.

For the complete code please take a look at the `crowd-funding` and `fungible`
applications in the `examples` folder in `linera-protocol`.
