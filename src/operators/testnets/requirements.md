# Requirements

This section covers requirements for setting up a Linera Validator and joining a
Testnet. The validator deployment has been comprehensively tested under
**Linux**. There is no official support for MacOS or Windows yet.

## Installing the Linera Toolchain

> When installing the Linera Toolchain, you **must** check out the
> `{{#include ../../../TESTNET_BRANCH}}` branch.

To install the Linera Toolchain refer to the
[installation section](../../developers/getting_started/installation.md#installing-from-github).

You want to install the toolchain from GitHub, as you'll be using the repository
to run the Docker Compose validator service.

## Docker Compose Requirements

Linera validators run under Docker compose.

To install Docker Compose see the
[installing Docker Compose](https://docs.docker.com/compose/install/) section in
the Docker docs.

## Key Management

Currently keys in Linera are stored in a JSON file in your local filesystem. For
convenience, they are currently plaintext.

Make sure to back up your keys once they are generated because if they are lost,
they are currently unrecoverable.

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

```ignore
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

```ignore
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
