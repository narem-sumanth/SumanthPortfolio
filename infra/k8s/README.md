# Deploying with kustomize

## 1. Secrets

```bash
cp infra/k8s/.env.secrets infra/k8s/.env.secrets.local
# fill in real values in .env.secrets.local — it's gitignored, .env.secrets stays a blank template
```

## 2. Build images

`NEXT_PUBLIC_API_URL` is inlined into the web bundle at **build time** (see
`infra/docker/Dockerfile.web`) — setting it in `.env.configmap` or
`.env.secrets.local` has no effect, since the image is already built before
the Pod ever reads those. Pass it as a build arg instead, pointing at wherever
the API's NodePort is actually reachable from a browser:

```bash
docker build -f infra/docker/Dockerfile.api -t my-portfolio-api:local .
docker build -f infra/docker/Dockerfile.web -t my-portfolio-web:local \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:30004 .
```

## 3. Apply

```bash
kubectl apply -k infra/k8s
```

## Access (local single-node cluster — Docker Desktop / minikube)

- Web: `http://localhost:30002` (NodePort)
- API: `http://localhost:30004` (NodePort)

`CORS_ORIGINS` in `.env.secrets.local` must match the web origin above
exactly — the API checks it against the browser's `Origin` header, not
against any internal Service port.

Both services are plain `NodePort` for local/dev use. For a real cluster,
front both behind an Ingress with TLS instead of exposing raw NodePorts
directly to the internet, and point `NEXT_PUBLIC_API_URL` /
`CORS_ORIGINS` at that Ingress hostname instead of `localhost`.
