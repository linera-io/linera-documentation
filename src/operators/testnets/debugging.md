# Debugging

This section covers potential issues with validator deployments and how to
resolve them.

## Common Issues

Below we outline a few of the common occurrences with Linera validator
deployments and how to resolve them.

### `shard-init` process is stuck

The `shard-init` process is responsible for initializing the database and
shards.

The database inside a validator, ScyllaDB, can take some time to initialize as
it performs performance checks and tunes itself against the underlying
hardware - this should take about 10 minutes.

If the `shard-init` process is _still_ stuck after that, the issue is usually:

1. Not enough events allowed in async I/O contexts. A resolution is outlined
   [here](requirements.md#scylladb-configuration).
2. Stale volumes from a previous deployment. Docker doesn't clean up volumes
   automatically when deleting an old deployment via `docker compose down` or
   even when running `docker system prune -a`. The old stale volumes need to be
   removed explicitly via `docker volume rm ...`.

If neither of these fixes resolves the issue, a closer inspection of the logs is
required.

### `pull access denied`

When deploying a validator you can either build the Docker image yourself or use
a pre-built remote image provided by the Linera team.

The Docker Compose manifest looks for the `LINERA_IMAGE` environment variable
which is usually set by the default script. If it is not found, it defaults to
the value `linera`, which is assumed to exist as an image locally.

To resolve this issue either explicitly specify the `LINERA_IMAGE` or ensure
that the
[image is built locally](manual-installation.md#building-the-linera-docker-image).

### `Access denied to genesis.json`

This occurs when the genesis configuration URL is malformed via string
formatting. The deploy script uses the name of the current branch to create the
URL so make sure you have checked out `{{#include ../../../RELEASE_BRANCH}}`.

### SSL Certificate Issues with Caddy

If Caddy fails to obtain SSL certificates:

1. **Check domain DNS**: Ensure your domain points to the server's public IP
2. **Check ports**: Verify ports 80 and 443 are open and reachable:
   ```bash
   sudo netstat -tlnp | grep -E ':80|:443'
   ```
3. **Check Caddy logs**:
   ```bash
   docker compose logs web
   ```
4. **Rate limiting**: Let's Encrypt has rate limits. If hit, wait or use staging:
   ```bash
   # Edit docker/Caddyfile and add to the global section:
   acme_ca https://acme-staging-v02.api.letsencrypt.org/directory
   ```

### Port Conflicts

The validator now uses these ports:
- **80**: HTTP (Caddy for ACME challenge)
- **443**: HTTPS (Caddy reverse proxy)
- **3000**: Grafana dashboard
- **9090**: Prometheus metrics
- **19100**: Internal proxy port (not exposed externally anymore)

If you see port binding errors:
```bash
# Check what's using the ports
sudo lsof -i :80
sudo lsof -i :443

# Stop conflicting services or change ports in docker-compose.yml
```

## Support

Support and communication with the core team is done via the `#validator`
private channel in the [Linera Discord](https://discord.com/invite/linera).

If there are any outstanding issues which could not be resolved by consulting
this document, you can reach out there.
