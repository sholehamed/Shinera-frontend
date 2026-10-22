# Shinera Signup + Checkout

A dark RTL signup/checkout page styled to match the Shinera public landing page.

## Flow

1. Plan + billing cycle
2. Owner account
3. BusinessProfile + Tenant(workspace) + optional Branch
4. Review + payment

## Plan parameter

Both forms are supported:

- `/start/salon-pro`
- `/start?plan=salon-pro`

Keys in the mock data:

- `solo`
- `solo-pro`
- `salon`
- `salon-pro`

## Backend handoff

The component builds a `SignupCheckoutPayload` containing:

- `planKey`
- `billingCycle`
- `tenant`
- `businessProfile`
- `owner`
- `branch`
- `metadata`

`SignupCheckoutService.useMock` is `true` by default.

When the backend is ready:

1. Set `useMock = false`.
2. Implement `POST /api/public/signup/checkout`.
3. Return:
   ```json
   {
     "checkoutId": "guid",
     "paymentUrl": "https://gateway/...",
     "mode": "gateway"
   }
   ```

## Recommended server-side flow

Do NOT depend on the browser return/callback alone.

1. `POST /api/public/signup/checkout`
   - Validate payload.
   - Check plan and price from the server-side plan catalog.
   - Reserve/check workspace slug.
   - Create a `RegistrationDraft`.
   - Hash the password immediately or avoid storing it by using a post-payment password setup flow.
   - Create `PaymentAttempt`.
   - Return gateway URL.

2. Gateway webhook/callback:
   - Verify transaction with gateway.
   - Enforce idempotency by payment/checkout id.
   - In one DB transaction create:
     - Tenant
     - BusinessProfile
     - Main Branch (or default branch)
     - Owner User
     - TenantMembership / BranchMembership
     - Subscription
   - Mark draft/payment as completed.

3. Browser success page:
   - Poll/read checkout status from backend.
   - Never mark payment successful only because query string says success.

## UX notes

- The UI intentionally says "فضای کاری" instead of "Tenant".
- Technical defaults (`fa-IR`, `Asia/Tehran`, `IRR`) are prefilled and not asked from the user.
- Multi-branch details should ideally be completed after checkout/onboarding, to keep conversion friction low.
