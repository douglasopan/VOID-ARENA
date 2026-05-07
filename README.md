# Void Arena

Void Arena e um jogo 3D multiplayer feito com Vite, TypeScript, Three.js, Express e Socket.IO.

## Rodar localmente

```bash
npm install
npm run dev
```

O cliente abre em `http://localhost:5173` e o servidor multiplayer em `http://localhost:3001`.

Para rodar separado:

```bash
npm run dev:client
npm run dev:server
```

## Variaveis de ambiente

Copie `.env.example` para `.env` quando precisar configurar URLs locais ou de producao.

Cliente:

```bash
VITE_MULTIPLAYER_SERVER_URL=http://localhost:3001
```

Servidor:

```bash
PORT=3001
HOST=0.0.0.0
CLIENT_ORIGIN=http://localhost:5173
```

Em producao, `VITE_MULTIPLAYER_SERVER_URL` deve apontar para a URL publica do servidor Socket.IO.

## Deploy rapido

### Frontend na Vercel

1. Suba este repositorio no GitHub.
2. Na Vercel, importe o repositorio.
3. Use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Configure a variavel:
   - `VITE_MULTIPLAYER_SERVER_URL=https://sua-url-do-servidor-multiplayer`

O arquivo `vercel.json` ja deixa o projeto pronto para deploy do frontend Vite.

### Servidor multiplayer

O multiplayer usa Socket.IO/WebSockets. Vercel Functions nao devem ser usadas como servidor WebSocket persistente. A propria documentacao da Vercel informa essa limitacao e recomenda provedores realtime externos ou um servidor separado:

- https://vercel.com/docs/limits/overview#websockets
- https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections

Para manter o jogo multiplayer online, hospede o servidor em uma plataforma que aceite processos Node com WebSockets, como Railway, Render, Fly.io, VPS ou Docker.

Comandos comuns para o servidor:

```bash
npm install
npm start
```

Variaveis recomendadas:

```bash
PORT=3001
HOST=0.0.0.0
CLIENT_ORIGIN=https://seu-jogo.vercel.app
```

Tambem ha `Dockerfile` e `Procfile` para facilitar deploy em hospedagens que detectam Docker ou processos web.

## GitHub

Arquivos gerados, `node_modules`, `dist`, logs e screenshots locais ficam fora do Git via `.gitignore`.

Checklist antes de publicar:

```bash
npm run build
git status
git add .
git commit -m "Prepare Void Arena for online deploy"
git push origin main
```
