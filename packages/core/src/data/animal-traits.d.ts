import { DetailedAnimalProfile, AnimalTraits, NaturalWeapon, NaturalArmor, Reference } from '../domain/types';
export declare const CHIMPANZEE: DetailedAnimalProfile;
export declare const GORILLA: DetailedAnimalProfile;
export declare const ORANGUTAN: DetailedAnimalProfile;
export declare const TIGER: DetailedAnimalProfile;
export declare const LION: DetailedAnimalProfile;
export declare const BROWN_BEAR: DetailedAnimalProfile;
export declare const GRIZZLY: DetailedAnimalProfile;
export declare const WOLF: DetailedAnimalProfile;
export declare const WILD_BOAR: DetailedAnimalProfile;
export declare const HUMAN_UNTRAINED: DetailedAnimalProfile;
export declare const ANIMAL_PRESETS: Record<string, DetailedAnimalProfile>;
import { Fighter, Technique } from '../domain/fighter';
export declare function animalToFighter(profile: DetailedAnimalProfile, overrides?: Partial<{
    name: string;
    techniques: Technique[];
}>): Fighter;
export type { DetailedAnimalProfile, AnimalTraits, NaturalWeapon, NaturalArmor, Reference };
//# sourceMappingURL=animal-traits.d.ts.map