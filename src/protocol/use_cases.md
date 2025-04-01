# Why build on top of Linera?

We believe that many high-value use cases are currently out of reach of existing
Web3 infrastructures because of the challenges of serving **many active users**
simultaneously without degrading user experience (unpredictable fees, latency,
etc).

Examples of applications that require processing time-sensitive transactions
created by many simultaneous users include:

- real-time micro-payments and micro-rewards,

- social data feeds,

- real-time auction systems,

- turn-based games,

- version control systems for software, data pipelines, or AI training
  pipelines.

Lightweight user chains are instrumental in providing elastic scalability but
they have other benefits as well. Because user chains have fewer blocks than
traditional blockchains, in Linera, the full-nodes of user chains will be
embedded into the users' wallets, typically deployed as a browser extension.

This means that Web UIs connected to a wallet will be able to query the state of
the user chain directly (no API provider, no light client) using familiar
frameworks (React/GraphQL). Furthermore, wallets will be able to leverage the
full node as well for security purposes, including to display meaningful
confirmation messages to users.
