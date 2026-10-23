# LAUNCH OR DIE — Full Research and Build Plan
## AI startup war room powered by MiroFish — Hacktoberfest Hack Day Kolkata, Fri 2026-10-23

Research method: 12 parallel research agents, 2026-10-23. This is the single synthesis file.
Link rule (user preference): all external URLs are plain full URLs in dedicated source sections, never hyperlinked text, so they survive copy-paste into another chat.
Status labels used throughout: VERIFIED = checked against repo / official docs today. OPERATOR-REPORTED = a real user's published run, not a benchmark. UNVERIFIED = do not quote as fact.

---

# 0. VERDICT FIRST

## NO-GO as a switch today. GO-ONLY-IF four gates pass by 0:45. GO enthusiastically as the post-hackathon build (18–22 h).

**One decisive reason:** LAUNCH OR DIE's own estimate is **14 hours excluding troubleshooting, dependency setup and long simulation runs** — 4 h of that is MiroFish integration alone — and **MiroFish has never run once on your machine**. Your realistic budget today is ~3 hours. EchoNotes is already locked, decomposed to ~3 h, with fallbacks. Switching trades a de-risked 3 h plan for the first 3 h of a 14 h build whose riskiest dependency is unverified.

This is not a verdict on the idea. By learning ceiling, LAUNCH OR DIE is the strongest of your three candidates (EchoNotes, TRADECOUNCIL, LAUNCH OR DIE). Genuine multi-agent simulation beats another LLM wrapper. That argument survives being built *after* the hackathon — it does not survive being started cold at the venue.

### 0.1 The five facts that change the brief's assumptions (all VERIFIED today)

1. **MiroFish is a social-media crowd simulator, not a stakeholder simulator.** Engine = CAMEL-AI OASIS. Agents post / comment / like / repost on simulated Twitter + Reddit in parallel. There is no round-table debate, no customer/pharmacist/investor model, no unit-economics engine. LAUNCH OR DIE's 5 stakeholder personas are a *seed-document + ontology framing on top* — legitimate, but must be disclosed as such.
2. **You cannot POST a persona list.** Personas are *derived*: ontology/entity extraction from your uploaded seed document via Zep GraphRAG, then profile generation per simulation. If the pharmacist is not named, with incentives and constraints, in a 1–2 page seed brief, the pharmacist agent does not exist. Thin one-line ideas produce thin ontologies (ontology is capped at 10 entity types).
3. **One run is 15–60 minutes, not minutes.** Smallest documented useful run: ~15–20 min (44 agents, 10 rounds). Typical first run: 30–60 min end-to-end. Graph build alone (Zep, cloud) is 7–10 min. **Strategy Battle = 2 runs = ~21–29 min if the graph is reused, 30–98 min if not — and graph reuse for Battle is plausible but UNVERIFIED on the pinned checkout.** A live Battle cannot be performed inside a 3-minute demo. The demo must run on genuine pre-run cached results, labelled CACHED.
4. **Default MiroFish is open harness + closed brain + closed memory.** Code: AGPL-3.0, ~81,347 stars / ~12,322 forks. Default model: Alibaba `qwen-plus` via DashScope — proprietary, API-only, no weights (the word "Qwen" does not make the Plus tier open). Memory: Zep Cloud — proprietary SaaS, API key mandatory, no key = no graph build = no run. "Fully open-source, runs offline" is FALSE for upstream. It is true only for the separate `MiroFish-Offline` fork (Neo4j + Ollama, ~10–20 GB VRAM) — a different codebase, do not switch to it mid-event.
5. **There is no fork / resume / compare in MiroFish.** "Resume" means resuming the *same* simulation after a stop. No compare endpoint exists in the documented API (zero hits). No exposed seed or temperature in the documented API/env. Battle, comparison, parent/child lineage, and the Verdict schema are all LAUNCH OR DIE code that you must build.

### 0.2 GO-ONLY-IF — all four, by 0:45 into the event

1. One real MiroFish simulation completes end-to-end (graph → prepare → simulate → report, <40 rounds) with wall-clock time and cost logged.
2. You accept dropping from EchoNotes' 6–7 categories to **3–4 demonstrable** today.
3. The demo uses two genuine cached runs, labelled `SAMPLE — CACHED GENUINE RUN` with run IDs, timestamps, model and rounds.
4. EchoNotes Hour-0 probes are done first / in parallel, so aborting at Gate 1 still leaves a buildable EchoNotes floor.

Any one fails → abort to EchoNotes. No "15 more minutes."

### 0.3 Honest category stack count (details in §6)

| Project | Nominal | Strong (load-bearing) | Demonstrable in ~3 h today |
|---|---|---|---|
| EchoNotes | 6–7 / 8 | 5–6 | 6 |
| TRADECOUNCIL | 7 / 8 honest | 3–4 | n/a — research only, full build is day-scale |
| LAUNCH OR DIE | 6 / 8 (1 Strong-conditional, 5 Possible, 2 Forced) | 1 | **3–4** |
| LAUNCH OR DIE full build (Plan B) | 7 / 8 | 3–4 | — earned over ~1 week |

LAUNCH OR DIE full-build categories: Open-Source STRONG (conditional on open-weight model), Gemma 4 STRONG if it is the simulation model, Atlas STRONG with a real archive, Backboard Possible→Strong, DigitalOcean Possible→Strong, Gemini Possible, ElevenLabs Possible, Snowflake Possible-or-absent (recommend skip unless real cross-run data exists).

---

# 1. MIROFISH CORE AUDIT

## 1.1 Identity

- Canonical repo: https://github.com/666ghj/MiroFish
- Owner: 666ghj (Guo Hangjiang / BaiFu). Description: "A Simple and Universal Swarm Intelligence Engine, Predicting Anything."
- Official site: https://mirofish.ink/
- Created: 2025-11-26. Stars ~81,347, forks ~12,322 (2026-10-23 crawl, moving live). 322 commits, actively maintained (recent PRs #733–#740). Licence: **AGPL-3.0** — confirmed in repo header, package.json and backend/pyproject.toml.
- Predecessor: BettaFish (multi-agent public-opinion analysis), same author.
- NOT canonical — do not confuse: `nikmcfly/MiroFish-Offline` (English local fork, Neo4j + Ollama), `alex-tapio/mirofish`, `go-mirofish/go-mirofish` (Go rewrite), `MOZARTINOS/mirofish-guide` (guide, not an engine).

## 1.2 Actual stack (corrects blog errors claiming React/FastAPI)

- Frontend (upstream, which you would replace): **Vue 3 + Vite + D3.js + Tailwind**, port 3000
- Backend: **Python 3.11–3.12 only + Flask 3 + Flask-CORS**, port 5001. Python 3.13+ is NOT supported — a common first failure.
- Tooling: Node 18+, `uv` (latest), `npm run setup:all`, `npm run dev` from repo root.
- Simulation engine: **OASIS by CAMEL-AI**, pinned `camel-oasis==0.2.5`, `camel-ai==0.2.78` (Apache-2.0 upstream)
- Memory / graph: **Zep Cloud**, pinned `zep-cloud` (3.25.0 in current requirements, 3.13.0 in older snapshots — trust the raw files in your clone). Upstream does NOT use Neo4j.
- Other deps: openai >=1.0, httpx, PyMuPDF, pydantic 2, python-dotenv.
- API structure: three Flask blueprints — `graph`, `simulation`, `report` — background-thread TaskManager, **polling (not WebSockets)**, subprocess for `run_parallel_simulation.py`.

## 1.3 The 5-stage workflow

1. Graph Building — seed extraction + GraphRAG + memory injection
2. Environment Setup — entity/relationship extraction (10 entity types: 8 specific + Person + Organization; 10 relation types), persona generation, agent config
3. Simulation — dual-platform (simulated Twitter + Reddit), temporal memory updates
4. Report Generation — ReportAgent (ReACT, Zep tools: InsightForge / PanoramaSearch / InterviewAgents) writes a structured report. **Report is NOT automatic — it must be triggered explicitly after the run.**
5. Deep Interaction — chat/interview with any simulated agent or the ReportAgent (requires the simulation environment alive in "waiting for command" mode; non-replayable afterwards)

Inputs: seed = PDF / MD / TXT upload(s) **+** a `simulation_requirement` string. There is **no JSON "create scenario" endpoint**.

## 1.4 LLM requirement

From `.env.example` (VERIFIED):
```
LLM_API_KEY=
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL_NAME=qwen-plus
ZEP_API_KEY=
# Optional, ONLY if used — delete entirely if unused:
LLM_BOOST_API_KEY / LLM_BOOST_BASE_URL / LLM_BOOST_MODEL_NAME
```
- Any OpenAI-SDK-compatible endpoint works in principle. Using Gemma 4 / Gemini / a local model means pointing `LLM_BASE_URL` / `LLM_MODEL_NAME` at a compatible endpoint — **test this in the spike; do not assume a native Gemini SDK path inside MiroFish.**
- Leaving `LLM_BOOST_*` present-but-empty is a documented config failure.
- README's own warning: "High consumption, try simulations with fewer than 40 rounds first." Cost scales agents × rounds; every agent turn is LLM calls.
- Security history: CVE reports exist for MiroFish 0.1.0–0.1.2 (Werkzeug debugger PIN disclosure; REST API missing authentication, issues #483/#487). Never expose a raw MiroFish backend publicly without a reverse proxy / auth / debug-off check. Also: the upstream *frontend* stores LLM keys in browser localStorage and sends `X-LLM-*` headers — **never replicate this; proxy all calls server-side.**

## 1.5 Predictive accuracy — the honesty anchor

- No published accuracy / correlation vs real outcomes was found anywhere. No benchmark in the repo proves a default run size or accuracy.
- MiroFish's own FAQ: "Is the forecast guaranteed to be accurate? No. MiroFish is exploratory decision support, not a guarantee."
- The only third-party outcome test found (WPP lab, ~25 agents, Gemini-2.5-Flash-Lite, ~$1) predicted S&P 500 direction wrong and named none of the real top-5 stocks; Zep free tier exhausted after ~3 runs; agent count not freely controllable. One day proves nothing either way — which is itself the point.
- Fabrication risk (GitHub issue #529, per an independent review): ReportAgent's loop could generate tool-result blocks itself, so reports may contain usernames/quotes/statistics that never existed in the run, indistinguishable to the reader. **Mitigation LAUNCH OR DIE must implement: every Verdict excerpt must trace to an actual agent log / action entry; drop any quote that cannot be traced.**
- Same-model chorus: thousands of agents = one model in thousands of roles. Its errors repeat in chorus instead of cancelling. Agent count is NOT a statistical sample.
- UNVERIFIED — never quote: "#1 on GitHub Trending March 2026", "$4.1M / 30M yuan funding" (amounts conflict; README confirms only Shanda incubation/support, no amount), "built in 10 days by vibe coding", the Polymarket "2,847 agents, $4,266 profit" anecdote (single Substack claim, no audit).

---

# 2. INSTALLATION AND API — THE REAL INTEGRATION CONTRACT

## 2.1 Install paths

Source (recommended upstream):
```
git clone https://github.com/666ghj/MiroFish.git
cd MiroFish
cp .env.example .env        # fill LLM_* + ZEP_API_KEY, DELETE unused LLM_BOOST_*
npm run setup:all           # root+frontend npm install, backend uv sync (creates .venv)
npm run dev                 # MUST run from repo root; frontend :3000, backend :5001
```
Docker: `docker compose up -d` (image `ghcr.io/666ghj/mirofish:latest` — **pin a digest for the demo**, `latest` drifts; persists `backend/uploads` in a volume). Docker removes no cloud dependency: LLM + Zep keys are still mandatory.

Prerequisites: Node 18+, Python 3.11–3.12, uv latest, git. `npm run setup:all` can half-succeed (frontend OK, backend failed) and look installed — verify both ports answer.

## 2.2 Endpoint map (source-cited via DeepWiki + one live integration account; GREP YOUR CLONE BEFORE CODING — forks rename routes, response nesting varies per operation)

Step 1 — Scenario → ontology → graph:
- `POST /api/graph/ontology/generate` — multipart: `files` (PDF/MD/TXT) + `simulation_requirement`. Returns SYNCHRONOUSLY with `project_id` nested under `data`. Creates `uploads/projects/proj_xxxx/`.
- `POST /api/graph/build` — JSON `{project_id, chunk_size: 500}` → async `task_id`. Chunks seed (~500 chars), sends episodes to Zep, returns `graph_id` like `mirofish_...`.
- `GET /api/graph/tasks/{task_id}` — poll (~2 s UI poll, ~10 s graph data). Ends `completed` / `failed`.
- `GET /api/graph/projects/{project_id}` — project object incl. status, ontology, graph_id, files.
- `GET /api/graph/data/{graph_id}` — full Zep graph: nodes `{uuid, name, labels, summary, attributes}` + edges `{uuid, source, target, fact_type, fact, episodes}`. **This is the only verified source for any graph visualisation.**

Step 2 — Prepare agents:
- `POST /api/simulation/create` — `{project_id, graph_id, enable_twitter, enable_reddit}` → distinct `simulation_id`. Project ID ≠ simulation ID. State `CREATED`.
- `GET /api/simulation/entities/{graph_id}` — **check here whether your pharmacist/investor actually became agents. If not, fix the SEED, not the UI.**
- `POST /api/simulation/prepare` — `{simulation_id, use_llm_for_profiles, parallel_profile_count: 5}`. Async. Generates OASIS profiles (Twitter CSV + Reddit JSON) + LLM-generated `simulation_config.json` (hours, minutes/round, peak hours, activity, initial/hot events). Skipping prepare → start fails "simulation not prepared". Reuse check is per-simulation only (`force_regenerate=false` + files exist → returns immediately).
- `POST /api/simulation/prepare/status` — poll. State: `CREATED → PREPARING → READY`.
- Profile shape: `{agent_id, name, bio, personality, interests, stance_ideology, stance_on_topic, activity_level, posting_frequency}` — generated, not user-authored. Persona editing is NOT a verified API operation.

Step 3 — Run / poll:
- `POST /api/simulation/start` — `{simulation_id, platform: "parallel"|"twitter"|"reddit", max_rounds, force}`. `force=true` stops any running process, deletes `run_state.json` / `actions.jsonl` / `simulation.log`, keeps config/profiles, re-runs the SAME setup. Spawns subprocesses; per-platform SQLite DBs.
- `POST /api/simulation/stop` — SIGTERM, state PAUSED/STOPPED.
- `GET /api/simulation/{id}/run-status` and `GET /api/simulation/{id}/run-status/detail` — the detail endpoint (`all_actions`, `recent_actions`, twitter/reddit actions from `actions.jsonl`) **is the War Room feed. Poll it (upstream has no SSE/WebSocket). Show only what it returns.**
- `POST /api/simulation/interview` (+ `/batch`) — interview agents via IPC during/after run. Powers "chat with an agent". Not a fork mechanism.
- DANGER: a default of 720 rounds has been reported in evaluation configs. **Set `max_rounds` explicitly on every start. Target 10 rounds for LAUNCH OR DIE, ceiling <40.**

Step 4 — Report:
- `POST /api/report/generate` — `{simulation_id, graph_id, simulation_requirement}`. Async, returns `report_id` + task. Must be triggered explicitly.
- `POST /api/report/generate/status` — poll (progress %, log).
- `GET /api/report/{report_id}` (a variant `GET /api/report/get/{simulation_id}` is also cited — verify in clone). Stored at `uploads/reports/{report_id}/report.json` + `agent_log.jsonl`.
- `GET /api/report/{report_id}/agent-log?from_line=` / `console-log?from_line=` — incremental log polling (1–2 s).
- `POST /api/report/chat` — Q&A with ReportAgent over the finished run.

General response shape is usually `{success, data, error}` **but nesting varies by operation** (ontology is sync, graph status is nested, states appear as both `complete` and `completed`). Write per-operation normalisers. Never one generic unwrapper. POSTs are **non-idempotent** — retrying a state-changing call after a network drop can silently create duplicate projects/simulations. Persist every ID immediately: `project_id → graph_id → simulation_id → task_id → report_id`.

## 2.3 Timing and cost — grounded in documented runs (OPERATOR-REPORTED, not benchmarks)

| Run | Config | Time | Cost |
|---|---|---|---|
| Startup-style (operator guide) | ~15k-char seed, 44 agents, 10 rounds | **15–20 min total**: ontology 1–2, graph 7–10, personas 1–2, sim 4–6, report 0.5–1 | ~$0.01–0.06 claimed (hybrid GPT-4o-mini + Gemini Flash routing — best case) |
| Lebanon geopolitics | 3 docs ~5,000 words, 38 agents, 120 rounds, Gemini 2.0 Flash via OpenRouter | 33 min total | < $4 |
| Hormuz / Polymarket | 5,800-char brief, 200 agents, 100 rounds, GPT-4o-mini | 49 min (sim phase) | $3–5 |
| Hormuz news eval | 34 articles, 56 agents, 40 rounds, Gemini Flash, 570 actions, ~4.5M tokens | ~8 min sim phase alone; typical first sim 30–60 min end-to-end | token-heavy |
| Planning figure (MiroFish's own landing page, via secondary citation) | typical run | — | **~$5/run → Battle ≈ ~$10** |
| Large config (guides) | 800–1,200 agents, 30–50 rounds on GPT-class models | — | $10–$20/run; a 500-agent / ~50,000-call sim cited at $200–$500 — never run default-large on a frontier model |

Token model for budgeting: trimmed 5-persona ideal ≈ 405k in / 85k out ≈ $0.25–0.50 on Qwen-Plus ($0.40 in / $1.20 out per 1M, tracker price 2026-10-22 — verify in console). Realistic MiroFish run (engine expands to 50–100 acting agents): ~$1.50–$3.00, reconciling to the ~$5 planning figure with long-context tiers + retries + ReportAgent. **Budget $5/run until your own logged run proves cheaper.** Day budget: 6–10 test/rehearsal runs ≈ $10–$50 worst case. Set provider caps BEFORE the first run: DashScope alert $10 / hard cap $25; Gemini budget alert in Cloud console. Enforce `MAX_ROUNDS` + `MAX_TURNS` + a kill switch server-side.

## 2.4 What breaks most often (ranked)

1. Lifecycle/state-machine misunderstanding — an independent integrator needed 8 live runs to complete one route: ontology assumed async (it's sync), IDs nested under `data`, prepare skipped, report never triggered. The API contract can only be learned live.
2. Non-idempotent POST retries → duplicate projects/simulations.
3. LLM config: wrong key/base URL/model, region (DashScope China-Beijing vs Singapore international endpoint — test which responds acceptably from Kolkata), quota, 429s; older-build `<think>`-tag 500 bug (pull latest).
4. Zep: invalid key first fails at graph build, opaquely, after LLM setup looks fine. No local fallback for graph *construction*.
5. Environment: missing `uv`, Python outside 3.11–3.12 (incl. Pillow build errors), Node <18, running npm scripts from a subfolder, ports 3000/5001 already in use.
6. Cost blow-up from accepting generated round counts.
7. Docker volume/permission loss of `backend/uploads`; `latest` drift.
8. Thin seed → shallow ontology → generic report.
9. Chinese-first upstream UI/docs — irrelevant if you go API-first, another reason to do so.

## 2.5 THE SPIKE — Step 0, 90-minute time-box, hard kill criteria

1. Pin a commit/image digest. Install (Python 3.12 + Node 18+). Backend :5001 and frontend :3000 both answer.
2. `.env`: ONE cheap fast OpenAI-compatible model + Zep key. Delete `LLM_BOOST_*`. Provider spend cap set.
3. Seed: the exact demo idea (emergency medicine delivery) as a 1–2 page `.md` naming customer, pharmacist, delivery operator, competitor, investor — each with incentives, prices, constraints — plus `simulation_requirement` = the Strategy A question.
4. Drive the stock Vue UI once AND log every raw API request/response to files — this log becomes your Next.js client contract + fixtures.
5. Config: target 10 rounds, ceiling 40. Record wall-clock per phase, tokens/cost, all five IDs.
6. Then repeat create → prepare → start → report on the SAME `graph_id` with Strategy B's requirement. This one test decides the Battle architecture (graph reuse vs rebuild) and its true cost.
7. Exit: one real `report.json` on disk + timings logged. **Kill/pivot: no report in 90 min, or graph reuse fails and a pair exceeds ~45 min at minimal config → ship cached-sample mode over the genuine report(s) you have; promise no live simulation to judges.**

---

# 3. PRODUCT DESIGN — CORRECTED

## 3.1 The experience (as pitched, with corrections applied)

Launchpad (idea + audience + business model + one-click example chips) → Build Your Market (persona set, see §3.2) → War Room (real polled status + action excerpts) → Verdict (support / objections / unresolved assumptions / experiments with decision gates) → Strategy Battle (second run, one variable changed, same-category comparison). Headline: "Your idea has a problem. Find it before the market does."

Positioning (keep verbatim in spirit): **an assumption-testing lab, not a success predictor.** Simulated reactions are not market research, not a forecast of sales, and not advice.

## 3.2 Persona reality

The 5 demo personas (price-sensitive customer, pharmacist, delivery operator, competitor, investor) exist only insofar as the seed brief creates them. Build Your Market is therefore really a **seed-shaping screen**: each persona card's role/goal/constraint text is written INTO the seed `.md` and the `simulation_requirement`. After graph build, verify via `GET /api/simulation/entities/{graph_id}` which entities actually emerged; if a stakeholder is missing, enrich the seed and rebuild the graph. UI copy must say personas shape the seed and requirement — never promise per-agent puppeteering.

## 3.3 The Verdict — actionable by construction

Every major finding ships as a 4-part object:
- **Weakness** (one sentence)
- **Evidence** — verbatim excerpt(s) from the actual run, traceable to an action/report entry, with persona + round where exposed. No traceable excerpt → finding is dropped, not paraphrased in.
- **Validation experiment** — a real-world test: who, how many, what method (e.g. "Interview 10 potential customers about delivery fees; landing-page test at two fee levels").
- **Decision gate** — pre-stated evidence that would justify continue / change / abandon for that assumption.

Disclaimer on every Verdict screen: "Simulated stakeholder perspectives generated by AI agents. Not real market research, not medical, legal, or investment advice. Validation experiments must be run with real customers and qualified professionals."

## 3.4 What NOT to build (from the brief, endorsed by all 12 agents)

Simulated stock market / fake revenue prediction; 3D environment; enormous agent counts; full business-plan generator; auth / payments / collaboration; fake sentiment metrics as probabilities; a custom simulation engine; a database server / vector DB in the MVP (Atlas is a Plan-B upgrade, §6.4).

---

# 4. ARCHITECTURE

```
Browser
  │ HTTPS — never calls MiroFish or any internal name directly
  ▼
Next.js app (LAUNCH OR DIE)                DigitalOcean App Platform, §6.3
  ├─ app/page.tsx — ONE route, 5-step stepper state machine (§5)
  ├─ app/api/simulate/route.ts — POST create run → 202 + run_id (async, NEVER hold a request open for a sim)
  ├─ app/api/simulate/status/route.ts — poll MiroFish, persist status, return report when complete
  ├─ lib/types.ts — Run, Persona, Finding, Report (your schema, the only schema downstream code sees)
  ├─ lib/normalize.ts — SOLE file allowed to touch raw MiroFish output: loose in, strict out
  ├─ lib/google/ — scenario.ts (Gemini), personas.ts (Gemma), verdict.ts (Gemma), compare.ts (Gemini)
  ├─ lib/backboard.ts — MemoryProvider (Backboard | labelled local fallback)
  └─ lib/archive.ts — ArchiveStore (Atlas | labelled local fallback)
        │ server-side only, shared-secret header
        ▼
MiroFish backend (Flask :5001)             DigitalOcean Droplet 8 GB, Docker Compose, §6.3
  ├─ /api/graph → Zep Cloud (GraphRAG, agent memory INSIDE a world)
  ├─ /api/simulation → OASIS dual-platform sim → LLM API (OpenAI-compatible)
  └─ /api/report → ReportAgent
        │
External: LLM API (sim + extraction) · Zep Cloud · MongoDB Atlas (World Archive) ·
          Backboard (founder memory ACROSS worlds) · ElevenLabs (TTS, cached MP3s) ·
          Snowflake Cortex (pre-wired comparator ONLY, flagged, §6.6)
```

Three design rules that decide whether this works at all:
1. **Async or dead.** App Platform kills HTTP at ~100 s (community-staff figure, consistent across DO answers; jobs default 30 min). Pattern: `POST → 202 + run_id → background execution → status persisted after every phase → frontend polls every 3–5 s → fetch report when complete.` Polling must survive a page refresh: run records live server-side (Atlas/local JSON), not in React state.
2. **Build UI against YOUR Report type + a genuine cached sample first; wire the live call last.** MiroFish's real report shape is unknown until a real run is inspected. Strictly typing a guessed schema burns 30+ min in TS errors.
3. **Graceful degradation order, coded in advance:** Snowflake fails → cached badge. ElevenLabs fails → text verdict. Backboard fails → local JSON memory (badged). Gemini/Gemma extraction fails → show raw MiroFish report. Atlas fails → local archive (badged). **Only MiroFish LLM + Zep are hard dependencies.**

---

# 5. FRONTEND — BUILD-SCOPE REALITY CHECK

## 5.1 Decision: ONE route, ONE state machine, FIVE stepper panels. Not 5 routes.

Five routes cost ~30–45 min of routing/layout/state-survival boilerplate before any feature, and every navigation is a demo failure chance. A stepper header with 5 labelled steps reads identically to 5 screens in a demo, holds all state in one parent component, and finishes the whole flow in one page. This holds for BOTH plans — even with a full day, splitting routes buys nothing.

## 5.2 Library verdicts

- **React Flow: CUT in 3 h; optional static-only in extended plan.** Needs a client boundary, sized container (blank-graph bug), custom node types, hand-computed positions: 45–90 min static, 2 h+ data-driven — and MiroFish may expose no graph-shaped data usable in time (graph data endpoint exists, §2.2, but layout is still your problem). Replacement (10 min): Tailwind persona-card grid.
- **Framer Motion: KEEP, scope-locked.** One `AnimatePresence` step transition + staggered Verdict card fade-in; 3 presets in one `motion.ts`. No scroll triggers, parallax, `layoutId`, spring tuning.
- **shadcn/ui: KEEP, minimal.** Init + only: button, card, input, textarea, badge, progress, tabs, accordion, skeleton, separator. Dark-only (no theme toggle). Do NOT install a dashboard starter — deleting its assumptions costs more than building 5 panels. No React Hook Form/Zod in 3 h; native required + useState.
- **Also cut:** Recharts/any chart lib, Zustand/Redux, WebSockets/SSE (polling matches what MiroFish exposes).

## 5.3 Plan A frontend (~100 min of screen-building inside the 3 h sprint, §10.1)

Stepper shell + types + sample placeholder (15 min) → Launchpad + Market merged build (25 min: 3 idea chips incl. the medicine demo idea; 5 preset persona cards, toggle on/off only — no editing, sliders, or custom-persona builder) → War Room (30 min: start POST, real polling, Progress from returned status, excerpt list from whatever the API returns, honest error state + SAMPLE fallback button) → Verdict (30 min: 4 sections, excerpts in Accordion, no scores/dials/SWOT) → Battle stripped (30 min: one "changed variable" input, same pipeline for Run B, 2-column same-category text comparison, no diff algorithm, no winner) → polish pass (20 min) → build + deploy check + rehearsal (15 min, inside sprint total in §10.1).

**Demo path must work with zero typing:** example chip → default personas → Run → Verdict → one pre-written strategy change → Compare.

## 5.4 Plan B frontend additions (inside the 18–22 h build, §10.2)

Editable persona cards + preset library (~8), per-phase War Room status (graph prep / agent setup / sim / report) with backoff polling and elapsed time, excerpts grouped by persona, Verdict with excerpts deep-linked to log entries + copy-as-Markdown, Battle with stored parent/child runs + category table + recurring-objection detection (qualitative, labelled), World Archive list/reopen/delete, optional read-only React Flow graph ONLY if real relationship data is usable, responsive pass (390 px + projector).

## 5.5 Demo-ready Definition of Done

- [ ] Fresh visitor reaches a Verdict in ≤4 clicks via an example chip; no dead buttons (every button works, is hidden, or is visibly disabled)
- [ ] At least one Verdict came from a genuine MiroFish run through the app's own API route — not hand-written JSON; cached fallback badged SAMPLE/CACHED on every screen
- [ ] War Room status = real backend responses; backend down → honest error + labelled sample path, never a frozen fake spinner
- [ ] Battle shows two runs differing only in the intended variable, compared in the same 4 categories, no invented scores/winner probability
- [ ] Every major finding has experiment + decision gate
- [ ] `npm run build` passes; the DEPLOYED version (not just localhost) completes the demo path once
- [ ] README states what was built with MiroFish and what was learned — under MLH criteria, that IS a judged artefact (§9.3)

Failure rule: **if live MiroFish returns no report by minute 90 of the sprint, stop debugging it.** Ship the labelled cached flow with the integration code present and its failure state visible; spend remaining time on Battle + rehearsal.

---

# 6. THE 8 CATEGORIES — SCORED, WITH THE HONEST INTEGRATION FOR EACH

Scoring: Strong = load-bearing (remove it, the product breaks). Possible = real and demonstrable, product survives without it. Forced = category-chasing; do not claim.

| # | Category | Today | Full build | One-line reason |
|---|---|---|---|---|
| 1 | Open-Source AI Project | FAIL as pitched → PASS with §6.1 fix | STRONG | Default config runs a closed model — the fix is config + one owned open-weight step |
| 2 | Backboard | POSSIBLE | Possible→Strong | Founder memory across worlds, must be *demonstrated* in a second session |
| 3 | DigitalOcean | POSSIBLE | Possible→Strong | Real two-service deploy; hosting alone is Possible for everyone |
| 4 | ElevenLabs | FORCED today | POSSIBLE | Text in / report out natively; voice becomes honest only as voiced objections + briefing |
| 5 | Gemini API | POSSIBLE | POSSIBLE | Two real jobs (structuring, Battle comparison) — best tool, not only tool |
| 6 | Gemma 4 | POSSIBLE — pivotal | STRONG if sim model | Must be the Verdict extractor (owned path) AND ideally the sim model; mention-only = fail |
| 7 | MongoDB Atlas | POSSIBLE | STRONG with real archive | World Archive + lineage + vector search; MVP brief itself says local JSON suffices |
| 8 | Snowflake API | FORCED — SKIP today | Possible-or-absent | No warehouse-scale data exists; card gate verified; pre-wire only, §6.6 |

## 6.1 Open-Source AI Project — the Profile OPEN-PURE rule

MiroFish code is genuinely open (AGPL-3.0; OASIS Apache-2.0). Its default intelligence is not: `qwen-plus` (proprietary hosted tier — distinct from open Qwen2.5/Qwen3 checkpoints, mostly Apache-2.0) + Zep Cloud (proprietary SaaS; its Graphiti engine underneath is Apache-2.0, the Cloud service is not). Open harness + closed brain + closed memory = a judge inspecting `.env` classifies it as a wrapper. Your own TRADECOUNCIL rule applies verbatim: **no closed model in the decision path.**

Both changes are required:
1. **Point MiroFish at an open-weight model** (config only, ~30 min): `LLM_MODEL_NAME=<open checkpoint — e.g. an Apache-2.0 Qwen checkpoint, or Gemma 4>` via Ollama/vLLM or the Gemini API endpoint serving Gemma 4. The demo run AND the cached fallback must be generated on the open model — a cached result generated by `qwen-plus` is still a closed-model result. Feasibility precedent exists: the Offline fork runs MiroFish locally on Ollama + Qwen2.5.
2. **Gemma 4 in LAUNCH OR DIE's OWN decision path** (§6.5): the Findings Extractor / Verdict + comparator is code you own; removing it breaks the product. This simultaneously stacks Gemma 4 and proves original AI beyond the upstream engine.

Evidence pack (no extra build time): README table — Component | Source | Licence | Role. War Room footer per run: `Simulation model: <id> · Verdict model: gemma-4-...`. AGPL hygiene: keep MiroFish as a separate unmodified backend service called over its API; licence your own code separately; include MiroFish LICENSE/NOTICE + source offer. AGPL's network clause: if you MODIFY and host MiroFish, modifications must be source-available. Never put an MIT/Apache header over a MiroFish derivative.

## 6.2 Backboard — founder memory ACROSS worlds (Atlas = truth, Backboard = recall)

Division of labour is what makes this non-stuffing: **Atlas is the system of record (what was actually run). Backboard is the conversational memory layer (what the app remembers and surfaces next run).** Zep is agents' memory *inside* one world; Backboard is the founder's memory *across* worlds — say exactly that to judges.

Verified API shape (official docs/examples): base `https://app.backboard.io/api`, header `X-API-Key` (server-side only). `POST /api/assistants`, `POST /api/threads/messages` with `{content, assistant_id, thread_id, memory: "Auto"|"Readonly"}` — Auto = extract salient facts + retrieve relevant ones later; assistants hold memory shared across all their threads; documents upload to assistant/thread scope for RAG, poll `GET /api/documents/{id}/status` until `indexed`. Python SDK exists (`backboard-sdk`); for Next.js use plain `fetch` — no official npm SDK was found, do not invent one. Free tier $0, no card.

Design:
- **One assistant per founder** (a global assistant leaks one founder's ideas into another's recall — a real bug judges can spot). Demo: one demo founder, assistant created by a setup script, `assistant_id` stored in Atlas + env fallback.
- **One thread per run**, plus one per Battle comparison.
- **Write path — distilled facts only, never transcript dumps** (raw role-play pollutes memory as if it were founder fact). After a Verdict, send 3–5 declarative messages with `memory="Auto"`, e.g.: `Founder tested idea "15-minute emergency medicine delivery", strategy "Speed first". Investor persona objected: margins do not cover rider cost at proposed fee. assumptionKey: willingness-to-pay-delivery-fee.`
- **Read path — the Battle moment:** on forking Strategy B, ask (new thread, same assistant): "Have we tested the assumption 'customers will pay a premium for fast delivery' before? What recurred, under which strategy?" Render verbatim in a "Memory Recall — Backboard" card, **cross-checked against Atlas**: show a "tested before" badge ONLY when an Atlas findings query matches the same `assumptionKey`. LLM recall can be wrong; the cross-check is itself the honesty story.
- Time: pre-created account — setup script + smoke test 15 min, wrapper 15 min, write-after-verdict 10 min, recall-in-Battle 20 min. **Full ~60 min, minimal honest ~30 min.** Fallback: `LocalMemoryProvider` (JSONL fact log + keyword/assumptionKey recall) behind the same interface, badged `Memory: LOCAL FALLBACK`.
- Judge evidence: same `assistant_id` across two threads; live recall referencing Strategy A's specific objection; the Atlas doc verifying it.

## 6.3 DigitalOcean — deployment topology

VERIFIED constraints: App Platform — static-site free tier only (Next.js SSR/API = paid web service, from $5/mo 512 MB to $50/mo 2 vCPU/4 GB shared; dedicated from $49/mo); HTTP timeout ~100 s; jobs 30 min default; workers are long-running but NOT routable; **ephemeral FS, 4 GiB cap, all local data lost on redeploy/restart**; build limit 1 h, images >2 GiB likely to have deploy issues (recommended <1 GiB); components in the same App reach each other by component name, **browser JS can never reach internal names — server-side calls only, no secrets in `NEXT_PUBLIC_*`**. Droplets (Basic shared): 2 GB/$12, 4 GB/$24, 8 GB/$48 per month, per-second billing with monthly cap; persistent disk, your own proxy timeouts, upstream's `docker compose up -d` works verbatim. New-customer credit: $200 / 60 days, card verification required. Gradient AI serverless inference (OpenAI-compatible) exists but is a SEPARATE prepaid balance — do not assume DO credit covers its tokens, and do NOT swap MiroFish's primary LLM to Gradient on the day without a passed smoke test (tool-calling behaviour untested per model).

**Recommended (Plan B topology):** App Platform `web` service (Next.js, `apps-s-1vcpu-2gb` $25/mo, upgrade if OOM) as the only public component + **Droplet s-4vcpu-8gb ($48/mo, same region BLR1/SGP1)** running MiroFish backend ONLY via Docker Compose behind Caddy/nginx (HTTPS, 5001 not directly public, `.env` on the Droplet only). Run archive externalised to Atlas/Spaces. Battle runs SEQUENTIAL, never parallel. Pro-rated weekend cost ~$10–15 of credit — **destroy everything after judging; forgotten containers keep billing.**
Stretch (only if a first-hour smoke test passes): both components in one App (internal service `internal_ports: [5001]`, min `apps-s-2vcpu-4gb` $50) — cleaner story, inherits ephemeral-FS + image + restart risks.
Plan C (emergency fallback only, disclose it): frontend on DO, MiroFish local/tunnelled. Allowed by the category text, weak in the room — README + slide must state where the sim actually ran. Prefer Cloudflare Tunnel over free ngrok if forced.
Deploy-time estimate (MiroFish already verified locally): account/card/credit 15–30 min, Droplet + compose + smoke sim 30–60, HTTPS/firewall 15–25, App Platform first deploy (2–3 cycles) 20–40, async wiring + E2E on demo seed 30–60, Battle pre-cache 30–45. **Total ~2.5–4 h; 4–6 h if local sim is not yet verified — in which case do not start cloud work at all.**
Failure modes: (1) timeouts/restarts killing runs → async pattern + phase-persisted status + frozen deploys during judging; (2) OOM/fat image → Droplet removes the ceiling, slim multi-stage backend-only image, pre-build to DO Container Registry, rehearse with the exact demo seed while watching RAM; (3) networking/secrets/external deps → server-side proxy only, one env checklist, `/health` endpoint probing MiroFish + LLM + Zep before leaving home and again on venue Wi-Fi, both Battle runs completed before the demo.

## 6.4 MongoDB Atlas — World Archive

M0 free tier: free forever, 512 MB, no card. Limits that matter: **max 3 search/vector indexes on free clusters** (you need exactly 1 vector index), 500 connections, cluster pauses after prolonged inactivity (ping it the morning of the demo). **Trap: Atlas IP allowlist defaults to the IP you signed up from — venue NAT = silently unreachable cluster.** Fix on arrival (or hackathon-only `0.0.0.0/0`, disclosed in README as demo-only, removed after). URL-encode special characters in the connection-string password — the #1 Atlas connection failure.

Schemas (Atlas = canonical; the local fallback uses identical shapes):
- `founders`: {_id, founderKey (anonymous, no auth in MVP), displayName?, backboardAssistantId, backboardStatus: "live"|"fallback-local", createdAt, lastSeenAt}
- `ideas`: {_id, founderKey, title, description, targetAudience, businessModel, createdAt}
- `runs`: {_id, runId, ideaId, founderKey, parentRunId (null = Strategy A), battleId, strategy: {label, changedVariable, promise}, status: "queued"|"preparing"|"running"|"completed"|"failed"|"cached-sample", source: "mirofish-live"|"mirofish-cached" (NEVER relabel cached as live), mirofish: {rawReportRef?, rawReport?}, personas: [snapshot — so a Battle compares what was actually simulated], backboardThreadId, verdict: {summary, strongestSupport[], unresolvedAssumptions[]}, createdAt, completedAt}
- `Persona` (embedded snapshot): {personaId, role, name, goals, constraints, stance? (only if MiroFish actually exposes it — otherwise omit, don't fabricate)}
- `findings` (separate collection, enables vector search + cross-run queries): {_id, runId, ideaId, category: "objection"|"support"|"assumption"|"conflict"|"experiment", severity: "low"|"medium"|"high" (qualitative extractor label, NOT a probability), personaRole, text, assumptionKey (slug — the join key for Backboard facts + Battle diff), evidenceExcerpt?, evidenceRef?, experiment?: {hypothesis, method, decisionGate}, embedding?, embeddingModel?, createdAt}
- `battles`: {_id, battleId, ideaId, runAId, runBId, changedVariable, backboardThreadId, memoryRecall?: {question, answer, recalledAt, verifiedAgainstAtlas}, comparison: {persistedObjections[], resolvedObjections[], newObjections[] (all assumptionKey set operations — deterministic, computed in code, not LLM-guessed), recommendation}, createdAt}

Vector search: Atlas does not embed for you on the classic index. Path A: Automated Embeddings (`autoEmbed`, Voyage model, e.g. `voyage-4`) — a Preview capability; **verify enabled on your M0 cluster pre-event.** Path B: bring your own embedding (same model for docs and queries, store `embeddingModel` per doc), index `{type: "vectorSearch", fields: [vector path "embedding", numDimensions 768, cosine; filters ideaId/category/personaRole]}`, query `$vectorSearch` with `numCandidates 100, limit 5–10`. A query against a not-yet-built index can return empty WITH NO ERROR — check `listSearchIndexes()` / `queryable: true` before trusting an empty result. Product surface: Verdict panel "Similar past objections" — counts from Atlas aggregation, never from an LLM. `vectorSearchScore` is a similarity score — label it "similarity" in UI, never as probability.
Time: account+M0+user+allowlist+URI test 15–20 min (pre-event), client singleton + CRUD 20 min, findings + Battle diff 15 min, vector index + panel 25 min. **Full ~75–90 min; storage-only ~40 min.** In the 3 h sprint: Atlas storage (or local fallback) + Backboard minimal ≈ 90 min combined, accounts pre-created; vector panel only if the MiroFish flow already works. Cut order: Backboard document-RAG stretch → Atlas vector panel → recall-card polish. Never cut: Atlas run storage, Backboard write+recall loop.

## 6.5 Gemini API + Gemma 4 — one key, two families, four jobs, zero overlap

VERIFIED model IDs (official Google docs, checked 2026-10-23):
- Gemma 4 via Gemini API: **`gemma-4-31b-it`** (31B dense, 256K context) and **`gemma-4-26b-a4b-it`** (26B MoE, ~3.8B active, 256K — recommended default for latency). Same key/SDK/endpoint as Gemini; only `model=` changes. Gemma via API is **free-only, no paid tier**.
- NOT hosted via the API: `gemma-4-e2b-it`, `gemma-4-e4b-it`, `gemma-4-12b-it` — local weights only (Ollama/llama.cpp/LiteRT). Tutorials showing them as API IDs are wrong. **Never code `gemma-4-e4b-it` as an API ID.**
- Gemini (official models page, updated 2026-10-22): `gemini-3.8-flash` (stable flagship Flash), `gemini-3.6-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`, `gemini-2.5-flash` (1M context, best-documented structured output — safest hackathon pin), `gemini-2.5-pro`. `gemini-4-argon` is paid-only — do not pin.
- Pins: `GEMINI_MODEL=gemini-2.5-flash` (or 3.8-flash after checking your project's live quota that morning), `GEMMA_MODEL=gemma-4-26b-a4b-it`, `GEMMA_QUALITY_MODEL=gemma-4-31b-it`. Log `model=` on every call — that log is your category evidence.

Capability asymmetry (why they are not interchangeable): Gemini documents **enforced structured output** (`responseMimeType` + `responseSchema`) and 1M context. Gemma 4's official API page documents thinking (`thinking_level: "high"|"minimal"`), image input, system instructions, function calling, search grounding — but **structured output is NOT officially listed for Gemma** (a `responseJsonSchema` workaround is community-reported, undocumented). Design around it: Gemma outputs are validated in app code (Zod/Pydantic + 1 retry).

The split (each model: 2+ distinct call sites; removing either breaks a named step):
1. **Scenario Structuring → Gemini.** Raw idea → structured scenario JSON for the seed/MiroFish setup. Needs guaranteed schema compliance or everything downstream fails.
2. **Persona Generation → Gemma 4 26B, thinking high.** Scenario → 5 stakeholder personas (role/goals/constraints/conflicting incentives) that shape the seed brief. Prose, not strict schema — Gemma's weakness doesn't bite, its reasoning shows.
3. **Simulation → MiroFish.** No Google call here. Do not claim it.
4. **Findings / Verdict Extraction → Gemma 4 — THIS STEP MUST BE GEMMA.** MiroFish report → support / objections / assumptions / evidence excerpts / experiments with decision gates. It is the product's core intellectual output and the demo's climax; if extraction were Gemini, every other Gemma use could be deleted with no loss and the Gemma category correctly fails as mention-only. Gemma footer on the Verdict screen: `Verdict extracted by Gemma 4 · gemma-4-31b-it · thinking: high`.
5. **Strategy Battle Comparison → Gemini Flash.** Verdict A + Report A + Verdict B + Report B → structured side-by-side diff. Needs two full runs in context at once (1M) + enforced schema.
Optional bonus (Gemma only): pitch-image critique — landing-page/deck screenshot → Gemma multimodal critique. Skip if time is short.
Anti-pattern: running the same prompt on the other model "also" for the badge. Judges see it in code review instantly.

Rate limits: Google no longer publishes a fixed per-model table — limits are per-PROJECT (RPM + TPM + RPD, RPD resets midnight Pacific), visible only in AI Studio (https://aistudio.google.com/rate-limit). Community-reported free tiers (UNVERIFIED): Flash ~5 RPM / ~20 RPD — dangerously low; Flash-Lite ~500 RPD. One full Battle ≈ 7 Google calls; three demo users could exhaust a free Flash day. Mitigations in order: Flash-Lite for Step 1 if schema quality holds; **enable billing → Tier 1 before the event** ($250 cap, removes the RPD cliff); cache the demo idea's genuine runs and serve cache on 429; never call Gemma per agent message — once per completed report; backoff on 429; Battle runs sequential.

## 6.6 ElevenLabs + Snowflake

**ElevenLabs: INCLUDE (full build) — one feature: "Hear the War Room."** (a) Persona-voiced objections: each strongest-objection card gets a Play button in that stakeholder's voice (investor ≠ customer ≠ pharmacist) — the product's thesis made audible, and the best 10 seconds of the demo. (b) Spoken Verdict briefing: a purpose-written ~900-char summary script (top objection, strongest support, first experiment), NOT the raw report read aloud. Voice input of the idea is REJECTED as primary (browser Web Speech does it free — judges would call it forced); Scribe STT is stretch-only.
Implementation: server-side `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}` via a Next.js `/api/tts` route, `xi-api-key` header, model `eleven_flash_v2_5` for clips (~75 ms, half credit cost), `eleven_multilingual_v2` for the briefing if audibly better. Premade voices (free tier): Investor George `JBFqnCBsd6RMkjVDRZzb` / Daniel `onwK4e9ZLuTAKqWW03F9`; Customer Rachel `21m00Tcm4TlvDq8ikWAM` / Sarah `EXAVITQu4vr4xnSDxMaL`; Operator Charlotte `XB0fDUnXU5powFXDhCwa` (+1 more from `GET /v1/voices` at build time). **MP3 cache is NOT optional:** key = hash(text+voice+model); ~1,900 chars per full run ≈ 950–1,900 credits ≈ $0.08 PAYG; free tier is 10,000 credits/month ≈ only 5–10 UNCACHED runs. Pre-generate all demo audio. Generate lazily on first Play; never block Verdict rendering on TTS. **Realistic time ~45 min** (15 API route + 15 cache + 15 UI), not 30.

**Snowflake: PRE-WIRE-ONLY with cached fallback; DROP cleanly if the gate fails. Never load-bearing.**
Trial re-verified against official sources: standard trial is **30 days / $400** (Snowflake's own trial page + docs; Support cannot extend past 30 days — June 2026 article). The "student 120-day trial" is MLH template copy traced to special signup links (`?trial=st`) — **UNVERIFIED for this event**, and irrelevant anyway (30 vs 120 days changes nothing in an 8 h event). The card gate is REAL, official docs verbatim: "AI features are disabled by default on self-service trial accounts until you add a credit card." Signup needs only email; Cortex will not run until a card is on file. Trial accounts also have no external network access (restricts Snowflake calling out, not your app calling in).
The ONE defensible use: **Cortex REST API as the Strategy Battle comparator** — `/api/v2/cortex/v1/chat/completions` (OpenAI-compatible; PAT auth; role needs `SNOWFLAKE.CORTEX_USER`), fed the two normalised Verdicts, returning objections-only-in-A / only-in-B / shared / recommended experiments. It does a job some LLM must do anyway. Rank-2 (only if time remains): findings warehouse + cross-run aggregates — with <20 runs and Atlas already storing them, judges may read it as duplication. FORCED, never do: Snowflake as primary DB, RAG over the idea, or Cortex as the simulation engine.
Pre-wire protocol (pre-event, not during): 15-min GO/NO-GO — create trial, add card IF willing, enable AI, mint PAT, one real curl (use an open-weight Llama model on Cortex to support the open-source narrative), save the genuine response. Code behind `SNOWFLAKE_ENABLED` with a 15 s timeout → fallback to the Gemma/Gemini comparator on any error. Badges state the truth: `Comparison by Snowflake Cortex — LIVE | CACHED | fallback model`. Setup budget if attempted: 45–90 min pre-event + ~30 min flagged integration. If the gate fails: remove Snowflake from the pitch entirely. Losing 1 of 8 categories is cheap; a live failure — or a faked one — on the demo's climax is not.

---

# 7. STRATEGY BATTLE — METHODOLOGY (THE KILLER FEATURE, DONE HONESTLY)

## 7.1 What Battle actually is

Two separate, independent, full simulations. Same project/graph. One changed variable, expressed in the **simulation requirement / scenario prompt / initial-event config — NOT by editing the seed document.** If the seed changes, the graph rebuilds, the entities change, and you have changed two variables. LAUNCH OR DIE owns: parent/child run records (`parentRunId`, shared `battleId`), archiving Run A completely BEFORE Run B starts, one fixed-category extractor applied identically to both reports, and the comparison page.

Graph reuse arithmetic (if the spike verifies reuse): Run A ~15–20 min + Run B (persona + sim + report only) ~6–9 min ≈ **21–29 min + ~1 min comparison**. If reuse fails: 30–40 min at smallest config, 66–98 min at published-run scale. Either way: **pre-run both, demo the comparison.**

Persona-freeze problem: prepare regenerates profiles + config per simulation_id, so Run B gets different persona wording/activity by default. Workarounds in order: (a) copy Run A's profile/config files into Run B's directory, prepare with `force_regenerate=false`, diff files afterwards to prove it held — undocumented filesystem workaround, verify in the spike; (b) accept regeneration, hash/diff both profile files, disclose "personas were regenerated between runs" in the comparability panel; (c) same-simulation `force=true` re-run preserves profiles but destroys Run A's live state — viable only after A is fully archived, and it is a sequential re-run, not a pair.

## 7.2 The variance problem — stated precisely, handled openly

Variance stacks at 5 layers: graph extraction (controlled ONLY if graph is shared) → persona generation (uncontrolled by default) → config generation (LLM-written starting conditions/hot topics can differ) → interaction (every agent action is a sample; early divergence compounds — the OASIS authors repeated sims 10× and saw the noisy topic diverge, only 6/10 runs concentrated) → report + extraction (two more stochastic passes). No seed/temperature is exposed in the documented API (seed appears only as "Planned" in the Offline fork's Stage-2 UI docs) — grep the installed backend; even a provider seed is only "best effort" per OpenAI's own cookbook, never a reproducibility claim. LAUNCH OR DIE CAN lock its own extractor: same model, same versioned prompt, low temperature, both runs.

**A/A noise-floor protocol (development, before the event):** run Strategy A TWICE, identical everything, shared graph. Diff the two reports with the production extractor. Whatever differs between A₁ and A₂ is pure re-sampling noise — your noise floor. Themes that flip there are classified "single-run observation" forever after.

**Invert the intuition in the UI:** findings present in BOTH Battle runs are the strongest signal the product produces — they survived two independent draws. Differences are hypotheses. The Battle page LEADS with "True under both strategies." The scientifically complete fix (n≥3 per strategy, majority-rule themes ≈ 6 runs ≈ 1.5–2 h, up to ~$30) is stated as roadmap, not shipped. UI discloses "exploratory, 1 run per strategy" in header type size, next to the run IDs — not in a footnote.

## 7.3 Comparison schema — fixed categories, same extractor, both runs

A finding enters the schema ONLY with: verbatim evidence excerpt + stakeholder group + round (if exposed). No excerpt → no finding.
1. Supporting arguments — claims in favour, with the mechanism given (not generic praise)
2. Objections — distinct failure/cost/rejection claims, **deduplicated by mechanism** (10 agents paraphrasing "fee too high" = 1 objection raised by N groups)
3. Recurring concerns — theme raised by ≥2 distinct stakeholder groups OR in ≥2 separate rounds within that run; below threshold = "single mention", never headline-compared
4. Stakeholder conflicts — group pairs whose goals directly oppose on the changed variable, both sides' excerpts recorded
5. Failure modes — concrete sequences: trigger → cascade → outcome; must name the trigger
6. Unresolved assumptions — claims the simulation assumed but never tested; flagged as assumed, not found
7. Validation experiments — LAUNCH OR DIE layer, NOT simulation output; visually separated, labelled as generated advice

Classification per theme (the whole methodology in one auditable line):
- **Robust** — present in both A and B → a property of the IDEA, not of either strategy
- **Strategy-linked (tentative)** — present in one run only, excerpts explicitly reference the changed variable → a hypothesis about the strategy
- **Single-run observation** — present in one run only, no explicit link (or known to flip in A/A) → collapsed/secondary section, never headlines

Comparison page structure: (1) header metadata + honesty banner + comparability panel (seed hash, graph_id, model, rounds, agents, persona-hash status, extractor version) → (2) True under BOTH → (3) Only in A → (4) Only in B → (5) Conflicts table → (6) Descriptive counts → (7) What this Battle does NOT establish → (8) Validate in the real world first (priority | assumption | experiment | decision gate).

## 7.4 Numbers: what is banned and what survives

BANNED: viability/success scores, win probabilities, market-acceptance %, sentiment % as market sentiment, star ratings, "A beats B by 12 points", any traffic light from an invented threshold. Reasons: no measurement instrument exists (a report is synthesised prose, not a calibrated sensor); n=1 gives no variance estimate (a 7.2 vs 6.8 difference is almost certainly inside the A/A noise floor); no ground truth/calibration set exists; percentages smuggle in a representative denominator that was never sampled; composite scores destroy the only useful content (which objection, from whom, with what evidence).
PERMITTED (descriptive counts of THIS pair of runs only, always beside excerpts + run rounds/agent counts): distinct deduplicated objections per run/group; breadth count (groups raising a theme, of total groups); recurrence flag (in both runs, binary); operational facts (rounds completed, actions logged, agents active). Caveats printed wherever counts appear: counts depend on rounds/agents/extractor and are comparable only because settings were identical (if the comparability panel shows a difference, footnote it); **more objections ≠ worse strategy** (a strategy can attract more because it is more specific or more discussed) — never rank by count; prefer a presence/absence matrix over any scoreboard chart. NO WINNER BADGE. Permitted conclusion format: "Lean: [strategy] — because [specific qualitative finding]. Confidence: exploratory (1 run per strategy). Validate first: [experiment]."

Banner on every Battle page: "Two separate simulations — one run per strategy. Simulated personas are not real customers or market research. Differences between these two runs may reflect run-to-run variation as well as the strategy change. Nothing here is a prediction of sales, success, or probability."

---

# 8. COMPETITORS AND PRIOR ART — WHAT IS AND IS NOT NOVEL

## 8.1 Verdict: the core idea is NOT novel, and it is crowded from three directions

(1) Commodity validators (score in ~60 s): ValidatorAI, AiiQA, IdeaProof, DimeADozen, IdeaScan, Preuve AI, SeedAngels, Koncept AI. (2) Persona-debate products: Athanor, val8, Pressure Test, ArgumenTroupe. (3) Funded agent-simulation platforms: Aaru, Simile, Artificial Societies, Evidenza, Synthetic Users — plus MiroFish itself, used directly.

Closest competitors a judge will find in 2 minutes:
- **Athanor** — 5 analyst agents (Team/Market/Business Model/Risk/Product) + Validation Agent + Optimist/Pessimist debate, dual-axis GemScore, ~5 min, re-evaluate as you improve. Differs: analyst roles grading a deck, not interacting market stakeholders over rounds; score-led; no paired A/B sim comparison found.
- **val8.app** — "adversarial validation engine": 45 personas (15 investors / 15 experts / 15 users) debate and stress-test, scored output (example 44/100). This IS "stakeholders debate your startup", including anti-sycophancy positioning. Differs: panel/roast model, not a knowledge-graph world on simulated social platforms; no packaged Battle comparison.
- **Pressure Test** — 5 VC personas, Fundability Score. Investors only, one-pass, score-led.
- **ArgumenTroupe** (on Microsoft TinyTroupe) — "distinct AI personas debate, discuss, and stress-test your ideas", AI focus groups, argument graphing, TTS, Free–$79/mo. Near-identical pitch language. Differs: thinking-style personas (Philosopher, Devil's Advocate…), general-purpose, not market stakeholders with economic constraints; no verdict-to-experiments or strategy fork.
- **ValidatorAI** — already markets a "Customer Feedback Simulator" and a simulated launch, TAM/SAM/SOM, 200k+ claimed sessions. Independent critique (BigIdeasDB) worth adopting as your own line: a simulated customer "is the same model imagining a customer… it is not validation" — rehearsing objections is legitimate, substituting for customers is not.
- **SeedAngels** — already names your riskiest assumption ready to test + edit-and-rerun history. **AiiQA** — Build/Pivot/Kill verdict already exists. **Preuve AI** — "10 agents scan 60+ sources" — agent COUNT is not differentiation.

## 8.2 "Why not just use MiroFish?" — the hardest judge question, answered head-on

A user CAN already paste a startup description into raw MiroFish and ask how stakeholders react. LAUNCH OR DIE adds no new simulation capability. What it legitimately adds is **productisation**: (1) a startup scenario schema instead of free-form seed + prompt engineering, (2) a curated stakeholder set with roles/goals/constraints, (3) a normalised verdict layer instead of a general prediction report, (4) the parent-child Battle workflow + same-category comparison, (5) no-code founder UX + labelled cached genuine runs. Say it exactly that way — a workflow claim, not a technology claim.

Frameworks (any technical judge can rebuild the concept): OASIS (MiroFish's engine, up to 1M agents claimed, Apache-2.0), Microsoft TinyTroupe (TinyPerson/TinyWorld focus groups), Stanford Generative Agents (2023, "Smallville"; the 1,052-person follow-up is now Simile). Enterprise ceiling: Aaru (~$1B headline valuation, vendor-cited 0.90 median correlation in an EY study — vendor study, not independent audit), Simile (personas from 2-hour interviews with ~1,000 real people + Gallup; $100M round) — personas grounded in real interviewed individuals, a categorically stronger ground than generated-from-a-description, say so — Artificial Societies (YC W25; A/B comparison of variants inside a simulation is ALREADY their demonstrated use case for messages; Aaru Lumen also markets A/B testing — Battle extends it to full strategies, it does not invent the method), Evidenza, Synthetic Users (~$2–$27/interview), Delve/Deepsona/Savanta/EchoTest (EchoTest's quarter-by-quarter MRR projections are the cautionary example of the fake-forecast pattern you refuse). Contrast: Remesh — AI research with REAL participants; answer "why synthetic?" with speed/cost/rehearsal-before-recruiting, never superiority.

Academic grounding: *Synthetic Founders* (arXiv:2509.02605, 2025) — synthetic founder/investor personas converged on some themes but showed "amplified false positives" and blind spots from missing lived history; authors position LLM personas as complementary, extending hypothesis space, not replacing empirical studies. That is LAUNCH OR DIE's correct epistemic home. ACM Interactions' "Synthetic Persona Fallacy" — bias laundering, no falsifiability, "research theatre"; synthetic users skew agreeable ("Pollyanna principle") and under-represent marginalised populations.

## 8.3 NOT novel — never claim

Multi-agent critique of an idea; "personas debate your idea"; simulated customer feedback / simulated launch; AI focus groups / synthetic users; simulating a social market; A/B testing two variants in simulation; naming the riskiest assumption / next steps / roadmap; Build/Pivot/Kill verdicts; anti-sycophancy/"brutally honest" positioning; agent counts as credibility.

## 8.4 Genuinely differentiated — claim ONLY these, in combination

1. **Workflow, not engine:** first founder-facing productisation found that constrains MiroFish's general swarm to a startup stakeholder war room (customer/operator-supplier/competitor/investor with conflicting economic incentives) in a 5-step, no-prompt-engineering flow.
2. **Strategy Battle as a paired-run product:** parent-child runs, exactly one strategic variable changed, both complete independent simulations, same-schema qualitative diff — vs re-scoring an edited idea, or A/B-testing a headline/message.
3. **Verdict-to-experiment conversion with a decision gate** as the PRIMARY output: objection → named real-world test → pre-stated continue/change/abandon gate, with the motivating excerpt. Others give "next steps"; the chain is the differentiator, and it is provable in the UI.
4. **No-score honesty as a feature** — refusing viability % / success probability / revenue forecast in a category where every competitor leads with one. Dies the moment a "B wins 7.2 vs 6.8" appears.
5. **Open engine, inspectable runs** — MiroFish (AGPL-3.0) + OASIS are public code, unlike every SaaS above except TinyTroupe-based ArgumenTroupe.

Defensible differentiation statement (copy-paste safe): "LAUNCH OR DIE is a startup assumption-testing lab built on the open-source MiroFish multi-agent simulation engine. Unlike single-prompt AI validators that score an idea, it places simulated stakeholders — customers, operators, competitors and investors with conflicting incentives — into a MiroFish simulation, surfaces the objections and conflicts that emerge, and converts each major finding into a real-world experiment with a decision gate. Its Strategy Battle runs a second, independent simulation with one strategic variable changed and compares the two runs in the same qualitative categories. It does not predict success, estimate revenue, or replace talking to real customers; it helps a founder find which assumptions to test first, before spending money building."
Short version: "Not a score. A simulated war room: run your idea, watch stakeholders clash, change one strategy, run it again, leave with experiments to run on real people."

Judge-question prep: (1) "Why not MiroFish/ChatGPT with personas?" → "You can — MiroFish is our engine and we say so. What you'd do yourself is the schema, stakeholder config, normalising a general report into objections+experiments, and running+diffing a second run. With a single prompt you also lose agent-to-agent interaction over rounds, where the conflicting-incentive findings come from." (2) "Isn't this Athanor/val8?" → "They're panels grading a pitch in one pass, with a score. Ours are market stakeholders interacting over rounds, no score, output is a paired strategy comparison + experiments. They grade the pitch; we rehearse the market." (3) "How accurate is it?" → "Unknown, and we claim no number. MiroFish publishes no accuracy metric and we found no independent backtest supporting one. That's why the product ends in real-world experiments with decision gates — the simulation generates hypotheses, reality grades them."

---

# 9. RISKS, COSTS, KEYS, AND JUDGING REALITY

## 9.1 Risk table (L/I = Low/Medium/High)

| # | Risk | L | I | Mitigation (in advance) |
|---|---|---|---|---|
| R1 | Live sim doesn't finish in demo window (15–60 min/run) | H | H | Pre-run genuine Battle pair; demo shows a live run STARTING + labelled cached Verdict/Battle; start Run B early on the day |
| R2 | MiroFish install fails at venue (Python/Node/uv, partial setup:all) | M | H | Install + full test run at home; DO Droplet host as backup; never first-install on venue Wi-Fi. Note: upstream is macOS-optimised, Windows still being tested (review) — Docker avoids some of this |
| R3 | Venue Wi-Fi blocks/throttles APIs, Docker pulls, ports | H | H | Mobile hotspot tested with the BACKEND (not just a browser); all images/deps pre-pulled |
| R4 | Atlas unreachable (allowlist = home IP) | H | M | Health check first on arrival; update allowlist; local-JSON fallback |
| R5 | ZEP_API_KEY forgotten / Zep quota exhausted (~3 runs on free tier in one test) | M | H | Keys checklist; health endpoint includes Zep; confirm quota with a test graph pre-event |
| R6 | Wrong .env edited (MiroFish root vs Next.js .env.local overlap) | M | M | Checklist states file path per key; health endpoint reports the model the backend actually loaded (name only) |
| R7 | Cost blowout (untrimmed config / retry loop) | M | M | Server caps ≤30–40 rounds, 5-persona default seed discipline, kill switch; budget alerts $10 / hard cap $25; Qwen-Plus-class model for sim, not frontier |
| R8 | Provider 429 mid-run | M | M | Backoff + skip-turn, not run-abort; NO silent mid-run model switch (breaks Battle comparability — different LLM = different behaviour); surface rate-limit state in War Room |
| R9 | Key leaked via public repo / frontend bundle | L | H | .env git-ignored + verified (`git check-ignore .env`); all calls server-side; rotate any key ever pasted into a chat/screenshot |
| R10 | ElevenLabs free quota (10k chars) exhausted by rehearsals | M | L | Pre-generate demo MP3s; no autoplay; text is default path |
| R11 | Snowflake trial doesn't activate (card gate) | H | L | Pre-wired + badged CACHED only, never on critical path |
| R12 | Agent outputs medical advice or invented law, shown unscreened | M | M | Extractor strips individual medical advice; regulatory claims framed "verify with a qualified professional"; disclaimer on Verdict (§9.2) |
| R13 | Cached fallback presented/mistaken as live | L | H | CACHED badge + provenance (run ID, model, rounds, timestamps) on every cached surface, shipped in repo |
| R14 | Demo overruns / presenter explains multi-agent theory | M | M | Timed 3-min script (§11), rehearsed twice; one idea, one change |
| R15 | Judging mismatch — polished pitch, thin build/learning evidence | M | H | Submission foregrounds build log, learning log, genuine run artefacts (§9.3) |

Contingency ladder: (1) pre-installed, pre-tested laptop is the primary system — versions checked, setup complete, one full genuine run done at home; (2) mobile hotspot; (3) DO Droplet MiroFish host installed the night before (laptop becomes thin client; also genuinely earns the DO category); (4) genuine cached mode as the floor. NEVER substitute a single Gemini prompt pretending to be a multi-agent simulation — a smaller genuine run (10 rounds) beats a fake large one.

## 9.2 Content risk — the emergency-medicine demo idea

It is a GOOD demo choice because the pharmacist/regulator objections ARE the product working. India has no dedicated e-pharmacy law in force; online sale sits under the Drugs and Cosmetics Act 1940 + Rules 1945, Pharmacy Act 1948, IT Act 2000. Schedule H/H1 medicines may only be dispensed on a valid prescription from a registered medical practitioner, verified by a registered pharmacist; Schedule X is far more restricted (draft e-pharmacy rules proposed prohibiting its online sale); DCGI's 2015 clarification applies the same rules online as offline; draft e-pharmacy rules (2018, still not finalised) propose CDSCO registration; Delhi HC (2018) banned unlicensed online sale, Madras HC stayed a blanket ban — the position is genuinely unsettled, so a regulator persona flagging "regulatory ambiguity" is accurate. When the pharmacist agent asks "Who verifies the prescription at 2 a.m., and what happens when verification takes 12 of your 15 minutes?" — that is the strongest moment in the demo. Lean in.
Guardrails: NO real medical advice ever (agents discuss the business model — verification workflow, cold chain, inventory, radius — never "take X for Y"; extractor strips any sentence reading as advice to an individual); NO real patient/prescription data (fictional scenario only); no invented statute numbers/fines shown as cited fact (unsourced regulatory points = "assumption to verify with a qualified professional"); no life-or-death dramatisation in demo copy; the demo arc must show the 15-minute promise being CHALLENGED, never endorsed.

## 9.3 Judging reality

MLH criteria are Technology, Design, Completion, Learning. MLH states explicitly what is NOT judged: how good your code is ("messy code is fine — hacking is about learning"), how well you pitch, how good the idea is. The user's pasted event criteria agree: build + learning are judged; idea quality, problem-solving value, code quality and pitch are not. Hack Day "done" = working demo + public GitHub repo + clear README explaining what you built and how the AI is used. Sponsor categories are judged separately on GENUINE use — a tech only mentioned in the README, or integrated but never exercised in demo/repo evidence, counts as not entered. Claim only categories you can point to working code + a visible moment for.
Submission evidence checklist: public repo with day-long commit history (the history itself is learning evidence); `LEARNING.md` (half a page: what was new — first multi-agent engine, first knowledge-graph agent memory, first async long-job polling pattern — plus 2–3 SPECIFIC mistakes fixed: the Zep key omission, the Atlas allowlist, a sync-request timeout; specific failures > "I learned a lot"); genuine run artefacts in `sample-data/` with `PROVENANCE.md` (run IDs, start/end timestamps, model, rounds, personas, provider cost from console, raw report, extracted verdict); a 60–90 s screen recording of one genuine end-to-end run at accelerated speed, linked from README (covers asynchronous judging); README with run instructions incl. exact versions (Node 18+, Python 3.11–3.12, uv) and every key by NAME (no values); a "what the simulation can't do" paragraph. Do NOT spend remaining time on pitch deck, logo, landing animation, or code style — under these criteria it scores ~zero.

## 9.4 Key sprawl — 9–11 secrets, 2–3 config locations (the most likely venue failure after networking)

1. `LLM_API_KEY` + `LLM_BASE_URL` + `LLM_MODEL_NAME` (MiroFish backend) — sim never starts if wrong
2. `ZEP_API_KEY` (MiroFish) — graph build fails, often opaquely. **Not in the original brief's key list — the classic first-run failure.**
3. `LLM_BOOST_*` — omit entirely if unused; placeholders cause failures
4. `GEMINI_API_KEY` (Gemini + Gemma via Gemini API) — verdict/persona/comparison fail; sim still works
5. `BACKBOARD_API_KEY` (+ `BACKBOARD_ASSISTANT_ID`) — Battle loses cross-run memory; single run still works
6. `ELEVENLABS_API_KEY` — audio fails; degrade to text
7. `MONGODB_URI` — nothing persists across refresh
8. DigitalOcean token / App Platform env / SSH key — local-only demo
9. Snowflake account/user/PAT (+ warehouse) — that category only; must never block the core flow
10. TWO .env files (MiroFish root + app .env.local) with overlapping LLM settings — "I fixed the key and nothing changed"

Mitigations: `KEYS-CHECKLIST.md` in repo (names + file location + console URL + quota note, NO values), ticked off with a live test call each; startup self-test `GET /api/health/deps` returning per-service ok/skipped — run it FIRST on venue Wi-Fi; graceful degradation order in §4; DashScope endpoint region tested from Kolkata before the demo.

---

# 10. BUILD PLANS

## 10.1 Plan A — 3-hour survival sprint (only under the §0.2 GO-ONLY-IF conditions)

Doctrine: one idea, one run, then — only then — a second run. MiroFish verified before frontend polish. Categories claimed today: Open-Source + DigitalOcean + ONE LLM category done properly (Gemma-as-sim-model OR Gemini-as-extractor, decided by what the gate run proves) + Atlas only if pre-tested. ElevenLabs and Snowflake: conceded, not faked. Backboard minimal only if Hour 2 ends early.

| Time | Block | Gate / deliverable |
|---|---|---|
| 0:00–0:10 | Parallel pre-flight | EchoNotes Hour-0 probes started (protects abort path). Version checks: node 18+, python 3.11–3.12, uv, git. Wrong Python = fix now or abort. |
| 0:10–0:25 | Clone + keys | Clone, `.env` (LLM_* + ZEP_API_KEY, boost vars deleted), Zep signup if needed. Model = whichever OpenAI-compatible endpoint you can authenticate FASTEST. |
| 0:25–0:40 | Install + start | `npm run setup:all`, `npm run dev`. :3000 and :5001 both answer. |
| 0:40–1:00 | **THE GATE RUN** | Medicine-delivery seed (1–2 page brief naming all 5 stakeholders) + Strategy A requirement. <40 rounds, target 10. Visible timer running. |
| | 🚦 **GATE 1 @1:00** | **Completed report you can open? YES → log wall-clock + cost, proceed. NO → ABORT TO ECHONOTES. No extensions.** ~2 h left is exactly EchoNotes' floor (record → transcribe → extract → save → one confirmed calendar action). |
| 1:00–1:15 | Freeze the asset | Export Run A (report + metadata: simulation ID, timestamp, model, rounds, duration, cost) into `sample-runs/` with SAMPLE labelling. This folder is now the demo floor. SAME GRAPH: start Battle Run B in the background (one variable changed: 15-min speed → reliable window) if graph reuse was proven in the spike; otherwise queue it after the Verdict exists. |
| 1:15–1:55 | One Verdict end-to-end | Single-page stepper (§5) against your Report type + cached sample; Findings Extractor (Gemma verdict call, §6.5) → Verdict JSON `{support[], objections[{claim, excerpt, persona}], unresolvedAssumptions[], experiments[{hypothesis, test, decisionGate}]}`, schema-validated; on parse failure show the raw report with an honest notice — never hand-invent findings. War Room = real polling of run-status/detail. |
| | 🚦 **GATE 2 @2:00** | **Verdict page rendering REAL extracted findings from Run A? NO → cut the extractor; demo = MiroFish's own report + live narration of top objections. Ship that honestly.** |
| 2:00–2:25 | Battle (stripped) | If Run B completed: same extractor over Report B, 2-column same-category comparison (§7.3), both-runs findings first, no scores/winner. If not: Verdict A + a clearly labelled "Strategy B — simulation in progress / not completed in event time" panel stating the changed variable. |
| | 🚦 **GATE 3 @2:20** | **No Run B report = no Battle claim anywhere (title, README, demo). Retitle as a single-run war room with Battle in progress.** |
| 2:25–2:45 | Deploy attempt (time-boxed 20 min) + polish | One DO deploy attempt (App Platform web + Droplet backend, §6.3). Not live by 2:45 → localhost demo, stated plainly in README. Polish pass: badges (LIVE vs SAMPLE) on every result screen, kill dead buttons, spacing/typography only. |
| 2:45–3:00 | Freeze + README + rehearse | README: MiroFish + AGPL-3.0 + OASIS attribution, Zep disclosed, model badge info, run metadata for every cached run, SAMPLE/CACHED explanation, what is NOT built. One out-loud rehearsal on the cached path (§11). Submit. |
| | 🚦 **GATE 4 (continuous)** | **No faked activity, ever: status only from real API polling or labelled cache; no invented scores, messages, or sentiment.** |

Expected outcome, stated honestly: one genuine simulation of one idea, a structured verdict from its real report, a second run probably completing in time for a qualitative comparison, 3–4 honestly claimed categories, and a demo that survives "is this live?" because the answer is printed on screen.

## 10.2 Plan B — Full version (18–22 focused hours over ~1 week; the brief's 14 h is features only)

- **Phase 0 — Verification & foundations (2 h).** Docker Compose evaluated as primary local route. THREE complete simulations on three seed types (consumer app, B2B SaaS, marketplace), logging rounds / wall-clock / cost / report length / failure modes — this dataset is the real architecture input (polling, timeouts, caching, Battle design). Model profile frozen: **Profile OPEN-PURE** — sim LLM = open-weight (Gemma 4 `gemma-4-26b-a4b-it` via Gemini API or local Ollama checkpoint), extractor = Gemma 4 verdict (§6.5), Gemini for structuring + Battle comparison. AGPL + attribution + Zep disclosure in README from day one. A/A calibration pair (§7.2) run here.
- **Phase 1 — Backend integration (4 h).** Server-side MiroFish client over the real blueprints; run state machine `CREATED → GRAPH_BUILDING → PREPARING → RUNNING → REPORTING → COMPLETED/FAILED/TIMED_OUT`, persisted, real polled status; guardrails (rounds cap <40 default, per-run timeout, pre-run cost note, kill switch); normalised Scenario/Run(parent_run_id)/Report/Verdict schema in Atlas with local-JSON export; Backboard + Atlas behind the §6.2/§6.4 interfaces with labelled fallbacks; `/api/health/deps`.
- **Phase 2 — Five screens (5 h).** §5.4 in full: editable personas, per-phase War Room + agent interviews (a genuinely distinctive, API-supported feature), Verdict with deep-linked excerpts + Markdown copy, Battle with stored lineage + comparability panel, World Archive.
- **Phase 3 — Sponsor integrations as features (4 h).** Backboard cross-world recall demonstrated in a two-session flow; Atlas vector search over a REAL archive (≥10 genuine runs — seed it with Phase 0/test runs); ElevenLabs voiced briefing + per-persona voiced objections (§6.6) with MP3 cache; Snowflake comparator ONLY if its pre-event gate passed, flagged + cached; DO production deploy (run survives browser closing mid-sim).
- **Phase 4 — Evidence & hardening (3 h).** `runs/` evidence ledger; failure testing (LLM down mid-run, Zep unreachable, extraction JSON failure, sim timeout — each produces an honest UI state, screenshotted for README); cached-demo mode as a first-class feature; 3-min demo rehearsed twice; 90-second open-source proof (model badge + report naming its model).
- Projected outcome: 7 categories, 3–4 Strong (§0.3).

---

# 11. THE 3-MINUTE DEMO SCRIPT (emergency-medicine idea throughout)

Pre-demo (off the clock): laptop on tested hotspot/venue Wi-Fi, `/api/health/deps` all-green, Battle pair (genuine, pre-run today, labelled cached) loaded in World Archive, one live run ready to start, demo MP3s pre-generated, notifications off, browser zoom set.

| Time | Screen | Say / do |
|---|---|---|
| 0:00–0:20 | Launchpad | "Every founder hears 'great idea!' from a chatbot. LAUNCH OR DIE does the opposite — it builds a simulated market that argues back. The idea: an app that delivers emergency medicines within 15 minutes." Enter idea, audience "patients and caregivers in Kolkata", model "commission per order + delivery fee". Show one-click example chips exist. |
| 0:20–0:45 | Build Your Market | Show the 5 personas with goal + constraint visible. "These aren't prompts I wrote answers for — they're agents MiroFish builds from a knowledge graph of this scenario. The pharmacist only cares about prescription verification. The investor only cares about margin. They conflict — that's the point." |
| 0:45–1:15 | War Room (LIVE start) | Click Challenge My Idea. Show real status: graph building → round counter advancing, timestamps, one genuine excerpt as it lands. **Say explicitly: "A full run takes 20 to 40 minutes, so while this runs live, I'll show you the completed run of this exact idea from earlier today — labelled cached in the app, because it is."** This sentence is the honesty moment. Do not skip it to save time. |
| 1:15–1:55 | Verdict (cached genuine) | Three strongest objections: (1) Pharmacist — Schedule H prescription verification by a registered pharmacist cannot fit inside a 15-minute promise at 2 a.m.; (2) Operator — 15 min is only possible inside a ~2 km dark-store radius, so "a city" is really "a few neighbourhoods"; (3) Investor — delivery cost per order vs the fee a price-sensitive customer will pay = negative margin on small baskets. Click one objection → its supporting excerpts. Show one Validation Experiment + decision gate. Optional: play 10 s of the pre-generated ElevenLabs readback of the top objection. |
| 1:55–2:40 | Strategy Battle | "Now change exactly one variable." A: Speed first — 15 minutes. B: Reliability first — dependable 45–60 min window, verified prescription, no surge fee. Side-by-side, same categories, both genuine runs: A's top failure mode = verification + missed-promise trust collapse; B's = distinctiveness (the competitor agent argues B sounds like every existing pharmacy app). Recurring across BOTH: prescription workflow + unit economics. "The simulation didn't tell me I'll succeed. It told me the two assumptions I must test with real people before spending anything." |
| 2:40–3:00 | World Archive / close | Show both runs saved with parent/child link, model, rounds, timestamps. Close: **"LAUNCH OR DIE is an assumption-testing lab, not a prediction machine. Simulated reactions aren't market research — they're a cheap way to find your idea's weakest assumption while changing it still costs nothing."** Gesture to the live run from 0:45 still advancing, if it is. |

Total-failure variant: from 0:45 the script works unchanged on the cached pair alone — "Venue Wi-Fi and a 30-minute simulation don't mix, so here's the genuine run I completed this morning, labelled cached, with its run ID and timestamps — and here's the health check showing exactly which service is unreachable." Under the actual criteria, transparency scores; faked live activity loses everything.

---

# 12. REFINED CODING-AGENT PROMPT (paste-ready, self-contained)

Changes vs the brief's §9 prompt: (1) verification is Step 0 with a HARD STOP, not a last line; (2) stack corrected (Vue UI exists — reuse-first decision documented; exact prerequisites); (3) real API blueprints + env names anchored, Zep flagged required; (4) security override — never replicate upstream's localStorage / `X-LLM-*` key pattern, server-side proxy only; (5) sample mode specified exactly (label text, metadata, visual distinction, no live-style animation); (6) fake-live ban in enforceable terms; (7) fake-metrics ban extended (no idea score, sentiment %, numeric Battle winner, revenue numbers unless verbatim from a real report or a documented in-UI method); (8) cost/time guardrails (<40 rounds, per-run timeout, Battle starts only after Run A report is stored); (9) AGPL-3.0 + OASIS attribution + Zep disclosure + per-run model badge; (10) Gemini/Gemma split pinned (Gemma MUST own verdict extraction; Gemini owns schema-enforced structuring + Battle comparison; verified model IDs only); (11) personas are seed-shaped, entities verified after graph build.

```text
Build LAUNCH OR DIE, an AI startup assumption-testing web application powered by MiroFish.

PRODUCT: Founders enter a startup idea, run a multi-agent simulation of stakeholder
reactions (customers, operators/suppliers, competitors, investors), receive a structured
critique grounded in the actual simulation report, change ONE strategic assumption, run a
second simulation, and compare the two runs qualitatively. Position it as an
assumption-testing lab, NEVER as a predictor of business success.

STEP 0 — VERIFY BEFORE BUILDING (HARD STOP):
Clone https://github.com/666ghj/MiroFish , configure .env (LLM_API_KEY, LLM_BASE_URL,
LLM_MODEL_NAME, ZEP_API_KEY — the Zep Cloud key is REQUIRED; delete LLM_BOOST_* entirely
if unused), install with npm run setup:all (prerequisites: Node.js 18+, Python 3.11-3.12
ONLY, uv), start with npm run dev (frontend http://localhost:3000 , backend
http://localhost:5001), and complete ONE real simulation end-to-end (graph build ->
prepare -> simulation -> report generation, which must be triggered explicitly) using a
1-2 page seed brief for the demo idea (emergency medicine delivery) that NAMES each
stakeholder with incentives and constraints, at 10 rounds (hard ceiling: under 40).
Log every raw API request/response to files, and record: wall-clock per phase, rounds,
agents, model used, approximate cost, project_id/graph_id/simulation_id/report_id.
Then, on the SAME graph_id, run create -> prepare -> start -> report with a changed
simulation requirement (Strategy B) and record whether graph reuse worked and its time.
If no complete report exists after 90 minutes of Step 0, STOP and report exactly where
it failed. Build nothing else until Step 0 passes.

VERIFIED FACTS (do not re-derive, do not contradict):
- MiroFish ships a Vue.js 3 frontend + Python Flask backend; simulation is CAMEL-AI OASIS
  dual-platform (simulated Twitter + Reddit) with Zep Cloud GraphRAG memory. Licence
  AGPL-3.0 (engine), OASIS Apache-2.0. State all of this in the README.
- Personas are DERIVED from the seed document by ontology/entity extraction — there is no
  endpoint to POST a persona list. Persona UI shapes the seed brief + simulation
  requirement. After graph build, verify via the entities endpoint which stakeholders
  actually emerged; if one is missing, fix the SEED, not the UI.
- API blueprints: /api/graph (ontology/generate is SYNCHRONOUS; build is async, poll its
  task), /api/simulation (create, prepare, prepare/status, start with explicit
  max_rounds, stop, run-status/detail for the live action feed, interview), /api/report
  (generate, generate/status, get report). Inspect the installed code for exact schemas;
  response nesting varies per operation — write per-operation normalisers; persist every
  returned ID immediately; never retry a state-changing POST blindly (duplicates).
- There is NO fork/resume/compare feature, and no exposed seed/temperature. Strategy
  Battle = two independent simulations on the same graph + YOUR comparison layer.
  The changed variable lives in the simulation requirement, NEVER in the seed document.

SECURITY OVERRIDE: The upstream frontend stores LLM keys in browser localStorage and
sends them as X-LLM-* headers. DO NOT replicate this. All MiroFish and sponsor calls are
proxied through server-side API routes. No credential ever reaches the browser. Do not
expose the MiroFish backend publicly without a proxy/auth check (known CVE history).

STACK: Next.js + TypeScript + Tailwind + shadcn (minimal set) as ONE route with a 5-step
stepper (Launchpad, Build Your Market, War Room, Verdict, Strategy Battle) — NOT five
routes. Framer Motion scope-locked to step transitions + card fade-ins. NO React Flow in
the MVP. Status via polling (3-5s) — no WebSockets/SSE. lib/normalize.ts is the ONLY
file that touches raw MiroFish output; all UI consumes our own Report type. Build the UI
against that type + the genuine Step-0 sample run FIRST; wire live calls last. Runs are
async: POST returns 202 + run_id, status/report are polled; never hold a request open.

MODELS (verified IDs only — one GEMINI_API_KEY, server-side):
- Scenario structuring (idea -> structured scenario JSON): Gemini, model
  gemini-2.5-flash, responseMimeType + responseSchema enforced.
- Persona generation (scenario -> stakeholder set shaping the seed): Gemma 4, model
  gemma-4-26b-a4b-it, thinking_level high.
- Verdict / findings extraction (MiroFish report -> support, objections with verbatim
  traceable excerpts, unresolved assumptions, experiments with decision gates): Gemma 4,
  model gemma-4-31b-it (fallback gemma-4-26b-a4b-it), thinking_level high. THIS STEP MUST
  BE GEMMA 4. Validate its JSON in app code with one retry (Gemma has no documented
  enforced structured output). Drop any finding whose excerpt cannot be traced to an
  actual run log/report entry.
- Strategy comparison (both reports + both verdicts -> same-category qualitative diff):
  Gemini, gemini-2.5-flash.
- Simulation model inside MiroFish: point LLM_BASE_URL/LLM_MODEL_NAME at an OPEN-WEIGHT
  model (Gemma 4 via the Gemini API, or an Apache-2.0 Qwen checkpoint via Ollama/vLLM).
  PROFILE OPEN-PURE: no closed model (e.g. qwen-plus, or Gemini) may run the simulation
  or the verdict. NEVER use gemma-4-e4b-it / e2b / 12b as API IDs — they are not hosted.
- Log step, model, tokens, latency for every call. Every run displays a model badge
  (simulation model + verdict model, with licence class), read from config.

PAGES, IN BUILD ORDER:
1. Launchpad: idea, audience, business model, one-click example chips (incl. the
   emergency-medicine demo idea). Demo path must work with zero typing.
2. Build Your Market: 5 preset persona cards (customer, pharmacist, operator, competitor,
   investor) with role/goal/constraint; toggle on/off in MVP (editable in full build).
3. War Room: REAL polled status (phase, rounds, elapsed), excerpts only as returned by
   run-status/detail, honest error state + labelled sample fallback.
4. Verdict: strongest support / most serious objections (each with evidence excerpts) /
   unresolved assumptions / validation experiments — every experiment has hypothesis,
   concrete real-world test, decision gate. Disclaimer footer: simulated perspectives,
   not market research, not medical/legal/investment advice.
5. Strategy Battle: store parent_run_id + battleId; start Run B ONLY after Run A's
   report is stored; comparison in FIXED categories (support, objections deduplicated by
   mechanism, recurring concerns = raised by >=2 groups or >=2 rounds, stakeholder
   conflicts, failure modes with named triggers, unresolved assumptions), ordered:
   true-under-BOTH first, then A-only, then B-only, then conflicts, then descriptive
   counts, then limits, then experiments. Comparability panel shows seed hash, graph_id,
   model, rounds, agents, persona-file hash status, extractor version. Header discloses
   "exploratory, 1 run per strategy".

SAMPLE MODE (specified, mandatory): any cached artefact is labelled on-screen
"SAMPLE — CACHED GENUINE RUN" + run ID, completion timestamp, model, rounds, and is
visually distinct from live content. Never animate cached content as live.

NO FAKE ANYTHING (enforceable): no timer-faked agent messages, no invented typing or
placeholder chatter (loading = real polled state + elapsed time only); no idea score, no
success probability, no sentiment percentage, no revenue/market projection, no numeric
Battle winner, no winner badge — unless a number is copied verbatim from an actual
simulation report. Permitted numbers: descriptive counts of THIS run's extracted
findings (distinct objections, groups raising a theme, rounds, actions, agents),
labelled as counts, never as quality. Conclusion format: "Lean: <strategy> — because
<qualitative finding>. Confidence: exploratory (1 run per strategy). Validate first:
<experiment>."

SPONSORS (only if the core flow works; each behind an interface with a labelled local
fallback): Backboard — one assistant per founder, one thread per run, write 3-5 distilled
verdict facts with memory="Auto" after each run, recall on Battle fork, cross-checked
against the archive before showing a "tested before" badge. MongoDB Atlas — World
Archive (founders/ideas/runs/findings/battles schemas as specced), Battle diff computed
by set operations on assumptionKey, vector search ("similar past objections") only after
storage works. ElevenLabs — persona-voiced objection clips + spoken verdict briefing via
a server /api/tts route, MP3 cache keyed by hash(text+voice+model), pre-generated demo
audio, lazy generation, never blocking the Verdict. Snowflake — ONLY behind
SNOWFLAKE_ENABLED as the Battle comparator via Cortex REST, 15s timeout, fallback to the
Gemini comparator, badge states LIVE/CACHED/fallback truthfully; if the pre-event gate
(trial + card + PAT + one real curl) failed, omit Snowflake completely.

SCOPE: solo hackathon. One end-to-end flow + two sequential runs beat any breadth.
NO auth, payments, collaboration, custom simulation engine, 3D, simulated stock market,
or pitch polish before the flow works.
DELIVERABLE ORDER: (0) Step-0 verification report with timings, (1) one live end-to-end
run, (2) Verdict from a real report, (3) Battle comparison, (4) polish. Never describe a
later stage as done before its evidence exists.
```

---

# 13. MASTER HONESTY RULES

1. Simulated personas are not real people, customers, or market research — say so on the Verdict screen, the Battle screen, and in the README.
2. No score, probability, sentiment %, revenue number, or winner badge without a verbatim source in a real report (§7.4).
3. Cached = labelled cached, with provenance, on every surface. Live = only what a real API response returned.
4. Every finding needs a traceable excerpt or it is dropped (MiroFish report-fabrication risk is documented, §1.5).
5. Open-source claim = Profile OPEN-PURE (§6.1): open harness + open simulation model + Gemma verdict; Zep Cloud disclosed as the closed dependency; AGPL obligations honoured.
6. Counts describe a run's discussion, never a market, and never rank strategies.
7. Differences between two runs may be noise — lead with what survived both runs; disclose n=1.
8. Regulatory/medical content: business-model discussion only, no advice, no invented statutes as fact.
9. A sponsor category is claimed only when its tech is exercised in the demo or repo evidence.
10. Failed/partial runs are shown as failed/partial, with round counts — never silently compared against a full run.

---

# 14. SOURCES — FULL PLAIN URLS BY SECTION

MiroFish — repo, raw files, docs, site:
https://github.com/666ghj/MiroFish
https://github.com/666ghj/MiroFish/commits/main
https://raw.githubusercontent.com/666ghj/MiroFish/main/.env.example
https://raw.githubusercontent.com/666ghj/MiroFish/main/backend/pyproject.toml
https://raw.githubusercontent.com/666ghj/MiroFish/main/backend/requirements.txt
https://deepwiki.com/666ghj/MiroFish
https://deepwiki.com/666ghj/MiroFish/3-backend-services
https://deepwiki.com/666ghj/MiroFish/3.5-report-agent-and-analysis
https://deepwiki.com/haje01/MiroFish/5.1-graph-api
https://deepwiki.com/haje01/MiroFish/2.2-configuration
https://deepwiki.com/haje01/MiroFish/3.2-step-2:-environment-setup
https://deepwiki.com/haje01/MiroFish/3.4-step-4:-report-generation
https://deepwiki.com/haje01/MiroFish/5.3-report-api
https://deepwiki.com/nikmcfly/MiroFish-Offline/6.2-simulation-api
https://deepwiki.com/nikmcfly/MiroFish-Offline/4.2-five-stage-workflow
https://deepwiki.com/nikmcfly/MiroFish-Offline/5.3-backend-architecture
https://deepwiki.com/nikmcfly/MiroFish-Offline/8.2-hardware-requirements
https://mirofish.ink/
https://github.com/camel-ai/oasis
https://pypi.org/project/camel-oasis/
https://www.star-history.com/666ghj/mirofish/
https://cve.report/CVE-2026-7041.pdf

MiroFish — install guides, timed runs, integration experience, reviews:
https://sanjayshankar.me/mirofish-setup-guide-ai-market-simulation/
https://www.offloadmemory.com/resources/ai-tools/mirofish-installation-startup-idea-simulation-guide
https://globalaiforce.com/mirofish-how-to-install-and-set-up-2026-guide/
https://apidog.com/blog/what-is-mirofish/
https://apidog.com/blog/mirofish-swarm-intelligence-simulation-engine/
https://pyshine.com/MiroFish-AI-Swarm-Intelligence-Engine/
https://regolo.ai/run-mirofish-with-regolo-ai-a-complete-integration-guide/
https://github.com/MOZARTINOS/mirofish-guide
https://dev.to/kingsleyonoh/a-simulation-id-is-not-a-running-simulation-787
https://lebanon.dashable.dev/
https://www.weex.com/news/detail/is-polymarkets-pricing-accurate-i-simulated-a-crisis-with-200-agents-to-find-out-382326
https://dev.to/iojas/we-fed-34-news-articles-into-an-ai-prediction-engine-here-is-what-actually-happened-5089
https://scalr.sg/blog/mirofish-simulate-your-launch/
https://www.blocmates.com/articles/what-is-mirofish-the-agent-engine-that-can-predict-anything-and-everything
https://pasqualepillitteri.it/en/news/21443/does-mirofish-really-work-agent-swarm-alternatives
https://www.blog.brightcoding.dev/2026/06/13/stop-paying-cloud-apis-run-insane-multi-agent-simulations-locally-with-mirofish-offline
https://nervegna.substack.com/p/autoresearchclaw-mirofish-claude

Open-source / licensing / Gemma background:
https://www.opensourcealternatives.to/item/mirofish
https://mirofish.shop/
https://bearingpoint.services/foss/en/newsblogs/understanding-network-copyleft-in-saas/
https://systems-analysis.info/eng/Qwen_%28Alibaba%29
https://www.morphllm.com/qwen-api
https://wavespeed.ai/blog/posts/what-is-google-gemma-4/
https://dev.to/x4nent/complete-guide-to-google-gemma-4-apache-20-open-model-benchmark-ple-architecture-to-ollama-35ad
https://dev.to/challenges/hacktoberfest-week1-2026-10-05
https://dev.to/devteam/join-the-hacktoberfest-open-source-ai-challenge-slow-and-steady-2850-in-prizes-across-21-3iee

Google — Gemini API + Gemma 4 (official):
https://ai.google.dev/gemma/docs/core/gemma_on_gemini_api
https://ai.google.dev/gemma/docs/core/model_card_4
https://gemma.ai/deployment/gemini-api/
https://ai.google.dev/gemini-api/docs/models?authuser=0
https://ai.google.dev/gemini-api/docs/rate-limits?authuser=2
https://ai.google.dev/gemini-api/docs/pricing
https://ai.google.dev/gemini-api/docs/changelog?hl=en
https://aistudio.google.com/rate-limit
https://aistudio.google.com/apikey
https://developers.google.com/edge/litert-lm/models/gemma-4
https://www.philschmid.de/gemma-4-gemini-api
https://dev.to/ai_made_tools/responsejsonschema-the-undocumented-gemma-4-feature-that-changed-everything-2obm

Backboard:
https://backboard.io/products/api
https://dev.to/backboardio/stateful-ai-without-a-database-threads-and-assistants-2i3f
https://dev.to/backboardio/give-your-ai-memory-in-one-parameter-4n76
https://dev.to/backboardio/chat-with-your-documents-agentic-rag-in-a-few-lines-10in
https://pypi.org/project/backboard-sdk/1.4.0/

MongoDB Atlas:
https://www.mongodb.com/pricing
https://www.mongodb.com/docs/atlas/atlas-vector-search/compatibility-limitations/
https://www.mongodb.com/docs/atlas/billing/atlas-flex-costs/
https://mongoosejs.com/docs/atlas-vector-search.html
https://www.datacamp.com/tutorial/vector-search-in-mongodb-guide
https://appstackinsider.com/insights/mongodb-atlas-pricing-explained/

DigitalOcean (official + community):
https://docs.digitalocean.com/products/app-platform/details/pricing/
https://docs.digitalocean.com/products/app-platform/details/limits/?ref=madewithlove.com
https://docs.digitalocean.com/products/app-platform/how-to/manage-services/
https://docs.digitalocean.com/products/app-platform/how-to/manage-internal-routing/index.html.md
https://docs.digitalocean.com/products/app-platform/how-to/manage-workers/
https://docs.digitalocean.com/glossary/worker/
https://docs.digitalocean.com/products/inference/details/features/
https://www.digitalocean.com/pricing/droplets?ref=blog.threshold.network
https://try.digitalocean.com/mlh/?utm_medium=partnership&utm_source=mlh&utm_campaign=sept_hack_weekt&utm_content=conversion
https://www.digitalocean.com/community/questions/increasing-timeout
https://www.digitalocean.com/community/questions/do-app-platform-jobs-have-a-timeout?comment=95388

ElevenLabs:
https://websitevoice.com/blog/elevenlabs-pricing-plans/
https://www.cloudzero.com/blog/elevenlabs-pricing/
https://dev.to/voice_developer/setting-up-elevenlabs-api-from-zero-to-production-2g4
https://apicostcalc.com/elevenlabs.html

Snowflake (official + 120-day origin):
https://www.snowflake.com/en/snowflake-trial/
https://docs.snowflake.com/en/user-guide/admin-trial-account
https://community.snowflake.com/s/article/Can-Snowflake-Support-extend-my-trial-account
https://docs.snowflake.com/user-guide/snowflake-cortex/cortex-rest-api?utm_cta=website-blog-side-featured-the-ai-tipping-point-what-retail-leaders-need-to-know-ai-+-data-predictions-2025&lang=pt-br
https://docs.litellm.ai/docs/providers/snowflake
https://hackmty2025.devpost.com/

Pricing trackers (verify in provider console before spending):
https://www.getmaxim.ai/bifrost/llm-cost-calculator/provider/dashscope/model/qwen-plus
https://qwen3lm.com/api/

Competitors and prior art:
https://athanor.market/from/taaft?utm_source=taaft&utm_medium=referral&utm_campaign=taaft_launch_2026_04&utm_content=listing
https://dev.to/yashraj_val8/how-i-built-a-45-agent-ai-panel-to-brutally-roast-startup-ideas-architecture-deep-dive-3ha0
https://dev.to/anand_kashyap_21/i-built-an-ai-that-roasts-your-startup-idea-like-a-vc-would-2k8n
https://landing-dev.argumentroupe.com/
https://validatorai.com/tools/?tid=241024401281070
https://www.aiiqa.com/validate/
https://ideascan.net/
https://seedangels.ai/startup-idea-validator
https://konceptai.in/
https://gonogo.team/blog/startup-idea-validation-tools-2026
https://deepwiki.com/microsoft/TinyTroupe/5.1-market-research
https://arxiv.org/pdf/2411.11581
https://arxiv.org/html/2411.11581v5
https://www.ycombinator.com/companies/artificial-societies
https://fish.dog/news/aaru-alternatives-in-2026-the-best-synthetic-population-platforms
https://fish.dog/news/best-synthetic-research-platforms-in-2026-fishdog-evidenza-simile-and-more
http://www.evidenza.ai/faqs
https://www.delve.ai/synthetic-research
https://www.echotest.ai/
https://www.remesh.ai/market-research
https://arxiv.org/abs/2509.02605v1
https://interactions.acm.org/blog/view/the-synthetic-persona-fallacy-how-ai-generated-research-undermines-ux-research
https://cleverx.com/blog/synthetic-users-for-research-what-they-are-and-where-they-fall-short
https://news.ycombinator.com/item?id=44221211

Variance / reproducibility research:
https://pmc.ncbi.nlm.nih.gov/articles/PMC12627210/
https://www.mdpi.com/2673-2688/7/8/279
https://developers.openai.com/cookbook/examples/reproducible_outputs_with_the_seed_parameter
https://dev.to/gitlab_3188/temperature-0-is-a-suggestion-five-llm-determinism-myths-and-a-rerun-harness-1b40

Judging / event format:
https://mlh-prime-southwest.devpost.com/rules
https://dev.to/devhabeeblateef/how-to-hack-like-a-pro-at-hacktoberfest-2026-even-if-youre-new-g1c
https://dev.to/shresthapandey/hacktoberfest-2026-the-complete-guide-new-rules-dates-swag-and-how-to-join-480f

India e-pharmacy regulation:
https://spiceroutelegal.com/publications/regulation-of-e-pharmacies-in-india/
https://tlh.law/insights/navigating-the-future-of-e-pharmacies-balancing-accessibility-and-regulation-in-india
https://law4u.in/top-answer/20489/are-online-pharmacies-and-sale-of-medicines-strictly-regulated-under-e-commerce-laws

---

# APPENDIX — CAVEATS ON THIS RESEARCH ITSELF

- Endpoint spellings come from source-cited DeepWiki documentation + one independent live integration account, NOT from running the checkout in this research pass. The §2.5 spike is where they become contract-tested. Fork docs (Offline etc.) differ in storage, routes and env vars — never mix them with upstream.
- All run times/costs are third-party operator reports at small configurations; MiroFish publishes no benchmark. Gemini/Qwen unit prices come from tracker/compilation pages checked 2026-10-23, not a live console.
- Negative findings (no compare endpoint, no seed/temperature) are absence from the documented API/env surface plus a "planned" listing — strong, framed as "verify in the installed version", not proof about undocumented internals.
- DO's ~100 s HTTP timeout is from DO community staff answers (consistent across several), not a single official limits page; the 30-min job figure is from the official limits page.
- Star/fork counts, model availability and trial terms are as fetched 2026-10-23 and will drift.
- Companion file from agent 12 (decision framework + earlier verdict draft): `workspace/hacktoberfest-kolkata/LAUNCH-OR-DIE-FINAL-VERDICT-and-Build-Plans.md` — this file supersedes it as the single deliverable; the companion is retained as a working part, not a second answer.
