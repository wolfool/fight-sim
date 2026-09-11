import { Fighter, FightContext, FightResult, WinProbability } from '../domain';
export interface SimulationWorker {
    postMessage(msg: any): void;
    terminate(): void;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: ((event: ErrorEvent) => void) | null;
}
export declare class WorkerManager {
    private workerCount;
    private workers;
    private pendingSimulations;
    private pendingBatch;
    private simulationIdCounter;
    private batchIdCounter;
    private nextWorkerIndex;
    constructor(workerCount?: number);
    initialize(): Promise<void>;
    private handleWorkerMessage;
    private handleWorkerError;
    runSimulation(fighterA: Fighter, fighterB: Fighter, context: FightContext, seed: number): Promise<FightResult>;
    runBatch(fighterA: Fighter, fighterB: Fighter, context: FightContext, count: number, baseSeed: number): Promise<WinProbability>;
    private getNextWorker;
    terminate(): void;
}
export declare function getWorkerManager(): WorkerManager;
export declare function initializeWorkers(): Promise<void>;
//# sourceMappingURL=worker-manager.d.ts.map