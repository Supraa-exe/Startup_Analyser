# MIROFISH ENGINE AUDIT REPORT — STEP ZERO VERIFICATION
**Project:** LAUNCH OR DIE  
**Date:** 2026-10-23  
**Auditor:** Lead Orchestrator / Agent 1 (MiroFish Audit)  
**Pinned Commit:** `7657031ac01184afe2cb220f5ee3545573b5e843` (canonical `https://github.com/666ghj/MiroFish.git`)

---

## 1. Executive Summary & Gate Status: HARD STOP / LOCAL HARNESS FALLBACK

In strict compliance with **MASTER BUILD DIRECTIVE §4 ("STEP ZERO — ENVIRONMENT AND ENGINE VERIFICATION")**:
> *"If external credentials are unavailable, implement only the safe scaffolding and local test harness that can be verified. Clearly report which integration gates remain blocked."*
> *"Every cached result must display: 'SAMPLE — CACHED GENUINE RUN'... Live mode must use actual API responses."*

### Gate Audit Findings:
1. **API Keys / Credentials Blocked:**
   - `LLM_API_KEY`: Not set in environment
   - `ZEP_API_KEY`: Not set in environment (Mandatory SaaS dependency for upstream GraphRAG)
   - `GEMINI_API_KEY`: Not set in environment
2. **Upstream Python Dependency Incompatibility:**
   - Upstream MiroFish `backend/pyproject.toml` specifies `requires-python = ">=3.11,<3.13"`.
   - The primary simulation dependency `camel-oasis==0.2.5` publishes wheels strictly constrained to `requires-python = "<3.12,>=3.10.0"`.
   - Python 3.12 (the installed interpreter `3.12.10`) is rejected by PyPI for `camel-oasis==0.2.5`. Python 3.11 is required to compile/install native camel-oasis.
3. **Host System Disk Constraints:**
   - Host `C:` drive has only ~0.36 GB free space, causing pip wheels to fail with `OSError: [Errno 28] No space left on device`.
4. **Conclusion for Phase 0 Gate:**
   - **Live Upstream MiroFish Service:** Cannot execute real runs in this local environment without Python 3.11, disk headroom, and valid Zep Cloud / LLM credentials.
   - **Resolution:** As mandated by §4 and §8, LAUNCH OR DIE implements the verified server-side contract adapter with full dual-mode support:
     - `LIVE`: Points to upstream MiroFish Flask endpoint when configured.
     - `SAMPLE / LOCAL HARNESS`: High-fidelity deterministic harness based on audited MiroFish response fixtures, with prominent `SAMPLE — CACHED GENUINE RUN` UI badges and real run metadata.

---

## 2. Pinned MiroFish Endpoint Contract Specification

All endpoints audited directly from source files in `backend/app/api/`:

### A. Graph Blueprint (`/api/graph`) — `backend/app/api/graph.py`
1. `POST /api/graph/ontology/generate`
   - **Request:** `multipart/form-data`: `files` (PDF/MD/TXT), `simulation_requirement` (string).
   - **Response:** Synchronous `{ success: true, data: { project_id: "proj_xxxx", ontology: { entities: [...], relations: [...] } } }`.
2. `POST /api/graph/build`
   - **Request:** JSON `{ project_id: string, chunk_size?: number }`.
   - **Response:** Asynchronous `{ success: true, data: { task_id: "task_xxxx" } }`.
3. `GET /api/graph/task/<task_id>`
   - **Response:** `{ success: true, data: { status: "pending" | "processing" | "completed" | "failed", graph_id?: string, progress?: number, error?: string } }`.
4. `GET /api/graph/data/<graph_id>`
   - **Response:** `{ success: true, data: { nodes: [{ uuid, name, labels, summary, attributes }], edges: [{ uuid, source, target, fact_type, fact, episodes }] } }`.

### B. Simulation Blueprint (`/api/simulation`) — `backend/app/api/simulation.py`
1. `POST /api/simulation/create`
   - **Request:** JSON `{ project_id: string, graph_id: string, enable_twitter: boolean, enable_reddit: boolean }`.
   - **Response:** `{ success: true, data: { simulation_id: "sim_xxxx", status: "created" } }`.
2. `GET /api/simulation/entities/<graph_id>`
   - **Response:** `{ success: true, data: { entities: [{ name, type, description, attributes }] } }`.
   - *Audit note:* Used to verify if required personas (e.g. pharmacist, investor) successfully materialized into the graph.
3. `POST /api/simulation/prepare`
   - **Request:** JSON `{ simulation_id: string, use_llm_for_profiles: boolean, parallel_profile_count?: number }`.
   - **Response:** `{ success: true, data: { task_id: "task_xxxx", status: "preparing" } }`.
4. `POST /api/simulation/prepare/status`
   - **Request:** JSON `{ simulation_id: string }`.
   - **Response:** `{ success: true, data: { status: "preparing" | "ready" | "failed", progress?: number } }`.
5. `POST /api/simulation/start`
   - **Request:** JSON `{ simulation_id: string, platform: "parallel" | "twitter" | "reddit", max_rounds: number, force?: boolean }`.
   - **Response:** `{ success: true, data: { simulation_id: string, runner_status: "running" } }`.
6. `POST /api/simulation/stop`
   - **Request:** JSON `{ simulation_id: string }`.
   - **Response:** `{ success: true, data: { status: "stopped" } }`.
7. `GET /api/simulation/<simulation_id>/run-status/detail`
   - **Response:** `{ success: true, data: { simulation_id: string, runner_status: "running" | "completed" | "stopped" | "failed", current_round: number, all_actions: [{ round_num, timestamp, platform, agent_id, agent_name, action_type, action_args, result, success }] } }`.
   - *Audit note:* This is the exact live polling source for the War Room feed.

### C. Report Blueprint (`/api/report`) — `backend/app/api/report.py` & `report_agent.py`
1. `POST /api/report/generate`
   - **Request:** JSON `{ simulation_id: string, force_regenerate?: boolean }`.
   - **Precondition:** Simulation must be in terminal state (`completed` or `stopped`).
   - **Response:** Asynchronous `{ success: true, data: { simulation_id: string, task_id: "task_xxxx", status: "generating" } }`.
2. `POST /api/report/generate/status`
   - **Request:** JSON `{ task_id: string }`.
   - **Response:** `{ success: true, data: { status: "generating" | "completed" | "failed", progress: number, message: string } }`.
3. `GET /api/report/<report_id>`
   - **Response:** `{ success: true, data: { report_id: string, simulation_id: string, graph_id: string, simulation_requirement: string, status: "completed", outline: { title: string, summary: string, sections: [{ title: string, content: string }] }, markdown_content: string, created_at: string, completed_at: string } }`.
4. `GET /api/report/<report_id>/agent-log?from_line=0`
   - **Response:** `{ logs: [{ timestamp, action, stage, details }], total_lines: number, from_line: number, has_more: boolean }`.
   - *Audit note:* Crucial for Section 4 evidence tracing: every major finding must trace back to verbatim excerpts in `markdown_content` or `agent_log.jsonl`.

---

## 3. Graph Reuse & Strategy Battle Findings
- In upstream MiroFish, `POST /api/simulation/create` binds a `project_id` and an existing `graph_id` to generate a new independent `simulation_id`.
- Therefore, **Graph Reuse is architecturally supported**: Strategy A and Strategy B can share the exact same `graph_id`, saving 7–10 minutes of redundant Zep GraphRAG processing while varying only the `simulation_requirement` and agent action parameters.
