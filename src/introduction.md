# Introduction

Linera aims to deliver the first multi-chain infrastructure with predictable performance,
responsiveness, and security at the Internet scale. To do so, Linera introduces the idea
of operating many parallel chains, called microchains, in the same set of validators, and
using the internal network of each validator to quickly deliver the asynchronous messages
between chains. This architecture has a number of advantages:

* **Elastic scaling.** In Linera, scalability is obtained by adding chains, not by
increasing the size or the rate of blocks. Each validator may add and remove capacity (aka
internal workers) at any time to maintain nominal performance for multi-chain
applications.

* **Responsiveness.** When microchains are operated by a single user, Linera uses a
simplified mempool-free consensus protocol inspired by reliable broadcast. This
reduces block latency and ultimately make Web3 applications more responsive.

* **Composability.** Compared to other multi-chain systems, low block latency also helps
with composability: it allows receivers of asynchronous messages from another chain to
quickly answer by adding a new block.

* **Chain security.** Compared to traditional multi-chain systems, a benefit of running
all the microchains in the same set of validators is that creating chains does not impact
the security model of Linera.

* **Decentralization.** Linera relies on delegated proof of stake (DPoS) for security.
Each microchain can be separately executed on commodity hardware. This allows clients and
auditors to continuously run their own verifications and hold validators accountable.

* **Language agnostic.** The programming model of Linera does not depend on a specific
programming language. After careful consideration, we have decided to concentrate our
efforts on Wasm and Rust for the initial execution layer of Linera.
