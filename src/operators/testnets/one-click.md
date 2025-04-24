## One-Click Deploy

After downloading the `linera-protocol` repository and checking out the testnet
branch `{{#include ../../../TESTNET_BRANCH}}`, you can run
`scripts/deploy-validator.sh <hostname>` to deploy a Linera validator.

For example:

```bash
$ git fetch origin
$ git checkout -t origin/{{#include ../../../TESTNET_BRANCH}}
$ scripts/deploy-validator.sh linera.mydomain.com --remote-image
```

The deployment automatically listens for new image updates and will pull them
automatically.

> Note: Optionally you can build the image from source by not specifying
> `--remote-image`.

The public key and account key will be printed after the command has finished
executing, for example:

```bash
$ scripts/deploy-validator.sh linera.mydomain.com --remote-image
...
Public Key: 02a580bbda90f0ab10f015422d450b3e873166703af05abd77d8880852a3504e4d,009b2ecc5d39645e81ff01cfe4ceeca5ec207d822762f43b35ef77b2367666a7f8
```

The public key and account key, in this case beginning with `02a` and `009`
respectively, must be communicated to the Linera Protocol core team along with
the chosen host name for onboarding in the next epoch.

For a more bespoke deployment, refer to the manual installation instructions
below.

> Note: If you have previously deployed a validator you may need to remove old
> docker volumes (`docker_linera-scylla-data` and `docker_linera-shared`).
