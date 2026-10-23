# TASKS — LAUNCH OR DIE

| Task ID | Task Description | Phase | Owner | Status | Dependencies | Acceptance Criteria |
|---|---|---|---|---|---|---|
| TASK-001 | MiroFish Upstream Audit & Pinning | Phase 0 | Agent 1 | DONE | None | Pinned commit `7657031ac01184afe2cb220f5ee3545573b5e843`, audited routes and schemas |
| TASK-002 | MiroFish Python Environment Audit | Phase 0 | Agent 1 | DONE | TASK-001 | Discovered PyPI wheel limitation (`camel-oasis` < 3.12) and disk space limits; documented dual-mode strategy |
| TASK-003 | Compile docs/MIROFISH_AUDIT.md | Phase 0 | Agent 1 | DONE | TASK-001 | Complete endpoint mappings, request/response fixtures, and Graph Reuse analysis in `docs/MIROFISH_AUDIT.md` |
| TASK-004 | Establish DECISIONS.md & INTEGRATION_CONTRACTS.md | Phase 0 | Agent 0 | DONE | TASK-001 | Strict schema contracts for Scenario, Persona, Run, Finding, Verdict, Battle |
| TASK-005 | Initialize Next.js App Shell in Startup_Analyser | Phase 1 | Agent 2 | DONE | None | App Router, Tailwind CSS, Lucide icons, Dark technical design |
| TASK-006 | Domain Models & Persistence Layer (JSON + Atlas) | Phase 1 | Agent 3 | DONE | TASK-004 | `lib/domain/types.ts`, `lib/persistence/archive_store.ts` |
| TASK-007 | Server-Side MiroFish Client & Normalizer | Phase 3 | Agent 4 | DONE | TASK-004 | `lib/mirofish/client.ts`, `lib/mirofish/normalize.ts` (single boundary) |
| TASK-008 | 5-Step Stepper UI Shell & Form Persistence | Phase 2 | Agent 2 | DONE | TASK-005 | 5-step stepper shell in `app/page.tsx` with zero-typing emergency preset |
| TASK-009 | Evidence-Backed Verdict Schema Extraction | Phase 4 | Agent 5 | DONE | TASK-004 | Findings traced directly to verbatim action logs with validation experiments and decision gates |
| TASK-010 | Strategy Battle 2-Run Sequential Engine | Phase 5 | Agent 4 | DONE | TASK-007, TASK-009 | Run A completed and stored before Run B starts; qualitative comparison with zero fake percentages |
| TASK-011 | Verification, Type Check, Build & QA Gates | Phase 8 | Agent 6 | DONE | All | `npm run build` succeeds, unit tests pass, dev server verified |
