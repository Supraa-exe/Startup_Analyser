import fs from 'fs';
import path from 'path';
import { RunStateRecord, StrategyBattle } from '@/lib/domain/types';

export interface ArchiveStore {
  saveRun(run: RunStateRecord): Promise<void>;
  getRun(runId: string): Promise<RunStateRecord | null>;
  listRuns(): Promise<RunStateRecord[]>;
  saveBattle(battle: StrategyBattle): Promise<void>;
  getBattle(battleId: string): Promise<StrategyBattle | null>;
  listBattles(): Promise<StrategyBattle[]>;
}

export class LocalJsonArchiveStore implements ArchiveStore {
  private dataDir: string;
  private runsFile: string;
  private battlesFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), '.data');
    this.runsFile = path.join(this.dataDir, 'runs.json');
    this.battlesFile = path.join(this.dataDir, 'battles.json');
    this.ensureStorage();
  }

  private ensureStorage() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.runsFile)) {
      fs.writeFileSync(this.runsFile, JSON.stringify({}, null, 2), 'utf8');
    }
    if (!fs.existsSync(this.battlesFile)) {
      fs.writeFileSync(this.battlesFile, JSON.stringify({}, null, 2), 'utf8');
    }
  }

  async saveRun(run: RunStateRecord): Promise<void> {
    this.ensureStorage();
    const data = JSON.parse(fs.readFileSync(this.runsFile, 'utf8') || '{}');
    data[run.runId] = run;
    fs.writeFileSync(this.runsFile, JSON.stringify(data, null, 2), 'utf8');
  }

  async getRun(runId: string): Promise<RunStateRecord | null> {
    this.ensureStorage();
    const data = JSON.parse(fs.readFileSync(this.runsFile, 'utf8') || '{}');
    return data[runId] || null;
  }

  async listRuns(): Promise<RunStateRecord[]> {
    this.ensureStorage();
    const data = JSON.parse(fs.readFileSync(this.runsFile, 'utf8') || '{}');
    return Object.values(data);
  }

  async saveBattle(battle: StrategyBattle): Promise<void> {
    this.ensureStorage();
    const data = JSON.parse(fs.readFileSync(this.battlesFile, 'utf8') || '{}');
    data[battle.battleId] = battle;
    fs.writeFileSync(this.battlesFile, JSON.stringify(data, null, 2), 'utf8');
  }

  async getBattle(battleId: string): Promise<StrategyBattle | null> {
    this.ensureStorage();
    const data = JSON.parse(fs.readFileSync(this.battlesFile, 'utf8') || '{}');
    return data[battleId] || null;
  }

  async listBattles(): Promise<StrategyBattle[]> {
    this.ensureStorage();
    const data = JSON.parse(fs.readFileSync(this.battlesFile, 'utf8') || '{}');
    return Object.values(data);
  }
}

export const archiveStore: ArchiveStore = new LocalJsonArchiveStore();
