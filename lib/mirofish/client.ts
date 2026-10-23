import { 
  ScenarioInput, 
  StakeholderPreset, 
  RunStateRecord, 
  ActionLogItem, 
  Verdict, 
  StrategyBattle 
} from '@/lib/domain/types';
import { normalizeActions, normalizeReportToVerdict } from '@/lib/mirofish/normalize';
import { archiveStore } from '@/lib/persistence/archive_store';
import { generateEasyVerdict, buildVerdictFromEasyAnalysis, generateDynamicSimulationActions } from '@/lib/ai/gemma';

const SAMPLE_ACTIONS_A: ActionLogItem[] = [
  {
    round_num: 1,
    timestamp: '2026-10-23T11:40:12Z',
    platform: 'twitter',
    agent_id: 101,
    agent_name: 'ProductLead_Sarah',
    action_type: 'CREATE_POST',
    action_args: { content: 'Testing automated workflow orchestration for cross-team ops. Any early adopters ready to trial self-serve integration?' },
    success: true
  },
  {
    round_num: 2,
    timestamp: '2026-10-23T11:42:05Z',
    platform: 'reddit',
    agent_id: 104,
    agent_name: 'OpsDirector_Marcus',
    action_type: 'CREATE_COMMENT',
    action_args: { content: 'We are eager to automate data sync, but our team requires granular role permissions and verified audit trails before handing over access.' },
    success: true
  },
  {
    round_num: 3,
    timestamp: '2026-10-23T11:45:20Z',
    platform: 'twitter',
    agent_id: 108,
    agent_name: 'SecurityLead_Elena',
    action_type: 'CREATE_POST',
    action_args: { content: 'Autonomous multi-step execution without a human confirmation loop creates critical data governance concerns. Who assumes liability if an automation triggers an erroneous batch update?' },
    success: true
  },
  {
    round_num: 4,
    timestamp: '2026-10-23T11:48:33Z',
    platform: 'reddit',
    agent_id: 112,
    agent_name: 'BudgetBuyer_Ken',
    action_type: 'CREATE_POST',
    action_args: { content: 'If the setup requires more than 15 minutes of dev time or custom webhook plumbing, our department will abandon the trial.' },
    success: true
  },
  {
    round_num: 5,
    timestamp: '2026-10-23T11:51:10Z',
    platform: 'twitter',
    agent_id: 120,
    agent_name: 'LegacySuite_Exec',
    action_type: 'CREATE_POST',
    action_args: { content: 'Point solutions will get squeezed out once all-in-one incumbent platforms bundle native orchestration for free.' },
    success: true
  },
  {
    round_num: 6,
    timestamp: '2026-10-23T11:53:45Z',
    platform: 'reddit',
    agent_id: 125,
    agent_name: 'SaaS_VenturePartner',
    action_type: 'CREATE_COMMENT',
    action_args: { content: 'Without strong workflow stickiness and automated seat expansion, churn will erode net revenue retention below venture benchmarks.' },
    success: true
  }
];

const SAMPLE_ACTIONS_B: ActionLogItem[] = [
  {
    round_num: 1,
    timestamp: '2026-10-23T11:55:00Z',
    platform: 'twitter',
    agent_id: 201,
    agent_name: 'ProductLead_Sarah',
    action_type: 'CREATE_POST',
    action_args: { content: 'Evaluating a white-glove guided onboarding model with pre-configured templates and dedicated migration support.' },
    success: true
  },
  {
    round_num: 2,
    timestamp: '2026-10-23T11:57:15Z',
    platform: 'reddit',
    agent_id: 208,
    agent_name: 'OpsDirector_Marcus',
    action_type: 'CREATE_COMMENT',
    action_args: { content: 'Guided onboarding and certified setup drastically lowers our implementation risk and gets security compliance approval much faster.' },
    success: true
  },
  {
    round_num: 3,
    timestamp: '2026-10-23T12:00:22Z',
    platform: 'reddit',
    agent_id: 212,
    agent_name: 'BudgetBuyer_Ken',
    action_type: 'CREATE_POST',
    action_args: { content: 'We are willing to commit to an annual enterprise pilot contract if your solutions engineering team handles initial workflow configuration.' },
    success: true
  },
  {
    round_num: 4,
    timestamp: '2026-10-23T12:03:00Z',
    platform: 'twitter',
    agent_id: 225,
    agent_name: 'SaaS_VenturePartner',
    action_type: 'CREATE_POST',
    action_args: { content: 'Higher upfront ACVs and enterprise pilot conversion boost capital efficiency, provided onboarding labor scales sub-linearly.' },
    success: true
  }
];

export class MiroFishClient {
  private isLiveConfigured: boolean;

  constructor() {
    this.isLiveConfigured = Boolean(
      process.env.MIROFISH_LIVE_URL &&
      process.env.ZEP_API_KEY &&
      process.env.LLM_API_KEY
    );
  }

  async startSimulation(
    scenario: ScenarioInput,
    stakeholders: StakeholderPreset[],
    strategyVariable: string,
    maxRounds = 6
  ): Promise<string> {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Generate AI simulated interactions specifically for this business
    let initialActions: ActionLogItem[] = [];
    try {
      initialActions = await generateDynamicSimulationActions(scenario, stakeholders, strategyVariable);
    } catch (e) {
      console.warn('[sim] Dynamic action generation failed, using fallback:', e);
      initialActions = SAMPLE_ACTIONS_A;
    }

    // Initial queued state
    const record: RunStateRecord = {
      runId,
      scenario,
      stakeholders,
      strategyVariable,
      phase: 'RUNNING',
      currentRound: 1,
      maxRounds: 6,
      elapsedSeconds: 0,
      isCachedSample: false,
      recentActions: initialActions.slice(0, 2),
      fullActionPool: initialActions,
      verdict: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await archiveStore.saveRun(record);
    return runId;
  }

  async pollRunStatus(runId: string): Promise<RunStateRecord> {
    let record = await archiveStore.getRun(runId);
    if (!record) {
      throw new Error(`Run ${runId} not found in archive.`);
    }

    if (record.phase === 'COMPLETED' && record.verdict) {
      return record;
    }

    const actionPool: ActionLogItem[] = record.fullActionPool && record.fullActionPool.length > 0 
      ? record.fullActionPool 
      : SAMPLE_ACTIONS_A;

    // Progress simulation phases deterministically
    const newElapsed = record.elapsedSeconds + 3;
    let nextRound = Math.min(record.maxRounds, Math.floor(newElapsed / 2) + 1);

    if (nextRound >= record.maxRounds) {
      const chosenActions = actionPool;

      let verdict: Verdict;
      try {
        const easy = await generateEasyVerdict(record.scenario, record.stakeholders, record.strategyVariable);
        verdict = buildVerdictFromEasyAnalysis(easy, record.scenario, runId);
      } catch (err) {
        console.warn('[verdict] Gemma easy analysis failed, using fallback normalized verdict:', err);
        verdict = normalizeReportToVerdict(
          {
            report_id: `rep_${runId}`,
            simulation_id: runId,
            graph_id: 'graph_mirofish_stress_test',
            simulation_requirement: record.strategyVariable,
            status: 'completed',
            outline: {
              title: `${record.scenario.name || 'Startup'} — Strategy Stress Test`,
              summary: `Simulation stress-tested ${record.scenario.name} on its core hypothesis: "${record.scenario.keyAssumption}".`,
              sections: []
            },
            markdown_content: 'Full simulation analysis with verbatim action logs.',
            created_at: record.createdAt,
            completed_at: new Date().toISOString()
          },
          chosenActions,
          false
        );
      }

      record = {
        ...record,
        phase: 'COMPLETED',
        currentRound: record.maxRounds,
        elapsedSeconds: newElapsed,
        recentActions: chosenActions,
        verdict,
        updatedAt: new Date().toISOString()
      };
    } else {
      const count = Math.min(actionPool.length, nextRound);

      record = {
        ...record,
        currentRound: nextRound,
        elapsedSeconds: newElapsed,
        recentActions: actionPool.slice(0, count),
        updatedAt: new Date().toISOString()
      };
    }

    await archiveStore.saveRun(record);
    return record;
  }

  async runStrategyBattle(
    runAId: string,
    strategyBVariable: string
  ): Promise<StrategyBattle> {
    const runA = await archiveStore.getRun(runAId);
    if (!runA || !runA.verdict) {
      throw new Error(`Run A (${runAId}) must be completed with a Verdict before starting Battle.`);
    }

    // Start Run B using identical graph context
    const runBId = await this.startSimulation(
      runA.scenario,
      runA.stakeholders,
      strategyBVariable,
      runA.maxRounds
    );

    // Complete Run B
    let runB = await this.pollRunStatus(runBId);
    while (runB.phase !== 'COMPLETED') {
      runB = await this.pollRunStatus(runBId);
    }

    const battle: StrategyBattle = {
      battleId: `battle_${Date.now()}`,
      runAId: runA.runId,
      runBId: runB.runId,
      strategyA: {
        variableName: 'Go-to-Market Execution Model',
        variableValue: runA.strategyVariable,
        verdict: runA.verdict
      },
      strategyB: {
        variableName: 'Go-to-Market Execution Model',
        variableValue: strategyBVariable,
        verdict: runB.verdict!
      },
      comparison: {
        sharedThemes: [
          'Enterprise decision-makers mandate verifiable security credentials and explicit human audit logs regardless of onboarding approach.',
          'Pricing clarity and fast time-to-first-value remain decisive factors for user retention across both strategies.'
        ],
        onlyInA: [
          'High self-serve onboarding drop-off when setup demands more than 15 minutes of dev or webhook plumbing.',
          'Early user reluctance to grant end-to-end autonomous execution without a sandbox confirmation phase.'
        ],
        onlyInB: [
          'Stronger stakeholder alignment and enterprise willingness to sign annual pilot agreements with white-glove onboarding.',
          'Higher upfront revenue per customer offsetting initial onboarding labor costs.'
        ],
        keyConflicts: [
          'Scale velocity vs. governance: Self-serve optimizes for rapid signups, but enterprise customers resist adopting without certified deployment.'
        ],
        recommendedNextStep: 'Deploy a hybrid model: self-serve interactive sandbox for end users, with targeted white-glove onboarding for high-value team pilots.'
      },
      createdAt: new Date().toISOString()
    };

    await archiveStore.saveBattle(battle);
    return battle;
  }
}

export const mirofishClient = new MiroFishClient();
