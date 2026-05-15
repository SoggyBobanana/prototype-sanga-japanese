# prototype-sanga-japanese

## Run a local static server

This repository includes a small Node.js static server in `server.js`.

Start a server on any port with:

```bash
node server.js 5500
```

Then open one of the pages:

- `http://127.0.0.1:5500/index.html`
- `http://127.0.0.1:5500/admin.html`

If you want a second port, run another instance on a different port:

```bash
node server.js 5501
```

Then open the same files on the second port:

- `http://127.0.0.1:5501/admin.html`
- `http://127.0.0.1:5501/index.html`

This lets you use multiple localhost ports at once.
