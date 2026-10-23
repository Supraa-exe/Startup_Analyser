# LAUNCH OR DIE — Engineering & Architecture Retrospective

## What We Learned & Verified

### 1. MiroFish Engine Reality
- **Upstream Architecture:** MiroFish is fundamentally a simulated social platform (CAMEL-AI OASIS) where agents interact across Twitter and Reddit SQLite databases, with temporal entity graphs stored in Zep Cloud.
- **Stakeholder Personas are Derived, Not Author-Injected:** Upstream does not offer a direct endpoint to inject controllable agents. Personas must be seeded into the scenario Markdown document and extracted by Zep GraphRAG. If a stakeholder role is omitted from the seed brief, the agent never materializes.
- **Python Version & Package Constraints:** Upstream `pyproject.toml` claims `requires-python = ">=3.11,<3.13"`, but its essential dependency `camel-oasis==0.2.5` publishes wheels strictly constrained to `<3.12,>=3.10.0`. Python 3.12 cannot install it without building from source. Python 3.11 is the hard requirement.
- **Graph Reuse in Strategy Battles:** A single `graph_id` can be referenced across multiple simulations (`POST /api/simulation/create`), making Strategy Battle comparisons fast by reusing the same 7–10 minute graph build while varying the simulation requirement.

### 2. Evidence Integrity & Honest AI
- To prevent hallucinated consensus, every finding extracted in the Verdict stage must cite verbatim action log excerpts from simulated agents. If a quote cannot be verified against the report or action feed, it must be discarded.
- Predictive probabilities (e.g. "78% market acceptance") are dangerous fabrications in simulated crowds; qualitative categorization (supporting arguments, objections, conflicts, and physical validation gates) provides real value to founders without misleading them.
