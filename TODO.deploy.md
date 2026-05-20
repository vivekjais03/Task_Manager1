# Deployment (Railway) TODO

- [ ] Update client to use `REACT_APP_API_URL` (remove hardcoded `localhost:5000`)
- [ ] Add server CORS allowlist using `CORS_ORIGIN` (no `origin: true` in prod)
- [ ] Verify builds: `npm run build` (client) and `node server/index.js` starts
- [ ] Prepare Railway deployment plan:
  - [ ] Service: backend (set env: PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRE, CORS_ORIGIN)
  - [ ] Service: frontend (build React, set REACT_APP_API_URL)
  - [ ] Ensure HTTPS works + cookies/localStorage auth
- [ ] Smoke test endpoints and login flow after deploy

