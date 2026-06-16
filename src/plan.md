# 🛡️ Full-Stack Enterprise Deployment & Architecture Plan

This document serves as the absolute source of truth for security, runtime stability, and production readiness. AI-generated code must strictly comply with these defensive engineering standards before pushing to production.

---

## 1. 🚨 The Backend Shield Rule (Zero Trust Client)
*   **No Client-Side Business Logic:** All calculations (e.g., total amounts, discounts, validation scores) must happen on the server. Never trust data coming directly from the browser UI.
*   **Database-Level Authentication:** Every database read, update, or delete request must verify user ownership on the server side or database layer (e.g., Row Level Security or Session Token matching). Prevent IDOR vulnerabilities entirely.
*   **Input Sanitization:** All incoming user data must be parsed and verified on the server using a runtime validation library (e.g., structural schema parsing) before hitting any database query.

---

## 2. 🛡️ Type Safety & AI Error Mitigation
*   **The 'any' Ban:** The use of `any` is strictly prohibited anywhere in the codebase. AI-generated code using `any` must be rejected.
*   **The 'unknown' Protocol:** All dynamic inputs and caught errors in `try/catch` blocks must be typed as `unknown`.
*   **Type Narrowing & Guards:** No properties can be read from an `unknown` variable without explicit programmatic type guards (e.g., `instanceof Error` or structural runtime checks) to prevent silent application crashes in production.

---

## 3. 🔒 Secure Error Handling & Environment Operations
*   **Zero Raw Leakage:** Raw database system errors, internal exception messages, or database schema hints must **never** be passed to the client UI.
*   **Dual-Layer Error Architecture:**
    1.  **Server Logs:** Log the exact, unredacted error details locally/cloud-side for developer diagnostics.
    2.  **Client UI:** Return an ambiguous, clean, user-friendly localized safe message (e.g., "An unexpected system error occurred").
*   **Environment Isolation:** Never track environment credential files in Git. Use explicit configuration files to block sensitive keys from leaking into public repositories.

---

## 4. 🚀 Pre-Deployment Validation & Production Build
Before initializing any live hosting provider or production pipeline, the developer must execute a local build check to capture hidden runtime compiler errors:

1.  **Dependency Cleanse:** Ensure all code configurations are aligned with production build environments.
2.  **Execute Production Build:** Trigger the core full-stack production compilation command locally:
```bash
    # Run the production compiler based on your project manager
    npm run build  # or yarn build / pnpm build
    ```
3.  **Audit Linting and Types:** The build process must complete with **0 errors and 0 warnings**. If the compiler flags type violations or formatting exceptions, deployment is frozen until refactored securely.
4.  **Local Launch Simulation:** Boot up the native compiled bundle locally to test final asset mapping and edge server operations:
```bash
    npm run start  # or corresponding production start command
    ```