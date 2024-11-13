# Joining an Existing Testnet

In this section, we use Docker Compose to run a validator and join an existing
Testnet.

## Infrastructure Requirements

Validators run via Docker Compose do not come with a pre-packaged load balancer
to perform TLS termination (unlike validators running on Kubernetes).

The load balancer configuration **must** have the following properties:

1. Support HTTP/2 connections.
2. Support gRPC connections.
3. Support long-lived HTTP/2 connections.
4. Support a maximum body size of up to 20 MB.
5. Provide TLS termination with a certificate signed by a known CA.

Finally, the load balancer that performs TLS termination must redirect traffic
from `443` to `19100` (the port exposed by the proxy).

### Using Nginx

Minimum supported version: 1.18.0.

Below is an example Nginx configuration which upholds the infrastructure
requirements found in `/etc/nginx/sites-available/default`:

```
server {
        listen 80 http2;

        location / {
                grpc_pass grpc://127.0.0.1:19100;
        }
}

server {
    listen 443 ssl http2;
    server_name <hostname>; # e.g. my-subdomain.my-domain.net

    # SSL certificates
    ssl_certificate <ssl-cert-path>; # e.g. /etc/letsencrypt/live/my-subdomain.my-domain.net/fullchain.pem
    ssl_certificate_key <ssl-key-path>; # e.g. /etc/letsencrypt/live/my-subdomain.my-domain.net/privkey.pem;

    # Proxy traffic to the service running on port 19100.
    location / {
        grpc_pass grpc://127.0.0.1:19100;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    keepalive_timeout 10m 60s;
    grpc_read_timeout 10m;
    grpc_send_timeout 10m;

    client_header_timeout 10m;
    client_body_timeout 10m;
}
```

### Using Caddy

Minimum supported version: v2.4.3

Below is an example Caddy configuration which upholds the infrastructure
requirements found in `/etc/caddy/Caddyfile`:

```
example.com {
  reverse_proxy localhost:19100 {
    transport http {
      versions h2c
      read_timeout 10m
      write_timeout 10m
    }
  }
}
```

### ScyllaDB Configuration

ScyllaDB is an open-source distributed NoSQL database built for high-performance
and low-latency. Linera validators use ScyllaDB as their persistent storage.

ScyllaDB may require kernel parameters to be modified in order to work.
Specifically the number of events allowed in asynchronous I/O contexts.

To set this run:

```bash
echo 1048576 > /proc/sys/fs/aio-max-nr
```

## One-Click Deploy

> Note: This section was only tested under Linux.

After downloading the `linera-protocol` repository, and checkout the testnet
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

### Verifying installation

To verify the installation, you can use the `query-validator` command. For
example:

```
$ linera wallet init --with-new-chain --faucet https://faucet.{{#include ../../../TESTNET_DOMAIN}}.linera.net
$ linera query-validator grpcs:my-domain.com:443

RPC API hash: kd/Ru73B4ZZjXYkFqqSzoWzqpWi+NX+8IJLXOODjSko
GraphQL API hash: eZqzuBlLT0bcoQUjOCPf2j22NfZUWG95id4pdlUmhgs
WIT API hash: 4/gsw8G+47OUoEWK6hJRGt9R69RanU/OidmX7OKhqfk
Source code: https://github.com/linera-io/linera-protocol/tree/

0cd20d06af5262540535347d4cc6e5952a921d1a6a7f6dd0982159c9311cfb3e
```

The last line is the hash of the network's genesis configuration.

## Manual Installation

This section covers everything you need to install to run a Linera validator
node with Docker Compose.

> Note: This section was only tested under Linux.

### Docker Compose Requirements

To install Docker Compose see the
[installing Docker Compose](https://docs.docker.com/compose/install/) section in
the Docker docs.

### Installing the Linera Toolchain

> When installing the Linera Toolchain, you **must** check out the
> `{{#include ../../../TESTNET_BRANCH}}` branch.

To install the Linera Toolchain refer to the
[installation section](../../developers/getting_started/installation.md#installing-from-github).

You want to install the toolchain from GitHub, as you'll be using the repository
to run the Docker Compose validator service.

## Setting up a Linera Validator

For the next section, we'll be working out of the `docker` subdirectory in the
`linera-protocol` repository.

### Creating your Validator Configuration

Validators are configured using a TOML file. You can use the following template
to set up your own validator configuration:

```toml
server_config_path = "server.json"
host = "<your-host>" # e.g. my-subdomain.my-domain.net
port = 19100
metrics_host = "proxy"
metrics_port = 21100
internal_host = "proxy"
internal_port = 20100
[external_protocol]
Grpc = "ClearText" # Depending on your load balancer you may need "Tls" here.
[internal_protocol]
Grpc = "ClearText"

[[shards]]
host = "shard"
port = 19100
metrics_host = "shard"
metrics_port = 21100

```

### Genesis Configuration

The genesis configuration describes the committee of validators and chains at
the point of network creation. It is required for validators to function.

Initially, the genesis configuration for each Testnet will be found in a public
bucket managed by the Linera Protocol core team.

An example can be found here:

```bash
wget "https://storage.googleapis.com/linera-io-dev-public/{{#include ../../../TESTNET_DOMAIN}}/genesis.json"
```

### Creating Your Keys

Now that the
[validator configuration](joining.md#creating-your-validator-configuration) has
been created and the [genesis configuration](joining.md#genesis-configuration)
is available, the validator private keys can be generated.

To generate the private keys, the `linera-server` binary is used:

```bash
linera-server generate --validators /path/to/validator/configuration.toml
```

This will generate a file called `server.json` with the information required for
a validator to operate, including a cryptographic keypair.

The public key will be printed after the command has finished executing, for
example:

```bash
$ linera-server generate --validators /path/to/validator/configuration.toml
2024-07-01T16:51:32.881255Z  INFO linera_version::version_info: Linera protocol: v0.12.0
2024-07-01T16:51:32.881273Z  INFO linera_version::version_info: RPC API hash: p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o
2024-07-01T16:51:32.881274Z  INFO linera_version::version_info: GraphQL API hash: KcS5z1lEg+L9QjcP99l5vNSc7LfCwnwEsfDvMZGJ/PM
2024-07-01T16:51:32.881277Z  INFO linera_version::version_info: WIT API hash: p//G+L8e12ZRwUdWoGHWYvWA/03kO0n6gtgKS4D4Q0o
2024-07-01T16:51:32.881279Z  INFO linera_version::version_info: Source code: https://github.com/linera-io/linera-protocol/tree/44b3e1ab15 (dirty)
2024-07-01T16:51:32.881519Z  INFO linera_server: Wrote server config server.json
92f934525762a9ed99fcc3e3d3e35a825235dae133f2682b78fe22a742bac196 # <- Public Key
```

The public key, in this case beginning with `92f`, must be communicated to the
Linera Protocol core team along with the chosen host name for onboarding in the
next epoch.

> Note: Before being included in the next epoch, validator nodes will receive no
> traffic from existing users.

### Building the Linera Docker image

To build the Linera Docker image, run the following command from the root of the
`linera-protocol` repository:

```bash
docker build --build-arg git_commit="$(git rev-parse --short HEAD)" -f docker/Dockerfile . -t linera
```

This can take several minutes.

### Running a Validator Node

Now that the genesis configuration is available at `docker/genesis.json` and the
server configuration is available at `docker/server.json`, the validator can be
started by running from inside the `docker` directory:

```bash
cd docker && docker compose up -d
```

This will run the Docker Compose deployment in a detached mode. It can take a
few minutes for the ScyllaDB image to be downloaded and started.
