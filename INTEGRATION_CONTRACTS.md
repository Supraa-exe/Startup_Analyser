# INTEGRATION CONTRACTS — LAUNCH OR DIE

## 1. Domain Types (`lib/domain/types.ts`)

```typescript
export interface ScenarioInput {
  name: string;
  description: string;
  targetAudience: string;
  businessModel: string;
  valueProposition: string;
  keyAssumption: string;
}

export interface StakeholderPreset {
  id: string;
  role: string;
  goal: string;
  incentive: string;
  constraint: string;
  enabled: boolean;
}

export type RunPhase = 
  | 'QUEUED' 
  | 'GRAPH_BUILDING' 
  | 'PREPARING' 
  | 'RUNNING' 
  | 'REPORTING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'STOPPED';

export interface ActionLogItem {
  round_num: number;
  timestamp: string;
  platform: 'twitter' | 'reddit';
  agent_id: number;
  agent_name: string;
  action_type: string;
  action_args: { content?: string; [key: string]: unknown };
  result?: unknown;
  success: boolean;
}

export interface Finding {
  id: string;
  claim: string;
  evidence: string[]; // Verbatim quotes from report or action feed
  stakeholderRole?: string;
  roundReference?: number;
  validationExperiment: string;
  decisionGate: {
    continueSignal: string;
    changeSignal: string;
    abandonSignal: string;
  };
}

export interface Verdict {
  runId: string;
  title: string;
  summary: string;
  supportingArguments: Finding[];
  majorObjections: Finding[];
  stakeholderConflicts: Finding[];
  unresolvedAssumptions: Finding[];
  generatedAt: string;
  isCachedSample: boolean;
  provenance: {
    model: string;
    rounds: number;
    agentCount: number;
    completionTime: string;
  };
}

export interface StrategyBattle {
  battleId: string;
  runAId: string;
  runBId: string;
  strategyA: {
    variableName: string;
    variableValue: string;
    verdict: Verdict;
  };
  strategyB: {
    variableName: string;
    variableValue: string;
    verdict: Verdict;
  };
  comparison: {
    sharedThemes: string[];
    onlyInA: string[];
    onlyInB: string[];
    keyConflicts: string[];
    recommendedNextStep: string;
  };
  createdAt: string;
}
```

## 2. Server API Route Contracts

### `POST /api/simulate`
- **Request:**
  ```json
  {
    "scenario": { ...ScenarioInput },
    "stakeholders": [ ...StakeholderPreset ],
    "strategyVariable": "15-minute emergency dispatch guarantee",
    "maxRounds": 10
  }
  ```
- **Response (202 Accepted):**
  ```json
  {
    "success": true,
    "runId": "run_lod_xxxx",
    "status": "QUEUED"
  }
  ```

### `GET /api/status?runId=run_lod_xxxx`
- **Response (200 OK):**
  ```json
  {
    "runId": "run_lod_xxxx",
    "status": "RUNNING",
    "phase": "RUNNING",
    "currentRound": 4,
    "maxRounds": 10,
    "elapsedSeconds": 48,
    "isCachedSample": true,
    "recentActions": [ ...ActionLogItem ],
    "verdict": null | Verdict
  }
  ```

### `POST /api/battle`
- **Request:**
  ```json
  {
    "runAId": "run_lod_xxxx",
    "strategyBVariable": "Scheduled 45-60 minute reliable window"
  }
  ```
- **Response (202 Accepted):**
  ```json
  {
    "battleId": "bat_lod_xxxx",
    "runBId": "run_lod_yyyy",
    "status": "QUEUED"
  }
  ```
