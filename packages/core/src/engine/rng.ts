import seedrandom from 'seedrandom';

export class Rng {
  private next: () => number;

  constructor(seed: number | string) {
    this.next = seedrandom(String(seed));
  }

  float(min = 0, max = 1): number {
    return min + (max - min) * this.next();
  }

  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1));
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(arr: readonly T[]): T {
    const i = Math.floor(this.next() * arr.length);
    return (arr[i] ?? arr[arr.length - 1]) as T;
  }

  weightedPick<T>(arr: readonly T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let roll = this.next() * total;
    for (let i = 0; i < arr.length; i++) {
      roll -= weights[i] ?? 0;
      if (roll <= 0) return arr[i] as T;
    }
    return arr[arr.length - 1] as T;
  }
}
