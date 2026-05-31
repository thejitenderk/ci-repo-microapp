# TaskFlow — React CI/CD Practice App

A React task manager app built specifically for practicing CI/CD pipelines with Docker.

## Tech Stack
- **React 18** — Frontend
- **nginx** — Serves the production build
- **Docker** — Multi-stage build (node → nginx)
- **GitHub Actions** — CI/CD pipeline

---

## Local Development

```bash
npm install
npm start          # http://localhost:3000
npm test           # Run tests
npm run build      # Production build
```

---

## Docker

### Build the image
```bash
docker build -t react-cicd-app .
```

### Run the container
```bash
docker run -p 8080:80 react-cicd-app
# App available at http://localhost:8080
```

### Health check
```bash
curl http://localhost:8080/health
# → OK
```

---

## CI/CD Pipeline (GitHub Actions)

The workflow at `.github/workflows/ci.yml` does:

1. **Test** — Runs `npm test` on every push/PR
2. **Build & Push** — Builds the Docker image and pushes to Docker Hub (on `push` to `main`/`develop` only, after tests pass)

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token (not your password) |

### Image Tags
- `latest` — only on `main` branch
- `main` / `develop` — branch name
- `sha-<commit>` — full traceability

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_VERSION` | `1.0.0` | Shown in app header |
| `REACT_APP_ENV` | `development` | Shown as env badge |

Pass during build:
```bash
docker build \
  --build-arg REACT_APP_VERSION=2.0.0 \
  --build-arg REACT_APP_ENV=production \
  -t react-cicd-app .
```
