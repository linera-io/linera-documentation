# Deploying the Application

To deploy your application, use the `linera project publish` command while also specifying:

1. The path of the project (defaults to `CWD`)
2. The JSON encoded initialization arguments

```bash
linera --storage $LINERA_STORAGE --wallet $LINERA_WALLET project publish \
  --json-argument "42"
```
