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
  evidence: string[]; // Verbatim quotes from genuine run
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
    engineCommit?: string;
  };
  easyVerdict?: {
    overallScore: number;
    verdictLabel: 'STRONG GO' | 'CAUTIOUS PIVOT' | 'HIGH RISK';
    executiveSummary: string;
    strengths: Array<{ title: string; explanation: string }>;
    criticalRisks: Array<{ title: string; explanation: string; severity: 'HIGH' | 'MEDIUM' }>;
    actionableNextSteps: Array<{ step: string; why: string }>;
    keyRecommendation: string;
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

export interface RunStateRecord {
  runId: string;
  scenario: ScenarioInput;
  stakeholders: StakeholderPreset[];
  strategyVariable: string;
  phase: RunPhase;
  currentRound: number;
  maxRounds: number;
  elapsedSeconds: number;
  isCachedSample: boolean;
  recentActions: ActionLogItem[];
  fullActionPool?: ActionLogItem[];
  verdict: Verdict | null;
  error?: string;
  createdAt: string;
  updatedAt: string;
}
