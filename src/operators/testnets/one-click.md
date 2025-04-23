## One-Click Deploy

After downloading the `linera-protocol` repository, and checking out the testnet
branch `{{#include ../../../TESTNET_BRANCH}}` you can run
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

The public key will be printed after the command has finished executing, for
example:

```bash
$ scripts/deploy-validator.sh linera.mydomain.com --remote-image
...
Public Key: 92f934525762a9ed99fcc3e3d3e35a825235dae133f2682b78fe22a742bac196
```

The public key, in this case beginning with `92f`, must be communicated to the
Linera Protocol core team along with the chosen host name for onboarding in the
next epoch.

For a more bespoke deployment, refer to the manual installation instructions
below.

> Note: If you have previously deployed a validator you may need to remove old
> docker volumes (`docker_linera-scylla-data` and `docker_linera-shared`).
