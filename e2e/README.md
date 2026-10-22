# Shinera full-stack Playwright smoke tests

These tests launch both apps and use **real HTTP requests** to the ASP.NET Core API backed by a disposable SQL Server. The E2E-only Angular environment targets `http://127.0.0.1:5069/api`; it does not change production configuration.

## GitHub Actions

The `fullstack-e2e.yml` workflow checks out this frontend and the public backend, starts SQL Server 2022 as a service, installs .NET 10, Node 24 and Playwright Chromium, and runs the smoke suite. The backend migrates and seeds its database at startup. No production database or real administrator credentials are used.

## Local run

Check out the backend into `./backend` within the frontend working directory, or adapt `playwright.config.ts` to the local path. Run an isolated SQL Server on port 1433 and provide:

- `DataBaseServer=127.0.0.1,1433`
- `DataBaseUsername=sa`
- `DataBasePassword=<local test database password>`

Then run `npm install`, `npx playwright install chromium`, `npm run test:e2e`. Playwright starts both servers. Never run these tests against a production or shared database.

## Scope and limitations

This first stage tests the public landing, system login form/captcha, the real captcha API and authorization on the role lookup. It does **not** yet claim to verify successful admin login, tenant isolation or account lifecycle. Those require isolated test data and, where necessary, correction of existing authorization behavior. Add positive and negative tests for those contracts before enabling protected production-like workflows.

CI currently uses `npm install` because this repository has no committed package lockfile. A future change should generate and commit `package-lock.json` then use `npm ci` for reproducible installs.

## Isolation

- Temporary container database, not a production database.
- One Chromium worker in CI; tests are sequential to avoid shared state pollution.
- Traces and screenshots retained on failure.
- Test-only environment/credentials must never be deployed or reused.
