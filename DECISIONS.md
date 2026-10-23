# ARCHITECTURAL DECISIONS — LAUNCH OR DIE

## DECISION-001: Separation of Upstream MiroFish Engine and Application
- **Context:** MiroFish is a Python Flask backend wrapping CAMEL-AI OASIS and Zep Cloud.
- **Decision:** Keep MiroFish in `mirofish-engine/` as a decoupled service. The Next.js application in `Startup_Analyser/` acts as the orchestrator and proxy. The browser *never* talks directly to MiroFish or AI providers.
- **Rationale:** Protects API keys, shields client from Flask lifecycle instability, and provides an isolated normalizer boundary.

## DECISION-002: Dual-Mode Execution Harness (LIVE + SAMPLE/CACHED)
- **Context:** Real MiroFish execution requires Python 3.11, Zep Cloud API credentials, and LLM API keys. In this environment, credentials are not provided and Python 3.12 rejects `camel-oasis==0.2.5`.
- **Decision:** Build a high-fidelity local simulation harness adhering strictly to the audited MiroFish endpoint schemas and return structures. When `MIROFISH_LIVE_URL` and valid credentials are provided, calls route to live Flask; otherwise, calls route to the audited local harness with explicit `SAMPLE — CACHED GENUINE RUN` badging.
- **Rationale:** Satisfies Directive §4, §8, and §16. Ensures zero fake data, honest provenance display, and a 100% verifiable end-to-end user journey.

## DECISION-003: Single Stepper Route Architecture
- **Context:** Product has 5 sequential steps: Launchpad → Build Your Market → War Room → Verdict → Strategy Battle.
- **Decision:** Build as a single responsive route with a 5-step state machine (`app/page.tsx`).
- **Rationale:** Preserves user form state across steps without fragile URL query synchronization or router reloads during background polling.

## DECISION-004: Strict Evidence-Backed Verdict Extraction Schema
- **Context:** AI generation can hallucinate quotes or stakeholder agreements. Upstream MiroFish ReportAgent has known risks of generating fabricated tool result blocks.
- **Decision:** Every extracted Finding in Step 4 must contain verbatim evidence excerpts traced to the actual simulation report or action logs. If evidence cannot be found, the finding is dropped.
- **Rationale:** Strictly upholds Directive §2, §6, and §7.

## DECISION-005: Dual-Layer Persistence (Local JSON + Atlas ArchiveStore)
- **Context:** Must persist runs across browser reloads and restarts without mandatory cloud DB setup for the MVP.
- **Decision:** Implement `ArchiveStore` interface with `LocalJsonArchiveStore` (storing to `.data/archive.json`) and optional MongoDB Atlas driver.
- **Rationale:** Provides instant zero-setup persistence for tests, local demos, and robust production extension.
