# Debugging

This section covers potential issues with validator deployments and how to
resolve them.

## Common Issues

In software engineering there are many ways things can go wrong. Below we
outline a few of the common occurences with Linera validator and how to resolve
them.

### `shard-init` process is stuck

The `shard-init` process is responsible for initialising the database and
shards.

The database inside a validator, ScyllaDB, can take some time to initialise as
it performs performance checks and tunes itself against the underlying
hardware - this should take about 10 minutes.

If the `shard-init` process is _still_ stuck after that, the issue is usually:

1. Not enough events allowed in async I/O contexts. A resolution is outlined
   [here](requirements.md#scylladb-configuration).
2. Stale volumes from a previous deployment. Docker doesn't clean up volumes
   automatically when deleting an old deployment via `docker compose down` or
   even when running `docker system prune -a`. The old stale volumes need to be
   removed epxlicitly via `docker volume rm ...`.

If neither of these fixes resolves the issue, a closer of inspection of the logs
is required.

### `pull access denied`

When deploying a validator you can either build the Docker image yourself or use
a pre-built remote image provided by Linera.

The Docker Compose manifest looks for the `LINERA_IMAGE` environment variable
which is usually set by the default script. If it is not found, it defaults to
the value `linera`, which is assumed to exist as an image locally.

To resolve this issue either explicitly specify the `LINERA_IMAGE` or ensure
that the
[image is built locally](manual-installation.md#building-the-linera-docker-image).

### `Access denied to genesis.json`

This occurs when the Genesis Configuration URL is malformed via string
formatting. The deploy script uses the name of the current branch to create the
URL so make sure you have checked out `{{#include ../../../RELEASE_BRANCH}}`.

## Support

Support and communication with the core team is done via the `#validator`
private channel in the [Linera Discord](https://discord.com/invite/linera).

If there are any outstanding issues which could not be resolved by consulting
this document, you can reach out there.
