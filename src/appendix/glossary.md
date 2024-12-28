# Glossary

1. **Address**: A unique alphanumeric identifier representing an entity on the Linera network.

2. **Admin Chain**: A special chain on the Linera Network where validators can join or leave, and where new epochs are defined.

3. **Application**: Code deployed on the Linera network, similar to a smart contract on Ethereum. It consists of two parts: a metered **contract** (which executes business logic and modifies state) and an unmetered **service** (which provides read-only access to the application's state).

4. **Byzantine Fault-Tolerant (BFT)**: A system that can continue to function correctly and reach consensus even if some components fail or act maliciously.

5. **Block Height**: The number of blocks that precede a given block on a specific microchain.

6. **Block Proposal**: A candidate block suggested by a chain owner, which may be selected in the next block height.

7. **Bytecode**: A collection of binary instructions that can be executed by the Wasm virtual machine.

8. **Client**: The `linera` program, a local node and wallet used by users to interact with the network. Clients propose new blocks, while validators primarily react to them.

9. **Certificate**: A value signed by a quorum of validators, confirming the finality of a block (i.e., that it has been added to the chain).

10. **Committee**: The group of validators for a specific epoch, along with their voting weights.

11. **Chain Owner**: The entity (represented by an alphanumeric identifier derived from their public key hash) that owns a user chain or permissioned chain.

12. **Channel**: A broadcast mechanism that enables publish-subscribe behavior across chains.

13. **Contract**: The metered component of an application that executes business logic and modifies the state.

14. **Cross-Application Call**: A call made from one application to another on the same chain.

15. **Cross-Chain Message**: A message containing data sent between chains, allowing asynchronous communication for applications running on different chains.

16. **Devnet**: A test deployment of the Linera protocol used for experimentation and development. Validators are often controlled by a single operator, and devnets can be reset at any time. Devnets do not handle real assets.

17. **Epoch**: A time period during which a specific set of validators with defined voting weights can certify new blocks. Epochs can overlap, and each chain explicitly transitions from one epoch to the next.

18. **Genesis Configuration**: The initial configuration of a newly created network, including the initial validators' voting weights, fee structure, and starting chains.

19. **Inbox**: A data structure that stores incoming messages for a specific chain.

20. **Mainnet**: The production deployment of the Linera network, handling real assets and transactions.

21. **Message**: See 'Cross-Chain Message'.

22. **Microchain**: A lightweight blockchain that holds a subset of the network's state, running on every validator. All Linera chains are microchains.

23. **Network**: The entire set of participants in the Linera protocol, including validators, clients, and auditors.

24. **Operation**: An action performed on a chain, either a transaction added to a block by its creator or a call to an application from another source. Users initiate operations to interact with applications on their chains.

25. **Permissioned Chain**: A microchain owned by multiple users, where block proposals are made by different users based on their weighted stakes.

26. **Project**: A collection of files and dependencies that are compiled into bytecode and deployed as an application on the Linera network.

27. **Public Chain**: A microchain that uses full BFT consensus and enforces strict permissions for network operation.

28. **Quorum**: A set of validators holding more than ⅔ of the total stake. A quorum is required to issue a certificate.

29. **Single-Owner Chain**: A chain owned by a single user, also known as a **User Chain**. Only the owner can propose blocks and advance the chain’s state.

30. **Service**: The read-only component of an application that provides access to its state without modifying it.

31. **Shard**: A logical subset of microchains handled by a specific validator, corresponding to a physical **worker**.

32. **Stake**: The tokens pledged by a validator or auditor as collateral to ensure their honest participation in the network.

33. **Testnet**: A deployment of the Linera protocol used for testing and development, typically operated by multiple validators. Testnets do not handle real assets but help prepare the network for mainnet launch.

34. **User Chain**: A chain owned by a single user, sometimes called a **Single-Owner Chain**. Only the owner can propose blocks and directly modify the chain’s state.

35. **Validator**: Entities that run servers to validate and execute blocks across all chains in the network. They cryptographically certify blocks and ensure the integrity of the network.

36. **View**: A mechanism for mapping complex types to key-value stores, similar to Object-Relational Mapping (ORM). Views represent full or partial in-memory states that are stored in a key-value database.

37. **Wallet**: A file containing a user's public and private keys, along with information about the chains they own and configuration settings.

38. **WebAssembly (Wasm)**: A binary instruction format executed by a stack-based virtual machine. Linera applications are compiled into Wasm and run inside validators and clients.

39. **Web3**: The next phase of the internet, focused on decentralization and powered by blockchains and smart contracts.

40. **Worker**: A process running on a validator that handles a subset of microchains. Each worker corresponds to a logical **shard**.
