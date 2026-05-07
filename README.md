# VOID ARENA

<p align="center">
  <img src="https://raw.githubusercontent.com/douglasopan/VOID-ARENA/main/public/logo.png" width="400" />
</p>

<h3 align="center">Consume. Grow. Dominate.</h3>

Void Arena is a 3D city-swallowing arena game built with Vite, TypeScript, Three.js, Express, and Socket.IO. It includes solo play, bot matches, online room infrastructure, mobile touch controls, in-world ads, player profiles, match history, multi-language UI groundwork, and customizable void rims.

## About

VOID ARENA is a competitive multiplayer game where players control gravitational voids that consume structures, vehicles, trees, NPCs, objects, parts of the city, and other players.

The core loop is simple:

- Hunt
- Consume
- Grow
- Dominate
- Repeat

The long-term vision is a replayable, scalable multiplayer game with physics-based interaction, environmental destruction, procedural arenas, ranked systems, cosmetics, persistent progression, and streamable chaos.

## Tech Stack

- Vite
- TypeScript
- Three.js
- Express
- Socket.IO
- Node.js

## Running Locally

```bash
npm install
npm run dev
```

The client opens at `http://localhost:5173` and the multiplayer server runs at `http://localhost:3001`.

To run them separately:

```bash
npm run dev:client
npm run dev:server
```

## Environment

Copy `.env.example` to `.env` when configuring local or production URLs.

Client:

```bash
VITE_MULTIPLAYER_SERVER_URL=http://localhost:3001
```

Server:

```bash
PORT=3001
HOST=0.0.0.0
CLIENT_ORIGIN=http://localhost:5173
```

In production, `VITE_MULTIPLAYER_SERVER_URL` must point to the public Socket.IO server URL. The Vercel client also accepts `?server=https://your-server-url` for quick testing and saves that URL in the browser.

## Deployment

### Frontend On Vercel

1. Import this GitHub repository in Vercel.
2. Use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Configure:
   - `VITE_MULTIPLAYER_SERVER_URL=https://your-public-realtime-server`

`vercel.json` is ready for the Vite frontend. Vercel should serve the client; the realtime multiplayer server must run on a host that supports persistent Node/WebSocket processes.

### Multiplayer Server

The multiplayer server uses Socket.IO/WebSockets. Host it on Railway, Render, Fly.io, a VPS, Docker, or another platform that keeps a Node process alive.

Recommended server environment:

```bash
PORT=3001
HOST=0.0.0.0
CLIENT_ORIGINS=https://your-game.vercel.app,https://void-arena-six.vercel.app
```

Then set the Vercel frontend variable:

```bash
VITE_MULTIPLAYER_SERVER_URL=https://your-public-realtime-server
```

The repo also includes a `Dockerfile` and `Procfile` for server-focused hosts.

## Project Structure

```text
VOID-ARENA/
  public/
  server/
  src/
  package.json
  vite.config.ts
  vercel.json
  README.md
```

## GitHub

Generated files, `node_modules`, `dist`, logs, and local smoke screenshots are ignored by Git.

Checklist before publishing:

```bash
npm run build
git status
git add .
git commit -m "Prepare Void Arena for online deploy"
git push origin main
```

Created by Douglas Pan and Codex.
