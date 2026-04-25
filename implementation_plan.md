# Rohit's Day 1 & Day 2 Implementation Plan

This plan focuses strictly on the tasks assigned to **Rohit** in the `MIGRATION_PLAN.md`.

## User Review Required

> [!IMPORTANT]
> The Day 1 task involves capturing "200+ production request/response pairs." Since I don't have direct access to your live Flask production logs, I will set up the **infrastructure and structure** for these fixtures. I'll need your guidance on where I can find the raw data to populate these files.

> [!WARNING]
> High concurrency (100+ users) requires specific agent settings. I will be implementing a persistent `https.Agent` to minimize TLS handshake overhead.

## Proposed Changes

---

### [Phase 1: Day 1 - Contract Fixtures]

#### [NEW] [fixtures directory](file:///home/rohit/projects/Emergence_Webapp_Backend/tests/contract/fixtures)
*   Create the directory structure to house the "Parity Oracle."
*   `tests/contract/fixtures/auth/`
*   `tests/contract/fixtures/war_room/`
*   `tests/contract/fixtures/sourcing_leads/`

#### [NEW] [README.md](file:///home/rohit/projects/Emergence_Webapp_Backend/tests/contract/fixtures/README.md)
*   Define the JSON structure for a fixture (e.g., `request`, `response`, `headers`, `status`).

---

### [Phase 2: Day 2 - Salesforce Hardening]

#### [MODIFY] [salesforce.service.ts](file:///home/rohit/projects/Emergence_Webapp_Backend/src/shared/services/integrations/salesforce.service.ts)
*   Import `https` from Node.js.
*   Configure a global `https.Agent` with:
    *   `keepAlive: true`
    *   `keepAliveMsecs: 1000`
    *   `maxSockets: 100` (to match the 100+ user target)
*   Inject the agent into the `jsforce.Connection` configuration.

## Open Questions

> [!IMPORTANT]
> **Data Capture:** Do you already have the 200+ production request/response pairs exported from Flask? If so, where should I pull them from?

> [!QUESTION]
> **Testing Suite:** Hari is tasked with the "contract-test harness" on Day 1. Should I coordinate with him on the file format, or should I establish the format now?

## Verification Plan

### Automated Tests
*   Run a connectivity test using the new `keepAlive` agent to ensure Salesforce still accepts connections.
*   Verify that the `fixtures` directory is correctly structured.

### Manual Verification
*   Check the Node process with a monitoring tool (like `top` or `pm2 monit` later) to see if socket reuse is working.
*   Verify that the `MIGRATION_PLAN.md` requirements for Day 2 are fully satisfied.
