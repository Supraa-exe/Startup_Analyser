import assert from 'node:assert';
import { test } from 'node:test';
import { normalizeActions, normalizeReportToVerdict } from '../lib/mirofish/normalize';

test('normalizeActions converts raw MiroFish detail into typed ActionLogItem array', () => {
  const rawDetail = {
    simulation_id: 'sim_test_1',
    runner_status: 'running',
    current_round: 2,
    all_actions: [
      {
        round_num: 1,
        timestamp: '2026-10-23T10:00:00Z',
        platform: 'twitter',
        agent_id: 42,
        agent_name: 'TestPharmacist',
        action_type: 'CREATE_POST',
        action_args: { content: 'Testing cold chain compliance' },
        success: true
      }
    ]
  };

  const normalized = normalizeActions(rawDetail);
  assert.strictEqual(normalized.length, 1);
  assert.strictEqual(normalized[0].agent_name, 'TestPharmacist');
  assert.strictEqual(normalized[0].platform, 'twitter');
  assert.strictEqual(normalized[0].action_args.content, 'Testing cold chain compliance');
  assert.strictEqual(normalized[0].round_num, 1);
});

test('normalizeReportToVerdict preserves verbatim evidence and enforces no false scores', () => {
  const mockReport = {
    report_id: 'rep_123',
    simulation_id: 'sim_123',
    graph_id: 'graph_123',
    simulation_requirement: '15-minute emergency SLA',
    status: 'completed',
    outline: {
      title: 'Emergency Medicine Test',
      summary: 'Executive summary of findings',
      sections: []
    },
    markdown_content: 'Full markdown report',
    created_at: '2026-10-23T10:00:00Z',
    completed_at: '2026-10-23T10:20:00Z'
  };

  const mockActions = [
    {
      round_num: 2,
      timestamp: '2026-10-23T10:05:00Z',
      platform: 'twitter' as const,
      agent_id: 1,
      agent_name: 'Pharmacist_Dave',
      action_type: 'CREATE_POST',
      action_args: { content: 'Verified pharmacist evidence quote.' },
      success: true
    }
  ];

  const verdict = normalizeReportToVerdict(mockReport, mockActions, true);
  
  assert.strictEqual(verdict.runId, 'sim_123');
  assert.strictEqual(verdict.isCachedSample, true);
  assert.ok(verdict.supportingArguments.length > 0);
  assert.ok(verdict.majorObjections.length > 0);
  assert.ok(verdict.stakeholderConflicts.length > 0);
  assert.ok(verdict.unresolvedAssumptions.length > 0);

  // Traceable evidence check
  const firstSupport = verdict.supportingArguments[0];
  assert.ok(firstSupport.evidence.length > 0);
  assert.ok(firstSupport.validationExperiment.length > 10);
  assert.ok(firstSupport.decisionGate.continueSignal.length > 5);

  // Prohibited metrics check (Directive §2)
  const verdictObj = verdict as unknown as Record<string, unknown>;
  assert.strictEqual(verdictObj.score, undefined);
  assert.strictEqual(verdictObj.viabilityPercentage, undefined);
  assert.strictEqual(verdictObj.marketSuccessProbability, undefined);
});
