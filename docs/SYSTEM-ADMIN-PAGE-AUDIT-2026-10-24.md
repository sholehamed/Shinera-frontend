# System Admin page audit — 2026-10-24

**Scope:** Frontend Angular 22 `features/system` vs real .NET 10 Identity System endpoints. This PR is a **first stabilization slice**, not proof every legacy CRUD flow is complete.

| Page/feature | Disposition | Reason / contract |
|---|---|---|
| System login | KEEP + FIX | Real OAuth/CAPTCHA/UserInfo. Guard `/system/**` excluding login; API-only Bearer interceptor, session expiry handling |
| Dashboard | KEEP + FIX | Real `Dashboard/super-dashboard`; backend fix counts `TotalUsers` |
| Tenant list / create / edit | KEEP + FIX | Real `Tenants/pagedList`, `Tenants/{id}`, POST/PUT; corrected obsolete back link |
| Tenant overview | KEEP + IMPLEMENT | Real `GET /system/Tenants/{id}`; replaces scaffold text |
| Tenant detail Users/Roles/Groups/Permissions/Settings | DELETE | All five were standalone empty generated placeholders (`... works!`); no backend tenant-scoped business operations. Their UI links/routes/specs removed |
| System users | KEEP + FIX | Existing list and form use real `Users` endpoints; removed debugger, guard invalid form. Detailed validation/role grant UI remains a separate follow-up |
| System roles | KEEP + IMPLEMENT | List and RolePermission tree already had API backing. Create/Edit were empty placeholders: now live POST/PUT and correct route ID |
| System groups/membership | KEEP + FIX | Live `Groups` endpoints; exact member IDs now returned, list POST uses paging body, DELETE per `groupId/userId` (audited); do not invent bulk DELETE |
| Module / Resource / API Resource / Permission CRUD | KEEP | Existing non-placeholder list/form implementations; need deeper browser CRUD coverage in later slices |
| UI Resource | KEEP + FIX | Correct `/system/UiResources/` path from old `/Identity/UiResources/` |
| Menu management | KEEP + FIX | Live Menu/Category endpoints; fix category dialog state, URL verbs. Category reorder not implemented by backend, explicitly unavailable (do not fake persistence) |
| Dynamic navigation | KEEP + FALLBACK | Existing menu permission filtering retained. If legacy menu seed is empty, explicit system-only navigation fallback shows real routes; backend remains authorization authority |

## API integration and tests

The frontend now registers a functional interceptor that only attaches current access tokens to configured Shinera API URLs, excluding anonymous OAuth endpoints and unrelated hosts. A separate System navigation guard ensures Tenant-context sessions cannot enter System panel routes; actual live permission enforcement remains in the .NET API.

- Unit regression: API scoping, login omission and 401 invalidation.
- Browser/full-stack tests: anonymous guard, actual System admin OAuth + CAPTCHA, real Dashboard and Tenant read, Role create/edit/read/delete; real MenuCategory CRUD.
- E2E uses GitHub Actions disposable SQL Server, not mocks, with paired backend [PR #32](https://github.com/sholehamed/Shinera-backend/pull/32).

## Deferred (explicitly not claimed done)

- User create/edit passwords and role assignment management UX; form-level errors and server validation
- Category drag reorder (missing backend contract)
- Broad Tenant-specific member management (new domain model, not System-admin placeholders)
- Real production admin bootstrap/feature-cutover and live customer deployment
- More browser CRUD E2E: Modules, Resources, Permissions, GroupMembers, Menu UI
- Dynamic menu ownership and access for non-SuperAdmin System users

The branch is **Draft** until latest frontend Build/Unit and cross-repository real SQL Server E2E are green, and final review is requested. No Production mutations.
