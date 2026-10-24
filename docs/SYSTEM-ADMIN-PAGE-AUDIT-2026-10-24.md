# System Admin page audit — 2026-10-24

**Scope:** Frontend Angular 22 `features/system` vs real .NET 10 Identity System endpoints. This PR is a **first stabilization slice**, not proof every legacy CRUD flow is complete.

| Page/feature | Disposition | Reason / contract |
|---|---|---|
| System login | KEEP + FIX | Real OAuth/CAPTCHA/UserInfo. Guard `/system/**` excluding login; API-only Bearer interceptor, session expiry handling |
| Dashboard | KEEP + FIX | Real `Dashboard/super-dashboard`; backend fix counts `TotalUsers` |
| Tenant list / create / edit | KEEP + FIX | Real `Tenants/pagedList`, `Tenants/{id}`, POST/PUT; corrected obsolete back link |
| Tenant overview | KEEP + IMPLEMENT | Real `GET /system/Tenants/{id}`; replaces scaffold text |
| Tenant detail Users/Roles/Groups/Permissions/Settings | DELETE | All five were standalone empty generated placeholders (`... works!`); no backend tenant-scoped business operations. Their UI links/routes/specs removed |
| System users | KEEP DIRECTORY; DISABLE CREATE/EDIT | Directory reads actual `Users/pagedList`. Create/Edit routes and list actions intentionally disabled: backend `UserCreate` sets a hardcoded non-null TenantId and `UserUpdate` always changes PasswordHash; neither is safe for System accounts. User form source retained pending corrected backend identity contract |
| System roles | KEEP + IMPLEMENT | List and RolePermission tree already had API backing. Create/Edit were empty placeholders: now live POST/PUT and correct route ID |
| System groups/membership | KEEP + FIX | Live `Groups` endpoints; exact member IDs now returned, list POST uses paging body, DELETE per `groupId/userId` (audited); do not invent bulk DELETE |
| Module / Resource / API Resource / Permission CRUD | KEEP | Existing non-placeholder list/form implementations; need deeper browser CRUD coverage in later slices |
| UI Resource | KEEP + FIX | Correct `/system/UiResources/` path from old `/Identity/UiResources/` |
| Menu management | KEEP + FIX | Live Menu/Category endpoints; fix category dialog state, URL verbs. Category reorder not implemented by backend, explicitly unavailable (do not fake persistence) |
| Dynamic navigation | KEEP + FALLBACK | Existing menu permission filtering retained. If legacy menu seed is empty, explicit system-only navigation fallback shows real routes; backend remains authorization authority |

## CI evidence on final reviewed branch (2026-10-24)

- [Frontend CI #40092435121](https://github.com/sholehamed/Shinera-frontend/actions/runs/40092435121) **passed** at frontend head `aea2f27dd911c7daceaac4adb60198a621a6c86a`: Angular build and **15/15 Vitest unit cases**, including 3 interceptor regression cases.
- [Full-stack E2E #40092435108](https://github.com/sholehamed/Shinera-frontend/actions/runs/40092435108) **passed** on that exact frontend head: **16/16 Playwright cases** against real ASP.NET Core and disposable SQL Server. Explicit positive System login, protected dashboard, tenant paging, browser Role CRUD and direct MenuCategory CRUD.
- [Backend Build/Unit #40091066192](https://github.com/sholehamed/Shinera-backend/actions/runs/40091066192) and [Backend real SQL Server security #40091066164](https://github.com/sholehamed/Shinera-backend/actions/runs/40091066164) both **passed** at backend PR #32 head `ca1d408ea02c5eefd5fcba7810f19928369cd6cd`.
- The frontend E2E workflow currently pins the **backend Draft PR #32 branch**. Once backend #32 merges, pin it back to `main` and recheck fullstack E2E on the integration head before frontend merge.
- These results establish tested flows only: not every legacy CRUD screen, real Production setup or commercial readiness. **Both PRs remain Draft/unmerged.**

## API integration and tests

The frontend now registers a functional interceptor that only attaches current access tokens to configured Shinera API URLs, excluding anonymous OAuth endpoints and unrelated hosts. A separate System navigation guard ensures Tenant-context sessions cannot enter System panel routes; actual live permission enforcement remains in the .NET API.

- Unit regression: API scoping, login omission and 401 invalidation.
- Browser/full-stack tests: anonymous guard, actual System admin OAuth + CAPTCHA, real Dashboard and Tenant read, Role create/edit/read/delete; real MenuCategory CRUD.
- E2E uses GitHub Actions disposable SQL Server, not mocks, with paired backend [PR #32](https://github.com/sholehamed/Shinera-backend/pull/32).

## Deferred (explicitly not claimed done)

- System User create/edit: safely model System User with `TenantId=null`, choose correct `UserType.System`, avoid forced password reset on edit, add authorization and API/E2E coverage; only then restore protected frontend routes and actions. Role assignment management UX, validation and granular error handling remain.
- Category drag reorder (missing backend contract)
- Broad Tenant-specific member management (new domain model, not System-admin placeholders)
- Real production admin bootstrap/feature-cutover and live customer deployment
- More positive Angular form-submit browser E2E and broader CRUD (Modules, Resources, GroupMembers and menu editor UI). Permission/API/UI Resource **API CRUD and browser navigation/paging are now covered**
- Dynamic menu ownership and access for non-SuperAdmin System users

Both latest frontend Build/Unit and fullstack E2E are **green**. The branch remains **Draft pending final cross-repository review and explicit merge authorization**, including a second run after restoring the E2E backend checkout to `main`. No Production mutations.


## Access-management menu and CRUD integration extension (same Draft PR, 2026-10-24)

Existing Permission, ApiResource and UiResource pages are **retained**. The System Sidebar now merges a dedicated Persian **مدیریت دسترسی** navigation section (Resources, API Resources, UI Resources and Permissions) with database-driven menus, without duplicating already configured destinations. The menu does **not** imply authorization: the live `SystemAdministrator` requirement remains on every backend endpoint.

**Root vs Resource-scope contracts:** the previous root paths (`/system/permissions`, `/system/api-resources`, `/system/ui-resources`) had no `resourceId` but called `.../undefined/pagedList`. Companion backend Draft #32 introduces three **SystemAdministrator-protected** `POST /api/system/{Permissions|ApiResources|UiResources}/pagedList` global-list endpoints and retains the original scoped `POST .../{resourceId}/pagedList`. Frontend list components select the appropriate route by real resource scope.

**Repaired existing UI:** CRUD delete actions now make real authenticated DELETE requests and reload the current page; resource-scoped API sync is available only with a valid resource context. UI Resource type choices match the backend enumeration exactly (`PAGE=0, ACTION=1, FIELD=2, WIDGET=3`) and obsolete popup/debug route discovery was removed. UI Resource model fields match the persistence entity rather than introducing fictitious Name/Scope/Deprecated options. The API Resource form requires a real HTTP verb and preserves edit state. Permission linked API/UI Resource lookup now follows selected Resource rather than querying an undefined identifier, and links submit as a real array. Form validation prevents empty submissions.

**New E2E** in `e2e/system-admin-real-api.spec.ts` covers access navigation, all three global/scoped lists, direct Create/Get/Update/Delete for API/UI Resource and Permission with a disposable Module/Resource fixture, and permission links to both resource types. **Verified PASS at executable head `67acb0305586869e7d60b0966d18b77939a081e3`: [Full-stack E2E 40096193047](https://github.com/sholehamed/Shinera-frontend/actions/runs/40096193047) completed 17/17 real Chromium/ASP.NET Core/SQL Server checks. [Frontend Build/Unit 40096193049](https://github.com/sholehamed/Shinera-frontend/actions/runs/40096193049) passed 15/15 unit cases. Later documentation-only commits have not changed executable behavior. The backend branch is pinned in frontend fullstack workflow until backend PR #32 merges; restore the backend checkout to main and rerun before frontend merge.

**Still deferred:** complete positive form-level browser automation and recovery UX across every screen, underlying platform user safe-write semantics, per-operation granular privileges in Production, and unsupported menu category reorder. Do not call any of these complete solely because CRUD endpoints exist.

**Delete dependency behavior:** The real SQL Server suite confirmed `409 Conflict` is returned when deleting a Permission still referenced by PermissionApiResource/PermissionUiResource. This is intentional FK protection: the tested operator sequence must remove the links via Permission Update (empty `permissionResources`) before deleting the Permission. UI deletion reports a failure instead of pretending success.
