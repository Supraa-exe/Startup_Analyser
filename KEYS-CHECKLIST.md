# KEYS CHECKLIST — LAUNCH OR DIE

This file documents all required and optional environment credentials. It contains **NO secret values**, safe placeholders only.

## Core Services (Step Zero Gate & Engine Execution)
| Secret Key | Description | Status in Current Environment | Fallback Behavior |
|---|---|---|---|
| `LLM_API_KEY` | OpenAI-compatible LLM endpoint API key | Not Set | Local audited deterministic simulation harness |
| `LLM_BASE_URL` | LLM API Base URL (e.g. DashScope, OpenRouter) | Defaults to `https://dashscope.aliyuncs.com/compatible-mode/v1` | Local harness |
| `LLM_MODEL_NAME` | Model name for simulation agents | Defaults to `qwen-plus` | Audited benchmark profiles |
| `ZEP_API_KEY` | Zep Cloud API Key for GraphRAG memory | Not Set | Graph building bypassed; seed ontology mapped directly |
| `MIROFISH_LIVE_URL`| URL of running MiroFish Flask server | Defaults to `http://localhost:5001` | Server-side local harness (`SAMPLE — CACHED GENUINE RUN`) |

## Optional AI Integrations (Secondary)
| Secret Key | Description | Status | Fallback Behavior |
|---|---|---|---|
| `GEMINI_API_KEY` | Google Gemini 2.5 Flash / Gemma 4 IT endpoint | Optional | Built-in structured extraction schemas & heuristics |
| `ELEVENLABS_API_KEY` | Spoken audio briefings & voiced objections | Optional (Secondary) | Pure technical text verdict rendering |
| `BACKBOARD_API_KEY` | Long-term cross-run memory | Optional (Secondary) | World Archive Local JSON store (`.data/`) |
| `MONGODB_URI` | MongoDB Atlas cluster connection string | Optional (Secondary) | Local JSON store (`.data/runs.json`, `.data/battles.json`) |
