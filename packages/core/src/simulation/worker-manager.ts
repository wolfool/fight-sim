// ============================================
// Worker Manager for Monte Carlo simulations
// ============================================

import { Fighter, FightContext, FightResult, WinProbability } from '../domain';

export interface SimulationWorker {
  postMessage(msg: any): void;
  terminate(): void;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
}

interface PendingSimulation {
  resolve: (result: FightResult) => void;
  reject: (error: Error) => void;
}

interface PendingBatch {
  resolve: (result: WinProbability) => void;
  reject: (error: Error) => void;
}

export class WorkerManager {
  private workers: SimulationWorker[] = [];
  private pendingSimulations: Map<number, PendingSimulation> = new Map();
  private pendingBatch: PendingBatch | null = null;
  private simulationIdCounter = 0;
  private batchIdCounter = 0;
  private nextWorkerIndex = 0;
  
  constructor(private workerCount: number = navigator.hardwareConcurrency || 4) {}
  
  async initialize(): Promise<void> {
    // Dynamic import to avoid SSR issues
    const { createSimulationEngine } = await import('../engine');
    
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(
        new URL('../simulation/worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      worker.onmessage = (event) => this.handleWorkerMessage(event, worker);
      worker.onerror = (error) => this.handleWorkerError(error, worker);
      worker.postMessage({ type: 'INIT', payload: { engine: createSimulationEngine } });
      
      this.workers.push(worker);
      
      // Wait for ready signal
      await new Promise<void>((resolve) => {
        const handler = (event: MessageEvent) => {
          if (event.data.type === 'READY') {
            worker.onmessage = null; // Remove temporary handler
            worker.onmessage = (e) => this.handleWorkerMessage(e, worker);
            resolve();
          }
        };
        worker.onmessage = handler;
      });
    }
  }
  
  private handleWorkerMessage(event: MessageEvent, worker: SimulationWorker): void {
    const msg = event.data;
    
    if (msg.type === 'SIMULATION_COMPLETE') {
      const pending = this.pendingSimulations.get(msg.payload.simulationId);
      if (pending) {
        this.pendingSimulations.delete(msg.payload.simulationId);
        pending.resolve(msg.payload);
      }
    } else if (msg.type === 'BATCH_COMPLETE') {
      if (this.pendingBatch) {
        const pending = this.pendingBatch;
        this.pendingBatch = null;
        pending.resolve(msg.payload);
      }
    } else if (msg.type === 'ERROR') {
      // Handle errors for both single and batch
      const simPending = this.pendingSimulations.get(msg.payload.simulationId);
      if (simPending) {
        this.pendingSimulations.delete(msg.payload.simulationId);
        simPending.reject(new Error(msg.payload.error));
      } else if (this.pendingBatch) {
        const pending = this.pendingBatch;
        this.pendingBatch = null;
        pending.reject(new Error(msg.payload.error));
      }
    }
  }
  
  private handleWorkerError(error: ErrorEvent, worker: SimulationWorker): void {
    console.error('[WorkerManager] Worker error:', error);
    // Reject all pending on this worker
    for (const [id, pending] of this.pendingSimulations) {
      pending.reject(new Error(`Worker error: ${error.message}`));
    }
    this.pendingSimulations.clear();
    
    if (this.pendingBatch) {
      this.pendingBatch.reject(new Error(`Worker error: ${error.message}`));
      this.pendingBatch = null;
    }
  }
  
  async runSimulation(
    fighterA: Fighter,
    fighterB: Fighter,
    context: FightContext,
    seed: number
  ): Promise<FightResult> {
    const simulationId = ++this.simulationIdCounter;
    const worker = this.getNextWorker();
    
    return new Promise((resolve, reject) => {
      this.pendingSimulations.set(simulationId, { resolve, reject });
      
      worker.postMessage({
        type: 'RUN_SIMULATION',
        payload: { fighterA, fighterB, context, seed, simulationId }
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingSimulations.has(simulationId)) {
          this.pendingSimulations.delete(simulationId);
          reject(new Error('Simulation timeout'));
        }
      }, 30000);
    });
  }
  
  async runBatch(
    fighterA: Fighter,
    fighterB: Fighter,
    context: FightContext,
    count: number,
    baseSeed: number
  ): Promise<WinProbability> {
    if (this.pendingBatch) {
      throw new Error('Batch simulation already in progress');
    }
    
    const worker = this.getNextWorker();
    
    return new Promise((resolve, reject) => {
      this.pendingBatch = { resolve, reject };
      this.batchIdCounter++;
      
      worker.postMessage({
        type: 'RUN_BATCH',
        payload: { fighterA, fighterB, context, count, baseSeed, batchId: this.batchIdCounter }
      });
      
      // Timeout: 10 seconds per simulation * count
      setTimeout(() => {
        if (this.pendingBatch) {
          this.pendingBatch = null;
          reject(new Error('Batch simulation timeout'));
        }
      }, count * 10000);
    });
  }
  
  private getNextWorker(): SimulationWorker {
    const worker = this.workers[this.nextWorkerIndex];
    this.nextWorkerIndex = (this.nextWorkerIndex + 1) % this.workers.length;
    return worker;
  }
  
  terminate(): void {
    for (const worker of this.workers) {
      worker.postMessage({ type: 'TERMINATE' });
      worker.terminate();
    }
    this.workers = [];
    this.pendingSimulations.clear();
    this.pendingBatch = null;
  }
}

// Singleton instance
let workerManagerInstance: WorkerManager | null = null;

export function getWorkerManager(): WorkerManager {
  if (!workerManagerInstance) {
    workerManagerInstance = new WorkerManager();
  }
  return workerManagerInstance;
}

export async function initializeWorkers(): Promise<void> {
  const manager = getWorkerManager();
  await manager.initialize();
}

