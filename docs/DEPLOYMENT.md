# Deployment & Infrastructure Guide

This guide details how to deploy **RepoRevenant** to Render, configure local Ollama / Gemma 3, and connect MongoDB Atlas.

---

## 1. Deploying on Render

RepoRevenant is configured for seamless deployment as a **Render Web Service**.

### Option A: Render Dashboard
1. Fork or push the repo to GitHub.
2. In Render, select **New +** → **Web Service**.
3. Connect your repository (`repo-revenant`).
4. Configure the service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Node Version**: `20.x` or `22.x`
5. Configure Environment Variables:
   - `APP_URL`: Your Render public URL (e.g. `https://repo-revenant.onrender.com`)
   - `OLLAMA_BASE_URL`: Remote Ollama instance or local tunnel (e.g., ngrok or cloud endpoint)
   - `OLLAMA_MODEL`: `gemma3:4b`
   - `GITHUB_TOKEN`: *(Optional)* GitHub Personal Access Token for 5,000 requests/hr
   - `MONGODB_URI`: *(Optional)* MongoDB Atlas connection string
   - `MONGODB_DATABASE`: `repo_revenant`
   - `SENTRY_DSN`: *(Optional)* Sentry project DSN

### Option B: render.yaml (Infrastructure as Code)
Create or verify `render.yaml` in the repository root:

```yaml
services:
  - type: web
    name: repo-revenant
    env: node
    plan: starter
    buildCommand: npm install && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_VERSION
        value: 22.0.0
      - key: OLLAMA_BASE_URL
        value: http://localhost:11434
      - key: OLLAMA_MODEL
        value: gemma3:4b
```

---

## 2. Setting Up Local Ollama & Gemma 3

RepoRevenant uses Google's open-weight **Gemma 3** as its sovereign intelligence layer.

1. **Install Ollama**:
   - macOS / Linux: `curl -fsSL https://ollama.com/install.sh | sh`
   - Windows: Download installer from [ollama.com/download](https://ollama.com/download)

2. **Pull and Run Gemma 3 (4B)**:
   ```bash
   ollama run gemma3:4b
   ```

3. **Verify API is reachable**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

4. **Configuring in RepoRevenant**:
   Set in `.env.local`:
   ```bash
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=gemma3:4b
   ```

> **Fallback Guarantee**: If Ollama is offline or the model is loading, RepoRevenant automatically falls back to grounded deterministic heuristics and displays clear diagnostic advice.

---

## 3. Setting Up MongoDB Atlas (Optional)

RepoRevenant includes an automatic in-memory persistence layer for local zero-config development. To persist investigations across restarts:

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your IP (or allow `0.0.0.0/0` for cloud deployment).
3. Copy the SRV connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   ```
4. Add to `.env.local`:
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DATABASE=repo_revenant
   ```

Collections will be initialized automatically on the first investigation.
