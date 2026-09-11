import { Fighter, FightContext, FightResult, WinProbability } from '../domain';
export type WorkerMessage = {
    type: 'RUN_SIMULATION';
    payload: {
        fighterA: Fighter;
        fighterB: Fighter;
        context: FightContext;
        seed: number;
    };
} | {
    type: 'RUN_BATCH';
    payload: {
        fighterA: Fighter;
        fighterB: Fighter;
        context: FightContext;
        count: number;
        baseSeed: number;
    };
} | {
    type: 'TERMINATE';
};
export type WorkerResponse = {
    type: 'SIMULATION_COMPLETE';
    payload: FightResult;
} | {
    type: 'BATCH_COMPLETE';
    payload: WinProbability;
} | {
    type: 'ERROR';
    payload: string;
} | {
    type: 'READY';
};
export {};
//# sourceMappingURL=worker.d.ts.map