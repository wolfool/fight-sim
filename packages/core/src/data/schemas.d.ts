import { z } from 'zod';
export declare const FightStateSchema: z.ZodEnum<["STANDING", "CLINCH", "GROUND_TOP", "GROUND_BOTTOM"]>;
export declare const ParsedBackgroundSchema: z.ZodObject<{
    primaryArt: z.ZodString;
    experienceMonths: z.ZodNumber;
    trainingFrequency: z.ZodNumber;
    gymEnvironment: z.ZodOptional<z.ZodString>;
    confidence: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    primaryArt?: string;
    experienceMonths?: number;
    trainingFrequency?: number;
    gymEnvironment?: string;
    confidence?: number;
}, {
    primaryArt?: string;
    experienceMonths?: number;
    trainingFrequency?: number;
    gymEnvironment?: string;
    confidence?: number;
}>;
export declare const UserProfileSchema: z.ZodObject<{
    height: z.ZodNumber;
    weight: z.ZodNumber;
    skeletalMuscleMass: z.ZodNumber;
    bodyFatMass: z.ZodNumber;
    age: z.ZodOptional<z.ZodNumber>;
    sex: z.ZodOptional<z.ZodEnum<["male", "female"]>>;
    martialArtsHistory: z.ZodString;
    homeGround: z.ZodEnum<["me", "opponent", "neutral"]>;
    deathAllowed: z.ZodBoolean;
    parsedBackground: z.ZodOptional<z.ZodObject<{
        primaryArt: z.ZodString;
        experienceMonths: z.ZodNumber;
        trainingFrequency: z.ZodNumber;
        gymEnvironment: z.ZodOptional<z.ZodString>;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        primaryArt?: string;
        experienceMonths?: number;
        trainingFrequency?: number;
        gymEnvironment?: string;
        confidence?: number;
    }, {
        primaryArt?: string;
        experienceMonths?: number;
        trainingFrequency?: number;
        gymEnvironment?: string;
        confidence?: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    height?: number;
    weight?: number;
    skeletalMuscleMass?: number;
    bodyFatMass?: number;
    age?: number;
    sex?: "male" | "female";
    martialArtsHistory?: string;
    homeGround?: "neutral" | "me" | "opponent";
    deathAllowed?: boolean;
    parsedBackground?: {
        primaryArt?: string;
        experienceMonths?: number;
        trainingFrequency?: number;
        gymEnvironment?: string;
        confidence?: number;
    };
}, {
    height?: number;
    weight?: number;
    skeletalMuscleMass?: number;
    bodyFatMass?: number;
    age?: number;
    sex?: "male" | "female";
    martialArtsHistory?: string;
    homeGround?: "neutral" | "me" | "opponent";
    deathAllowed?: boolean;
    parsedBackground?: {
        primaryArt?: string;
        experienceMonths?: number;
        trainingFrequency?: number;
        gymEnvironment?: string;
        confidence?: number;
    };
}>;
export declare const BodySegmentSchema: z.ZodObject<{
    id: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
    mass: z.ZodNumber;
    length: z.ZodNumber;
    crossSection: z.ZodNumber;
    boneDensity: z.ZodNumber;
    muscleThickness: z.ZodNumber;
    fatThickness: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    length?: number;
    id?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    mass?: number;
    crossSection?: number;
    boneDensity?: number;
    muscleThickness?: number;
    fatThickness?: number;
}, {
    length?: number;
    id?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    mass?: number;
    crossSection?: number;
    boneDensity?: number;
    muscleThickness?: number;
    fatThickness?: number;
}>;
export declare const TissueDurabilitySchema: z.ZodObject<{
    tensileStrength: z.ZodNumber;
    shearStrength: z.ZodNumber;
    compressiveStrength: z.ZodNumber;
    fractureEnergy: z.ZodNumber;
    thickness: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    tensileStrength?: number;
    shearStrength?: number;
    compressiveStrength?: number;
    fractureEnergy?: number;
    thickness?: number;
}, {
    tensileStrength?: number;
    shearStrength?: number;
    compressiveStrength?: number;
    fractureEnergy?: number;
    thickness?: number;
}>;
export declare const OrganDurabilitySchema: z.ZodObject<{
    organ: z.ZodEnum<["brain", "heart", "liver", "spleen", "kidney", "lung"]>;
    criticalPressure: z.ZodNumber;
    ruptureThreshold: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
    criticalPressure?: number;
    ruptureThreshold?: number;
}, {
    organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
    criticalPressure?: number;
    ruptureThreshold?: number;
}>;
export declare const PartDurabilitySchema: z.ZodObject<{
    skin: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    muscle: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    bone: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    nerve: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    vessel: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    organ: z.ZodOptional<z.ZodObject<{
        organ: z.ZodEnum<["brain", "heart", "liver", "spleen", "kidney", "lung"]>;
        criticalPressure: z.ZodNumber;
        ruptureThreshold: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    }, {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    }>>;
    functionalThresholds: z.ZodObject<{
        minorInjury: z.ZodNumber;
        moderateInjury: z.ZodNumber;
        severeInjury: z.ZodNumber;
        lossOfFunction: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    }, {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    organ?: {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    };
    skin?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    muscle?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    bone?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    nerve?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    vessel?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    functionalThresholds?: {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    };
}, {
    organ?: {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    };
    skin?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    muscle?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    bone?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    nerve?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    vessel?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    functionalThresholds?: {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    };
}>;
export declare const DurabilityProfileSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    skin: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    muscle: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    bone: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    nerve: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    vessel: z.ZodObject<{
        tensileStrength: z.ZodNumber;
        shearStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        fractureEnergy: z.ZodNumber;
        thickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }, {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    }>;
    organ: z.ZodOptional<z.ZodObject<{
        organ: z.ZodEnum<["brain", "heart", "liver", "spleen", "kidney", "lung"]>;
        criticalPressure: z.ZodNumber;
        ruptureThreshold: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    }, {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    }>>;
    functionalThresholds: z.ZodObject<{
        minorInjury: z.ZodNumber;
        moderateInjury: z.ZodNumber;
        severeInjury: z.ZodNumber;
        lossOfFunction: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    }, {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    organ?: {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    };
    skin?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    muscle?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    bone?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    nerve?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    vessel?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    functionalThresholds?: {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    };
}, {
    organ?: {
        organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
        criticalPressure?: number;
        ruptureThreshold?: number;
    };
    skin?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    muscle?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    bone?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    nerve?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    vessel?: {
        tensileStrength?: number;
        shearStrength?: number;
        compressiveStrength?: number;
        fractureEnergy?: number;
        thickness?: number;
    };
    functionalThresholds?: {
        minorInjury?: number;
        moderateInjury?: number;
        severeInjury?: number;
        lossOfFunction?: number;
    };
}>>;
export declare const BodySpecSchema: z.ZodObject<{
    height: z.ZodNumber;
    weight: z.ZodNumber;
    bmi: z.ZodNumber;
    skeletalMuscleMass: z.ZodNumber;
    bodyFatMass: z.ZodNumber;
    bodyFatPercent: z.ZodNumber;
    leanBodyMass: z.ZodNumber;
    segments: z.ZodArray<z.ZodObject<{
        id: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
        mass: z.ZodNumber;
        length: z.ZodNumber;
        crossSection: z.ZodNumber;
        boneDensity: z.ZodNumber;
        muscleThickness: z.ZodNumber;
        fatThickness: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        length?: number;
        id?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        mass?: number;
        crossSection?: number;
        boneDensity?: number;
        muscleThickness?: number;
        fatThickness?: number;
    }, {
        length?: number;
        id?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        mass?: number;
        crossSection?: number;
        boneDensity?: number;
        muscleThickness?: number;
        fatThickness?: number;
    }>, "many">;
    durability: z.ZodRecord<z.ZodString, z.ZodObject<{
        skin: z.ZodObject<{
            tensileStrength: z.ZodNumber;
            shearStrength: z.ZodNumber;
            compressiveStrength: z.ZodNumber;
            fractureEnergy: z.ZodNumber;
            thickness: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }>;
        muscle: z.ZodObject<{
            tensileStrength: z.ZodNumber;
            shearStrength: z.ZodNumber;
            compressiveStrength: z.ZodNumber;
            fractureEnergy: z.ZodNumber;
            thickness: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }>;
        bone: z.ZodObject<{
            tensileStrength: z.ZodNumber;
            shearStrength: z.ZodNumber;
            compressiveStrength: z.ZodNumber;
            fractureEnergy: z.ZodNumber;
            thickness: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }>;
        nerve: z.ZodObject<{
            tensileStrength: z.ZodNumber;
            shearStrength: z.ZodNumber;
            compressiveStrength: z.ZodNumber;
            fractureEnergy: z.ZodNumber;
            thickness: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }>;
        vessel: z.ZodObject<{
            tensileStrength: z.ZodNumber;
            shearStrength: z.ZodNumber;
            compressiveStrength: z.ZodNumber;
            fractureEnergy: z.ZodNumber;
            thickness: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }, {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        }>;
        organ: z.ZodOptional<z.ZodObject<{
            organ: z.ZodEnum<["brain", "heart", "liver", "spleen", "kidney", "lung"]>;
            criticalPressure: z.ZodNumber;
            ruptureThreshold: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
            criticalPressure?: number;
            ruptureThreshold?: number;
        }, {
            organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
            criticalPressure?: number;
            ruptureThreshold?: number;
        }>>;
        functionalThresholds: z.ZodObject<{
            minorInjury: z.ZodNumber;
            moderateInjury: z.ZodNumber;
            severeInjury: z.ZodNumber;
            lossOfFunction: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            minorInjury?: number;
            moderateInjury?: number;
            severeInjury?: number;
            lossOfFunction?: number;
        }, {
            minorInjury?: number;
            moderateInjury?: number;
            severeInjury?: number;
            lossOfFunction?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        organ?: {
            organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
            criticalPressure?: number;
            ruptureThreshold?: number;
        };
        skin?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        muscle?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        bone?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        nerve?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        vessel?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        functionalThresholds?: {
            minorInjury?: number;
            moderateInjury?: number;
            severeInjury?: number;
            lossOfFunction?: number;
        };
    }, {
        organ?: {
            organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
            criticalPressure?: number;
            ruptureThreshold?: number;
        };
        skin?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        muscle?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        bone?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        nerve?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        vessel?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        functionalThresholds?: {
            minorInjury?: number;
            moderateInjury?: number;
            severeInjury?: number;
            lossOfFunction?: number;
        };
    }>>;
}, "strip", z.ZodTypeAny, {
    height?: number;
    segments?: {
        length?: number;
        id?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        mass?: number;
        crossSection?: number;
        boneDensity?: number;
        muscleThickness?: number;
        fatThickness?: number;
    }[];
    weight?: number;
    skeletalMuscleMass?: number;
    bodyFatMass?: number;
    bmi?: number;
    bodyFatPercent?: number;
    leanBodyMass?: number;
    durability?: Record<string, {
        organ?: {
            organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
            criticalPressure?: number;
            ruptureThreshold?: number;
        };
        skin?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        muscle?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        bone?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        nerve?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        vessel?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        functionalThresholds?: {
            minorInjury?: number;
            moderateInjury?: number;
            severeInjury?: number;
            lossOfFunction?: number;
        };
    }>;
}, {
    height?: number;
    segments?: {
        length?: number;
        id?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        mass?: number;
        crossSection?: number;
        boneDensity?: number;
        muscleThickness?: number;
        fatThickness?: number;
    }[];
    weight?: number;
    skeletalMuscleMass?: number;
    bodyFatMass?: number;
    bmi?: number;
    bodyFatPercent?: number;
    leanBodyMass?: number;
    durability?: Record<string, {
        organ?: {
            organ?: "brain" | "heart" | "liver" | "spleen" | "kidney" | "lung";
            criticalPressure?: number;
            ruptureThreshold?: number;
        };
        skin?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        muscle?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        bone?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        nerve?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        vessel?: {
            tensileStrength?: number;
            shearStrength?: number;
            compressiveStrength?: number;
            fractureEnergy?: number;
            thickness?: number;
        };
        functionalThresholds?: {
            minorInjury?: number;
            moderateInjury?: number;
            severeInjury?: number;
            lossOfFunction?: number;
        };
    }>;
}>;
export declare const CoreStatsSchema: z.ZodObject<{
    strength: z.ZodNumber;
    speed: z.ZodNumber;
    endurance: z.ZodNumber;
    agility: z.ZodNumber;
    technique: z.ZodNumber;
    durability: z.ZodNumber;
    intelligence: z.ZodNumber;
    composure: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    strength?: number;
    speed?: number;
    technique?: number;
    durability?: number;
    endurance?: number;
    agility?: number;
    intelligence?: number;
    composure?: number;
}, {
    strength?: number;
    speed?: number;
    technique?: number;
    durability?: number;
    endurance?: number;
    agility?: number;
    intelligence?: number;
    composure?: number;
}>;
export declare const MentalitySchema: z.ZodObject<{
    killIntent: z.ZodNumber;
    fearLevel: z.ZodNumber;
    aggression: z.ZodNumber;
    painTolerance: z.ZodNumber;
    surrenderThreshold: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    killIntent?: number;
    fearLevel?: number;
    aggression?: number;
    painTolerance?: number;
    surrenderThreshold?: number;
}, {
    killIntent?: number;
    fearLevel?: number;
    aggression?: number;
    painTolerance?: number;
    surrenderThreshold?: number;
}>;
export declare const InjurySchema: z.ZodObject<{
    id: z.ZodString;
    partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
    type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
    severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
    functionalLoss: z.ZodNumber;
    timestamp: z.ZodNumber;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
    id?: string;
    timestamp?: number;
    description?: string;
    partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    severity?: "minor" | "moderate" | "severe" | "critical";
    functionalLoss?: number;
}, {
    type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
    id?: string;
    timestamp?: number;
    description?: string;
    partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    severity?: "minor" | "moderate" | "severe" | "critical";
    functionalLoss?: number;
}>;
export declare const ConditionSchema: z.ZodObject<{
    fatigue: z.ZodNumber;
    injury: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
        type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
        severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
        functionalLoss: z.ZodNumber;
        timestamp: z.ZodNumber;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }, {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }>, "many">;
    adrenaline: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    fatigue?: number;
    injury?: {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }[];
    adrenaline?: number;
}, {
    fatigue?: number;
    injury?: {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }[];
    adrenaline?: number;
}>;
export declare const BiomechanicsDataSchema: z.ZodObject<{
    windupTime: z.ZodNumber;
    windupForce: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        magnitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x?: number;
        y?: number;
        magnitude?: number;
    }, {
        x?: number;
        y?: number;
        magnitude?: number;
    }>;
    executionTime: z.ZodNumber;
    peakForce: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        magnitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x?: number;
        y?: number;
        magnitude?: number;
    }, {
        x?: number;
        y?: number;
        magnitude?: number;
    }>;
    peakVelocity: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        magnitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x?: number;
        y?: number;
        magnitude?: number;
    }, {
        x?: number;
        y?: number;
        magnitude?: number;
    }>;
    impulse: z.ZodNumber;
    contactArea: z.ZodNumber;
    pressure: z.ZodNumber;
    trajectory: z.ZodArray<z.ZodObject<{
        t: z.ZodNumber;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>;
        velocity: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        position?: {
            x?: number;
            y?: number;
        };
        t?: number;
        velocity?: {
            x?: number;
            y?: number;
        };
    }, {
        position?: {
            x?: number;
            y?: number;
        };
        t?: number;
        velocity?: {
            x?: number;
            y?: number;
        };
    }>, "many">;
    jointAngles: z.ZodArray<z.ZodObject<{
        joint: z.ZodString;
        angle: z.ZodNumber;
        angularVelocity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        angle?: number;
        joint?: string;
        angularVelocity?: number;
    }, {
        angle?: number;
        joint?: string;
        angularVelocity?: number;
    }>, "many">;
    energyCost: z.ZodNumber;
    metabolicCost: z.ZodNumber;
    balanceDisruption: z.ZodNumber;
    recoveryTime: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    pressure?: number;
    windupTime?: number;
    windupForce?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    executionTime?: number;
    peakForce?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    peakVelocity?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    impulse?: number;
    contactArea?: number;
    trajectory?: {
        position?: {
            x?: number;
            y?: number;
        };
        t?: number;
        velocity?: {
            x?: number;
            y?: number;
        };
    }[];
    jointAngles?: {
        angle?: number;
        joint?: string;
        angularVelocity?: number;
    }[];
    energyCost?: number;
    metabolicCost?: number;
    balanceDisruption?: number;
    recoveryTime?: number;
}, {
    pressure?: number;
    windupTime?: number;
    windupForce?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    executionTime?: number;
    peakForce?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    peakVelocity?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    impulse?: number;
    contactArea?: number;
    trajectory?: {
        position?: {
            x?: number;
            y?: number;
        };
        t?: number;
        velocity?: {
            x?: number;
            y?: number;
        };
    }[];
    jointAngles?: {
        angle?: number;
        joint?: string;
        angularVelocity?: number;
    }[];
    energyCost?: number;
    metabolicCost?: number;
    balanceDisruption?: number;
    recoveryTime?: number;
}>;
export declare const TechniqueRequirementsSchema: z.ZodObject<{
    minStats: z.ZodObject<{
        strength: z.ZodOptional<z.ZodNumber>;
        speed: z.ZodOptional<z.ZodNumber>;
        endurance: z.ZodOptional<z.ZodNumber>;
        agility: z.ZodOptional<z.ZodNumber>;
        technique: z.ZodOptional<z.ZodNumber>;
        durability: z.ZodOptional<z.ZodNumber>;
        intelligence: z.ZodOptional<z.ZodNumber>;
        composure: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        strength?: number;
        speed?: number;
        technique?: number;
        durability?: number;
        endurance?: number;
        agility?: number;
        intelligence?: number;
        composure?: number;
    }, {
        strength?: number;
        speed?: number;
        technique?: number;
        durability?: number;
        endurance?: number;
        agility?: number;
        intelligence?: number;
        composure?: number;
    }>;
    staminaCost: z.ZodNumber;
    requiredDistance: z.ZodEffects<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        max?: number;
        min?: number;
    }, {
        max?: number;
        min?: number;
    }>, {
        max?: number;
        min?: number;
    }, {
        max?: number;
        min?: number;
    }>;
    allowedStances: z.ZodArray<z.ZodEnum<["orthodox", "southpaw", "muaythai", "wrestling", "bjj", "open"]>, "many">;
    counters: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    minStats?: {
        strength?: number;
        speed?: number;
        technique?: number;
        durability?: number;
        endurance?: number;
        agility?: number;
        intelligence?: number;
        composure?: number;
    };
    staminaCost?: number;
    requiredDistance?: {
        max?: number;
        min?: number;
    };
    allowedStances?: ("open" | "orthodox" | "southpaw" | "muaythai" | "wrestling" | "bjj")[];
    counters?: string[];
}, {
    minStats?: {
        strength?: number;
        speed?: number;
        technique?: number;
        durability?: number;
        endurance?: number;
        agility?: number;
        intelligence?: number;
        composure?: number;
    };
    staminaCost?: number;
    requiredDistance?: {
        max?: number;
        min?: number;
    };
    allowedStances?: ("open" | "orthodox" | "southpaw" | "muaythai" | "wrestling" | "bjj")[];
    counters?: string[];
}>;
export declare const DamageProfileSchema: z.ZodObject<{
    baseDamage: z.ZodNumber;
    scaling: z.ZodObject<{
        strength: z.ZodNumber;
        speed: z.ZodNumber;
        technique: z.ZodNumber;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        strength: z.ZodNumber;
        speed: z.ZodNumber;
        technique: z.ZodNumber;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        strength: z.ZodNumber;
        speed: z.ZodNumber;
        technique: z.ZodNumber;
    }, z.ZodTypeAny, "passthrough">>;
    targetParts: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
    damageType: z.ZodEnum<["blunt", "sharp", "piercing", "crushing"]>;
}, "strip", z.ZodTypeAny, {
    baseDamage?: number;
    scaling?: {
        strength?: number;
        speed?: number;
        technique?: number;
    } & {
        [k: string]: unknown;
    };
    targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    damageType?: "blunt" | "sharp" | "piercing" | "crushing";
}, {
    baseDamage?: number;
    scaling?: {
        strength?: number;
        speed?: number;
        technique?: number;
    } & {
        [k: string]: unknown;
    };
    targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    damageType?: "blunt" | "sharp" | "piercing" | "crushing";
}>;
export declare const KnockbackProfileSchema: z.ZodObject<{
    force: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        magnitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x?: number;
        y?: number;
        magnitude?: number;
    }, {
        x?: number;
        y?: number;
        magnitude?: number;
    }>;
    torque: z.ZodNumber;
    duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    duration?: number;
    force?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    torque?: number;
}, {
    duration?: number;
    force?: {
        x?: number;
        y?: number;
        magnitude?: number;
    };
    torque?: number;
}>;
export declare const StunProfileSchema: z.ZodObject<{
    duration: z.ZodNumber;
    intensity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    duration?: number;
    intensity?: number;
}, {
    duration?: number;
    intensity?: number;
}>;
export declare const BleedProfileSchema: z.ZodObject<{
    rate: z.ZodNumber;
    duration: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    duration?: number;
    rate?: number;
}, {
    duration?: number;
    rate?: number;
}>;
export declare const FractureProfileSchema: z.ZodObject<{
    probability: z.ZodNumber;
    bones: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
}, "strip", z.ZodTypeAny, {
    probability?: number;
    bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
}, {
    probability?: number;
    bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
}>;
export declare const ConcussionProfileSchema: z.ZodObject<{
    probability: z.ZodNumber;
    severity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    severity?: number;
    probability?: number;
}, {
    severity?: number;
    probability?: number;
}>;
export declare const PsychProfileSchema: z.ZodObject<{
    fearInduced: z.ZodNumber;
    intimidation: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    fearInduced?: number;
    intimidation?: number;
}, {
    fearInduced?: number;
    intimidation?: number;
}>;
export declare const TechniqueEffectsSchema: z.ZodObject<{
    damage: z.ZodObject<{
        baseDamage: z.ZodNumber;
        scaling: z.ZodObject<{
            strength: z.ZodNumber;
            speed: z.ZodNumber;
            technique: z.ZodNumber;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            strength: z.ZodNumber;
            speed: z.ZodNumber;
            technique: z.ZodNumber;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            strength: z.ZodNumber;
            speed: z.ZodNumber;
            technique: z.ZodNumber;
        }, z.ZodTypeAny, "passthrough">>;
        targetParts: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
        damageType: z.ZodEnum<["blunt", "sharp", "piercing", "crushing"]>;
    }, "strip", z.ZodTypeAny, {
        baseDamage?: number;
        scaling?: {
            strength?: number;
            speed?: number;
            technique?: number;
        } & {
            [k: string]: unknown;
        };
        targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        damageType?: "blunt" | "sharp" | "piercing" | "crushing";
    }, {
        baseDamage?: number;
        scaling?: {
            strength?: number;
            speed?: number;
            technique?: number;
        } & {
            [k: string]: unknown;
        };
        targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        damageType?: "blunt" | "sharp" | "piercing" | "crushing";
    }>;
    knockback: z.ZodObject<{
        force: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            magnitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
            magnitude?: number;
        }, {
            x?: number;
            y?: number;
            magnitude?: number;
        }>;
        torque: z.ZodNumber;
        duration: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        duration?: number;
        force?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        torque?: number;
    }, {
        duration?: number;
        force?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        torque?: number;
    }>;
    stun: z.ZodObject<{
        duration: z.ZodNumber;
        intensity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        duration?: number;
        intensity?: number;
    }, {
        duration?: number;
        intensity?: number;
    }>;
    bleed: z.ZodObject<{
        rate: z.ZodNumber;
        duration: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        duration?: number;
        rate?: number;
    }, {
        duration?: number;
        rate?: number;
    }>;
    fracture: z.ZodObject<{
        probability: z.ZodNumber;
        bones: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        probability?: number;
        bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    }, {
        probability?: number;
        bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    }>;
    concussion: z.ZodObject<{
        probability: z.ZodNumber;
        severity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        severity?: number;
        probability?: number;
    }, {
        severity?: number;
        probability?: number;
    }>;
    psychological: z.ZodObject<{
        fearInduced: z.ZodNumber;
        intimidation: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        fearInduced?: number;
        intimidation?: number;
    }, {
        fearInduced?: number;
        intimidation?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    fracture?: {
        probability?: number;
        bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    };
    concussion?: {
        severity?: number;
        probability?: number;
    };
    damage?: {
        baseDamage?: number;
        scaling?: {
            strength?: number;
            speed?: number;
            technique?: number;
        } & {
            [k: string]: unknown;
        };
        targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        damageType?: "blunt" | "sharp" | "piercing" | "crushing";
    };
    knockback?: {
        duration?: number;
        force?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        torque?: number;
    };
    stun?: {
        duration?: number;
        intensity?: number;
    };
    bleed?: {
        duration?: number;
        rate?: number;
    };
    psychological?: {
        fearInduced?: number;
        intimidation?: number;
    };
}, {
    fracture?: {
        probability?: number;
        bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    };
    concussion?: {
        severity?: number;
        probability?: number;
    };
    damage?: {
        baseDamage?: number;
        scaling?: {
            strength?: number;
            speed?: number;
            technique?: number;
        } & {
            [k: string]: unknown;
        };
        targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        damageType?: "blunt" | "sharp" | "piercing" | "crushing";
    };
    knockback?: {
        duration?: number;
        force?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        torque?: number;
    };
    stun?: {
        duration?: number;
        intensity?: number;
    };
    bleed?: {
        duration?: number;
        rate?: number;
    };
    psychological?: {
        fearInduced?: number;
        intimidation?: number;
    };
}>;
export declare const AIWeightSchema: z.ZodObject<{
    offensive: z.ZodNumber;
    defensive: z.ZodNumber;
    counter: z.ZodNumber;
    setup: z.ZodNumber;
    finisher: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    counter?: number;
    offensive?: number;
    defensive?: number;
    setup?: number;
    finisher?: number;
}, {
    counter?: number;
    offensive?: number;
    defensive?: number;
    setup?: number;
    finisher?: number;
}>;
export declare const TechniqueSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    aliases: z.ZodArray<z.ZodString, "many">;
    category: z.ZodEnum<["strike_punch", "strike_kick", "strike_elbow", "strike_knee", "strike_headbutt", "grapple_takedown", "grapple_throw", "grapple_clinch", "grapple_choke", "grapple_joint", "grapple_ground", "grapple_sweep", "defense_block", "defense_parry", "defense_dodge", "defense_slip", "defense_weave", "defense_sprawl", "special_feint", "special_combo", "special_counter"]>;
    biomechanics: z.ZodObject<{
        windupTime: z.ZodNumber;
        windupForce: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            magnitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
            magnitude?: number;
        }, {
            x?: number;
            y?: number;
            magnitude?: number;
        }>;
        executionTime: z.ZodNumber;
        peakForce: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            magnitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
            magnitude?: number;
        }, {
            x?: number;
            y?: number;
            magnitude?: number;
        }>;
        peakVelocity: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            magnitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
            magnitude?: number;
        }, {
            x?: number;
            y?: number;
            magnitude?: number;
        }>;
        impulse: z.ZodNumber;
        contactArea: z.ZodNumber;
        pressure: z.ZodNumber;
        trajectory: z.ZodArray<z.ZodObject<{
            t: z.ZodNumber;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x?: number;
                y?: number;
            }, {
                x?: number;
                y?: number;
            }>;
            velocity: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x?: number;
                y?: number;
            }, {
                x?: number;
                y?: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            position?: {
                x?: number;
                y?: number;
            };
            t?: number;
            velocity?: {
                x?: number;
                y?: number;
            };
        }, {
            position?: {
                x?: number;
                y?: number;
            };
            t?: number;
            velocity?: {
                x?: number;
                y?: number;
            };
        }>, "many">;
        jointAngles: z.ZodArray<z.ZodObject<{
            joint: z.ZodString;
            angle: z.ZodNumber;
            angularVelocity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            angle?: number;
            joint?: string;
            angularVelocity?: number;
        }, {
            angle?: number;
            joint?: string;
            angularVelocity?: number;
        }>, "many">;
        energyCost: z.ZodNumber;
        metabolicCost: z.ZodNumber;
        balanceDisruption: z.ZodNumber;
        recoveryTime: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        pressure?: number;
        windupTime?: number;
        windupForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        executionTime?: number;
        peakForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        peakVelocity?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        impulse?: number;
        contactArea?: number;
        trajectory?: {
            position?: {
                x?: number;
                y?: number;
            };
            t?: number;
            velocity?: {
                x?: number;
                y?: number;
            };
        }[];
        jointAngles?: {
            angle?: number;
            joint?: string;
            angularVelocity?: number;
        }[];
        energyCost?: number;
        metabolicCost?: number;
        balanceDisruption?: number;
        recoveryTime?: number;
    }, {
        pressure?: number;
        windupTime?: number;
        windupForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        executionTime?: number;
        peakForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        peakVelocity?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        impulse?: number;
        contactArea?: number;
        trajectory?: {
            position?: {
                x?: number;
                y?: number;
            };
            t?: number;
            velocity?: {
                x?: number;
                y?: number;
            };
        }[];
        jointAngles?: {
            angle?: number;
            joint?: string;
            angularVelocity?: number;
        }[];
        energyCost?: number;
        metabolicCost?: number;
        balanceDisruption?: number;
        recoveryTime?: number;
    }>;
    requirements: z.ZodObject<{
        minStats: z.ZodObject<{
            strength: z.ZodOptional<z.ZodNumber>;
            speed: z.ZodOptional<z.ZodNumber>;
            endurance: z.ZodOptional<z.ZodNumber>;
            agility: z.ZodOptional<z.ZodNumber>;
            technique: z.ZodOptional<z.ZodNumber>;
            durability: z.ZodOptional<z.ZodNumber>;
            intelligence: z.ZodOptional<z.ZodNumber>;
            composure: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            strength?: number;
            speed?: number;
            technique?: number;
            durability?: number;
            endurance?: number;
            agility?: number;
            intelligence?: number;
            composure?: number;
        }, {
            strength?: number;
            speed?: number;
            technique?: number;
            durability?: number;
            endurance?: number;
            agility?: number;
            intelligence?: number;
            composure?: number;
        }>;
        staminaCost: z.ZodNumber;
        requiredDistance: z.ZodEffects<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            max?: number;
            min?: number;
        }, {
            max?: number;
            min?: number;
        }>, {
            max?: number;
            min?: number;
        }, {
            max?: number;
            min?: number;
        }>;
        allowedStances: z.ZodArray<z.ZodEnum<["orthodox", "southpaw", "muaythai", "wrestling", "bjj", "open"]>, "many">;
        counters: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        minStats?: {
            strength?: number;
            speed?: number;
            technique?: number;
            durability?: number;
            endurance?: number;
            agility?: number;
            intelligence?: number;
            composure?: number;
        };
        staminaCost?: number;
        requiredDistance?: {
            max?: number;
            min?: number;
        };
        allowedStances?: ("open" | "orthodox" | "southpaw" | "muaythai" | "wrestling" | "bjj")[];
        counters?: string[];
    }, {
        minStats?: {
            strength?: number;
            speed?: number;
            technique?: number;
            durability?: number;
            endurance?: number;
            agility?: number;
            intelligence?: number;
            composure?: number;
        };
        staminaCost?: number;
        requiredDistance?: {
            max?: number;
            min?: number;
        };
        allowedStances?: ("open" | "orthodox" | "southpaw" | "muaythai" | "wrestling" | "bjj")[];
        counters?: string[];
    }>;
    effects: z.ZodObject<{
        damage: z.ZodObject<{
            baseDamage: z.ZodNumber;
            scaling: z.ZodObject<{
                strength: z.ZodNumber;
                speed: z.ZodNumber;
                technique: z.ZodNumber;
            }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
                strength: z.ZodNumber;
                speed: z.ZodNumber;
                technique: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
                strength: z.ZodNumber;
                speed: z.ZodNumber;
                technique: z.ZodNumber;
            }, z.ZodTypeAny, "passthrough">>;
            targetParts: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
            damageType: z.ZodEnum<["blunt", "sharp", "piercing", "crushing"]>;
        }, "strip", z.ZodTypeAny, {
            baseDamage?: number;
            scaling?: {
                strength?: number;
                speed?: number;
                technique?: number;
            } & {
                [k: string]: unknown;
            };
            targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            damageType?: "blunt" | "sharp" | "piercing" | "crushing";
        }, {
            baseDamage?: number;
            scaling?: {
                strength?: number;
                speed?: number;
                technique?: number;
            } & {
                [k: string]: unknown;
            };
            targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            damageType?: "blunt" | "sharp" | "piercing" | "crushing";
        }>;
        knockback: z.ZodObject<{
            force: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                magnitude: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x?: number;
                y?: number;
                magnitude?: number;
            }, {
                x?: number;
                y?: number;
                magnitude?: number;
            }>;
            torque: z.ZodNumber;
            duration: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            duration?: number;
            force?: {
                x?: number;
                y?: number;
                magnitude?: number;
            };
            torque?: number;
        }, {
            duration?: number;
            force?: {
                x?: number;
                y?: number;
                magnitude?: number;
            };
            torque?: number;
        }>;
        stun: z.ZodObject<{
            duration: z.ZodNumber;
            intensity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            duration?: number;
            intensity?: number;
        }, {
            duration?: number;
            intensity?: number;
        }>;
        bleed: z.ZodObject<{
            rate: z.ZodNumber;
            duration: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            duration?: number;
            rate?: number;
        }, {
            duration?: number;
            rate?: number;
        }>;
        fracture: z.ZodObject<{
            probability: z.ZodNumber;
            bones: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
        }, "strip", z.ZodTypeAny, {
            probability?: number;
            bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        }, {
            probability?: number;
            bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        }>;
        concussion: z.ZodObject<{
            probability: z.ZodNumber;
            severity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            severity?: number;
            probability?: number;
        }, {
            severity?: number;
            probability?: number;
        }>;
        psychological: z.ZodObject<{
            fearInduced: z.ZodNumber;
            intimidation: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            fearInduced?: number;
            intimidation?: number;
        }, {
            fearInduced?: number;
            intimidation?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        fracture?: {
            probability?: number;
            bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        };
        concussion?: {
            severity?: number;
            probability?: number;
        };
        damage?: {
            baseDamage?: number;
            scaling?: {
                strength?: number;
                speed?: number;
                technique?: number;
            } & {
                [k: string]: unknown;
            };
            targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            damageType?: "blunt" | "sharp" | "piercing" | "crushing";
        };
        knockback?: {
            duration?: number;
            force?: {
                x?: number;
                y?: number;
                magnitude?: number;
            };
            torque?: number;
        };
        stun?: {
            duration?: number;
            intensity?: number;
        };
        bleed?: {
            duration?: number;
            rate?: number;
        };
        psychological?: {
            fearInduced?: number;
            intimidation?: number;
        };
    }, {
        fracture?: {
            probability?: number;
            bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        };
        concussion?: {
            severity?: number;
            probability?: number;
        };
        damage?: {
            baseDamage?: number;
            scaling?: {
                strength?: number;
                speed?: number;
                technique?: number;
            } & {
                [k: string]: unknown;
            };
            targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            damageType?: "blunt" | "sharp" | "piercing" | "crushing";
        };
        knockback?: {
            duration?: number;
            force?: {
                x?: number;
                y?: number;
                magnitude?: number;
            };
            torque?: number;
        };
        stun?: {
            duration?: number;
            intensity?: number;
        };
        bleed?: {
            duration?: number;
            rate?: number;
        };
        psychological?: {
            fearInduced?: number;
            intimidation?: number;
        };
    }>;
    aiWeight: z.ZodObject<{
        offensive: z.ZodNumber;
        defensive: z.ZodNumber;
        counter: z.ZodNumber;
        setup: z.ZodNumber;
        finisher: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        counter?: number;
        offensive?: number;
        defensive?: number;
        setup?: number;
        finisher?: number;
    }, {
        counter?: number;
        offensive?: number;
        defensive?: number;
        setup?: number;
        finisher?: number;
    }>;
    source: z.ZodObject<{
        dataset: z.ZodString;
        study: z.ZodOptional<z.ZodString>;
        confidence: z.ZodNumber;
        sampleSize: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        dataset?: string;
        confidence?: number;
        study?: string;
        sampleSize?: number;
    }, {
        dataset?: string;
        confidence?: number;
        study?: string;
        sampleSize?: number;
    }>;
    version: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name?: string;
    id?: string;
    source?: {
        dataset?: string;
        confidence?: number;
        study?: string;
        sampleSize?: number;
    };
    version?: number;
    aliases?: string[];
    category?: "strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter";
    biomechanics?: {
        pressure?: number;
        windupTime?: number;
        windupForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        executionTime?: number;
        peakForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        peakVelocity?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        impulse?: number;
        contactArea?: number;
        trajectory?: {
            position?: {
                x?: number;
                y?: number;
            };
            t?: number;
            velocity?: {
                x?: number;
                y?: number;
            };
        }[];
        jointAngles?: {
            angle?: number;
            joint?: string;
            angularVelocity?: number;
        }[];
        energyCost?: number;
        metabolicCost?: number;
        balanceDisruption?: number;
        recoveryTime?: number;
    };
    requirements?: {
        minStats?: {
            strength?: number;
            speed?: number;
            technique?: number;
            durability?: number;
            endurance?: number;
            agility?: number;
            intelligence?: number;
            composure?: number;
        };
        staminaCost?: number;
        requiredDistance?: {
            max?: number;
            min?: number;
        };
        allowedStances?: ("open" | "orthodox" | "southpaw" | "muaythai" | "wrestling" | "bjj")[];
        counters?: string[];
    };
    effects?: {
        fracture?: {
            probability?: number;
            bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        };
        concussion?: {
            severity?: number;
            probability?: number;
        };
        damage?: {
            baseDamage?: number;
            scaling?: {
                strength?: number;
                speed?: number;
                technique?: number;
            } & {
                [k: string]: unknown;
            };
            targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            damageType?: "blunt" | "sharp" | "piercing" | "crushing";
        };
        knockback?: {
            duration?: number;
            force?: {
                x?: number;
                y?: number;
                magnitude?: number;
            };
            torque?: number;
        };
        stun?: {
            duration?: number;
            intensity?: number;
        };
        bleed?: {
            duration?: number;
            rate?: number;
        };
        psychological?: {
            fearInduced?: number;
            intimidation?: number;
        };
    };
    aiWeight?: {
        counter?: number;
        offensive?: number;
        defensive?: number;
        setup?: number;
        finisher?: number;
    };
    createdAt?: string;
    updatedAt?: string;
}, {
    name?: string;
    id?: string;
    source?: {
        dataset?: string;
        confidence?: number;
        study?: string;
        sampleSize?: number;
    };
    version?: number;
    aliases?: string[];
    category?: "strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter";
    biomechanics?: {
        pressure?: number;
        windupTime?: number;
        windupForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        executionTime?: number;
        peakForce?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        peakVelocity?: {
            x?: number;
            y?: number;
            magnitude?: number;
        };
        impulse?: number;
        contactArea?: number;
        trajectory?: {
            position?: {
                x?: number;
                y?: number;
            };
            t?: number;
            velocity?: {
                x?: number;
                y?: number;
            };
        }[];
        jointAngles?: {
            angle?: number;
            joint?: string;
            angularVelocity?: number;
        }[];
        energyCost?: number;
        metabolicCost?: number;
        balanceDisruption?: number;
        recoveryTime?: number;
    };
    requirements?: {
        minStats?: {
            strength?: number;
            speed?: number;
            technique?: number;
            durability?: number;
            endurance?: number;
            agility?: number;
            intelligence?: number;
            composure?: number;
        };
        staminaCost?: number;
        requiredDistance?: {
            max?: number;
            min?: number;
        };
        allowedStances?: ("open" | "orthodox" | "southpaw" | "muaythai" | "wrestling" | "bjj")[];
        counters?: string[];
    };
    effects?: {
        fracture?: {
            probability?: number;
            bones?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        };
        concussion?: {
            severity?: number;
            probability?: number;
        };
        damage?: {
            baseDamage?: number;
            scaling?: {
                strength?: number;
                speed?: number;
                technique?: number;
            } & {
                [k: string]: unknown;
            };
            targetParts?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            damageType?: "blunt" | "sharp" | "piercing" | "crushing";
        };
        knockback?: {
            duration?: number;
            force?: {
                x?: number;
                y?: number;
                magnitude?: number;
            };
            torque?: number;
        };
        stun?: {
            duration?: number;
            intensity?: number;
        };
        bleed?: {
            duration?: number;
            rate?: number;
        };
        psychological?: {
            fearInduced?: number;
            intimidation?: number;
        };
    };
    aiWeight?: {
        counter?: number;
        offensive?: number;
        defensive?: number;
        setup?: number;
        finisher?: number;
    };
    createdAt?: string;
    updatedAt?: string;
}>;
export declare const NaturalWeaponSchema: z.ZodObject<{
    type: z.ZodEnum<["bite", "claw", "horn", "tusk", "body_slam", "kick", "stomp"]>;
    name: z.ZodString;
    peakForce: z.ZodNumber;
    peakForceSource: z.ZodEnum<["measured", "estimated", "inferred"]>;
    peakForceConfidence: z.ZodNumber;
    contactArea: z.ZodNumber;
    damageType: z.ZodEnum<["piercing", "slashing", "blunt", "crushing"]>;
    reach: z.ZodNumber;
    usableStates: z.ZodArray<z.ZodEnum<["STANDING", "CLINCH", "GROUND_TOP", "GROUND_BOTTOM"]>, "many">;
}, "strip", z.ZodTypeAny, {
    name?: string;
    type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
    peakForce?: number;
    contactArea?: number;
    damageType?: "blunt" | "piercing" | "crushing" | "slashing";
    peakForceSource?: "measured" | "estimated" | "inferred";
    peakForceConfidence?: number;
    reach?: number;
    usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
}, {
    name?: string;
    type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
    peakForce?: number;
    contactArea?: number;
    damageType?: "blunt" | "piercing" | "crushing" | "slashing";
    peakForceSource?: "measured" | "estimated" | "inferred";
    peakForceConfidence?: number;
    reach?: number;
    usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
}>;
export declare const NaturalArmorSchema: z.ZodObject<{
    type: z.ZodEnum<["thick_skin", "fat_layer", "bone_plate", "fur", "scales"]>;
    location: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
    thickness: z.ZodNumber;
    tensileStrength: z.ZodNumber;
    compressiveStrength: z.ZodNumber;
    coverage: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
    location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    tensileStrength?: number;
    compressiveStrength?: number;
    thickness?: number;
    coverage?: number;
}, {
    type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
    location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    tensileStrength?: number;
    compressiveStrength?: number;
    thickness?: number;
    coverage?: number;
}>;
export declare const ReferenceSchema: z.ZodObject<{
    type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
    title: z.ZodString;
    authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    year: z.ZodNumber;
    url: z.ZodOptional<z.ZodString>;
    doi: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type?: "paper" | "database" | "observation" | "expert";
    url?: string;
    title?: string;
    year?: number;
    authors?: string[];
    doi?: string;
    notes?: string;
}, {
    type?: "paper" | "database" | "observation" | "expert";
    url?: string;
    title?: string;
    year?: number;
    authors?: string[];
    doi?: string;
    notes?: string;
}>;
export declare const AnimalTraitsSchema: z.ZodObject<{
    aggression: z.ZodNumber;
    territoriality: z.ZodNumber;
    flightiness: z.ZodNumber;
    intelligence: z.ZodNumber;
    sociality: z.ZodNumber;
    huntingStyle: z.ZodEnum<["ambush", "chase", "grapple", "bite", "strike", "pack"]>;
    preferredRange: z.ZodEnum<["close", "mid", "long"]>;
    killMethod: z.ZodEnum<["suffocation", "exsanguination", "crushing", "neck_break", "overwhelm"]>;
    naturalWeapons: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["bite", "claw", "horn", "tusk", "body_slam", "kick", "stomp"]>;
        name: z.ZodString;
        peakForce: z.ZodNumber;
        peakForceSource: z.ZodEnum<["measured", "estimated", "inferred"]>;
        peakForceConfidence: z.ZodNumber;
        contactArea: z.ZodNumber;
        damageType: z.ZodEnum<["piercing", "slashing", "blunt", "crushing"]>;
        reach: z.ZodNumber;
        usableStates: z.ZodArray<z.ZodEnum<["STANDING", "CLINCH", "GROUND_TOP", "GROUND_BOTTOM"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
        peakForce?: number;
        contactArea?: number;
        damageType?: "blunt" | "piercing" | "crushing" | "slashing";
        peakForceSource?: "measured" | "estimated" | "inferred";
        peakForceConfidence?: number;
        reach?: number;
        usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
    }, {
        name?: string;
        type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
        peakForce?: number;
        contactArea?: number;
        damageType?: "blunt" | "piercing" | "crushing" | "slashing";
        peakForceSource?: "measured" | "estimated" | "inferred";
        peakForceConfidence?: number;
        reach?: number;
        usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
    }>, "many">;
    armor: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["thick_skin", "fat_layer", "bone_plate", "fur", "scales"]>;
        location: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
        thickness: z.ZodNumber;
        tensileStrength: z.ZodNumber;
        compressiveStrength: z.ZodNumber;
        coverage: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
        location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        tensileStrength?: number;
        compressiveStrength?: number;
        thickness?: number;
        coverage?: number;
    }, {
        type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
        location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        tensileStrength?: number;
        compressiveStrength?: number;
        thickness?: number;
        coverage?: number;
    }>, "many">;
    fearThreshold: z.ZodNumber;
    rageThreshold: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    intelligence?: number;
    aggression?: number;
    territoriality?: number;
    flightiness?: number;
    sociality?: number;
    huntingStyle?: "strike" | "bite" | "ambush" | "chase" | "grapple" | "pack";
    preferredRange?: "long" | "close" | "mid";
    killMethod?: "crushing" | "suffocation" | "exsanguination" | "neck_break" | "overwhelm";
    naturalWeapons?: {
        name?: string;
        type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
        peakForce?: number;
        contactArea?: number;
        damageType?: "blunt" | "piercing" | "crushing" | "slashing";
        peakForceSource?: "measured" | "estimated" | "inferred";
        peakForceConfidence?: number;
        reach?: number;
        usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
    }[];
    armor?: {
        type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
        location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        tensileStrength?: number;
        compressiveStrength?: number;
        thickness?: number;
        coverage?: number;
    }[];
    fearThreshold?: number;
    rageThreshold?: number;
}, {
    intelligence?: number;
    aggression?: number;
    territoriality?: number;
    flightiness?: number;
    sociality?: number;
    huntingStyle?: "strike" | "bite" | "ambush" | "chase" | "grapple" | "pack";
    preferredRange?: "long" | "close" | "mid";
    killMethod?: "crushing" | "suffocation" | "exsanguination" | "neck_break" | "overwhelm";
    naturalWeapons?: {
        name?: string;
        type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
        peakForce?: number;
        contactArea?: number;
        damageType?: "blunt" | "piercing" | "crushing" | "slashing";
        peakForceSource?: "measured" | "estimated" | "inferred";
        peakForceConfidence?: number;
        reach?: number;
        usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
    }[];
    armor?: {
        type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
        location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        tensileStrength?: number;
        compressiveStrength?: number;
        thickness?: number;
        coverage?: number;
    }[];
    fearThreshold?: number;
    rageThreshold?: number;
}>;
export declare const DetailedAnimalProfileSchema: z.ZodObject<{
    taxonomy: z.ZodObject<{
        class: z.ZodString;
        order: z.ZodString;
        family: z.ZodString;
        genus: z.ZodString;
        species: z.ZodString;
        subspecies: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        order?: string;
        class?: string;
        family?: string;
        genus?: string;
        species?: string;
        subspecies?: string;
    }, {
        order?: string;
        class?: string;
        family?: string;
        genus?: string;
        species?: string;
        subspecies?: string;
    }>;
    physical: z.ZodObject<{
        massRange: z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            avg: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            max?: number;
            min?: number;
            avg?: number;
        }, {
            max?: number;
            min?: number;
            avg?: number;
        }>;
        bodyLength: z.ZodNumber;
        shoulderHeight: z.ZodNumber;
        sexualDimorphism: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        massRange?: {
            max?: number;
            min?: number;
            avg?: number;
        };
        bodyLength?: number;
        shoulderHeight?: number;
        sexualDimorphism?: number;
    }, {
        massRange?: {
            max?: number;
            min?: number;
            avg?: number;
        };
        bodyLength?: number;
        shoulderHeight?: number;
        sexualDimorphism?: number;
    }>;
    biomechanics: z.ZodObject<{
        biteForce: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"N">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
        strikeForce: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"N">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
        swipeForce: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"N">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
        gripStrength: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"N">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
        sprintSpeed: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"m/s">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "m/s";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "m/s";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
        acceleration: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"m/s²">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "m/s²";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "m/s²";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
        jumpHeight: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"m">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
        jumpDistance: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodLiteral<"m">;
            source: z.ZodObject<{
                type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
                title: z.ZodString;
                authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                year: z.ZodNumber;
                url: z.ZodOptional<z.ZodString>;
                doi: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }, {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            }>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }, {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        acceleration?: {
            unit?: "m/s²";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        biteForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        strikeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        swipeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        gripStrength?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        sprintSpeed?: {
            unit?: "m/s";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpHeight?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpDistance?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
    }, {
        acceleration?: {
            unit?: "m/s²";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        biteForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        strikeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        swipeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        gripStrength?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        sprintSpeed?: {
            unit?: "m/s";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpHeight?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpDistance?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
    }>;
    behavior: z.ZodObject<{
        aggression: z.ZodNumber;
        territoriality: z.ZodNumber;
        flightiness: z.ZodNumber;
        intelligence: z.ZodNumber;
        sociality: z.ZodNumber;
        huntingStyle: z.ZodEnum<["ambush", "chase", "grapple", "bite", "strike", "pack"]>;
        preferredRange: z.ZodEnum<["close", "mid", "long"]>;
        killMethod: z.ZodEnum<["suffocation", "exsanguination", "crushing", "neck_break", "overwhelm"]>;
        naturalWeapons: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["bite", "claw", "horn", "tusk", "body_slam", "kick", "stomp"]>;
            name: z.ZodString;
            peakForce: z.ZodNumber;
            peakForceSource: z.ZodEnum<["measured", "estimated", "inferred"]>;
            peakForceConfidence: z.ZodNumber;
            contactArea: z.ZodNumber;
            damageType: z.ZodEnum<["piercing", "slashing", "blunt", "crushing"]>;
            reach: z.ZodNumber;
            usableStates: z.ZodArray<z.ZodEnum<["STANDING", "CLINCH", "GROUND_TOP", "GROUND_BOTTOM"]>, "many">;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
            peakForce?: number;
            contactArea?: number;
            damageType?: "blunt" | "piercing" | "crushing" | "slashing";
            peakForceSource?: "measured" | "estimated" | "inferred";
            peakForceConfidence?: number;
            reach?: number;
            usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
        }, {
            name?: string;
            type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
            peakForce?: number;
            contactArea?: number;
            damageType?: "blunt" | "piercing" | "crushing" | "slashing";
            peakForceSource?: "measured" | "estimated" | "inferred";
            peakForceConfidence?: number;
            reach?: number;
            usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
        }>, "many">;
        armor: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["thick_skin", "fat_layer", "bone_plate", "fur", "scales"]>;
            location: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
            thickness: z.ZodNumber;
            tensileStrength: z.ZodNumber;
            compressiveStrength: z.ZodNumber;
            coverage: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
            location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            tensileStrength?: number;
            compressiveStrength?: number;
            thickness?: number;
            coverage?: number;
        }, {
            type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
            location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            tensileStrength?: number;
            compressiveStrength?: number;
            thickness?: number;
            coverage?: number;
        }>, "many">;
        fearThreshold: z.ZodNumber;
        rageThreshold: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        intelligence?: number;
        aggression?: number;
        territoriality?: number;
        flightiness?: number;
        sociality?: number;
        huntingStyle?: "strike" | "bite" | "ambush" | "chase" | "grapple" | "pack";
        preferredRange?: "long" | "close" | "mid";
        killMethod?: "crushing" | "suffocation" | "exsanguination" | "neck_break" | "overwhelm";
        naturalWeapons?: {
            name?: string;
            type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
            peakForce?: number;
            contactArea?: number;
            damageType?: "blunt" | "piercing" | "crushing" | "slashing";
            peakForceSource?: "measured" | "estimated" | "inferred";
            peakForceConfidence?: number;
            reach?: number;
            usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
        }[];
        armor?: {
            type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
            location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            tensileStrength?: number;
            compressiveStrength?: number;
            thickness?: number;
            coverage?: number;
        }[];
        fearThreshold?: number;
        rageThreshold?: number;
    }, {
        intelligence?: number;
        aggression?: number;
        territoriality?: number;
        flightiness?: number;
        sociality?: number;
        huntingStyle?: "strike" | "bite" | "ambush" | "chase" | "grapple" | "pack";
        preferredRange?: "long" | "close" | "mid";
        killMethod?: "crushing" | "suffocation" | "exsanguination" | "neck_break" | "overwhelm";
        naturalWeapons?: {
            name?: string;
            type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
            peakForce?: number;
            contactArea?: number;
            damageType?: "blunt" | "piercing" | "crushing" | "slashing";
            peakForceSource?: "measured" | "estimated" | "inferred";
            peakForceConfidence?: number;
            reach?: number;
            usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
        }[];
        armor?: {
            type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
            location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            tensileStrength?: number;
            compressiveStrength?: number;
            thickness?: number;
            coverage?: number;
        }[];
        fearThreshold?: number;
        rageThreshold?: number;
    }>;
    ecology: z.ZodObject<{
        habitat: z.ZodArray<z.ZodString, "many">;
        diet: z.ZodEnum<["carnivore", "omnivore", "herbivore"]>;
        activityPattern: z.ZodEnum<["diurnal", "nocturnal", "crepuscular", "cathemeral"]>;
        socialStructure: z.ZodEnum<["solitary", "pair", "family", "pack", "troop", "herd"]>;
        territorySize: z.ZodOptional<z.ZodNumber>;
        homeRange: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        habitat?: string[];
        diet?: "carnivore" | "omnivore" | "herbivore";
        activityPattern?: "diurnal" | "nocturnal" | "crepuscular" | "cathemeral";
        socialStructure?: "pack" | "solitary" | "pair" | "family" | "troop" | "herd";
        territorySize?: number;
        homeRange?: number;
    }, {
        habitat?: string[];
        diet?: "carnivore" | "omnivore" | "herbivore";
        activityPattern?: "diurnal" | "nocturnal" | "crepuscular" | "cathemeral";
        socialStructure?: "pack" | "solitary" | "pair" | "family" | "troop" | "herd";
        territorySize?: number;
        homeRange?: number;
    }>;
    lifeHistory: z.ZodObject<{
        lifespan: z.ZodObject<{
            wild: z.ZodNumber;
            captivity: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            wild?: number;
            captivity?: number;
        }, {
            wild?: number;
            captivity?: number;
        }>;
        sexualMaturity: z.ZodNumber;
        gestationPeriod: z.ZodNumber;
        litterSize: z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            avg: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            max?: number;
            min?: number;
            avg?: number;
        }, {
            max?: number;
            min?: number;
            avg?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        lifespan?: {
            wild?: number;
            captivity?: number;
        };
        sexualMaturity?: number;
        gestationPeriod?: number;
        litterSize?: {
            max?: number;
            min?: number;
            avg?: number;
        };
    }, {
        lifespan?: {
            wild?: number;
            captivity?: number;
        };
        sexualMaturity?: number;
        gestationPeriod?: number;
        litterSize?: {
            max?: number;
            min?: number;
            avg?: number;
        };
    }>;
    references: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["paper", "database", "observation", "expert"]>;
        title: z.ZodString;
        authors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        year: z.ZodNumber;
        url: z.ZodOptional<z.ZodString>;
        doi: z.ZodOptional<z.ZodString>;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type?: "paper" | "database" | "observation" | "expert";
        url?: string;
        title?: string;
        year?: number;
        authors?: string[];
        doi?: string;
        notes?: string;
    }, {
        type?: "paper" | "database" | "observation" | "expert";
        url?: string;
        title?: string;
        year?: number;
        authors?: string[];
        doi?: string;
        notes?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    biomechanics?: {
        acceleration?: {
            unit?: "m/s²";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        biteForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        strikeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        swipeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        gripStrength?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        sprintSpeed?: {
            unit?: "m/s";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpHeight?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpDistance?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
    };
    taxonomy?: {
        order?: string;
        class?: string;
        family?: string;
        genus?: string;
        species?: string;
        subspecies?: string;
    };
    physical?: {
        massRange?: {
            max?: number;
            min?: number;
            avg?: number;
        };
        bodyLength?: number;
        shoulderHeight?: number;
        sexualDimorphism?: number;
    };
    behavior?: {
        intelligence?: number;
        aggression?: number;
        territoriality?: number;
        flightiness?: number;
        sociality?: number;
        huntingStyle?: "strike" | "bite" | "ambush" | "chase" | "grapple" | "pack";
        preferredRange?: "long" | "close" | "mid";
        killMethod?: "crushing" | "suffocation" | "exsanguination" | "neck_break" | "overwhelm";
        naturalWeapons?: {
            name?: string;
            type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
            peakForce?: number;
            contactArea?: number;
            damageType?: "blunt" | "piercing" | "crushing" | "slashing";
            peakForceSource?: "measured" | "estimated" | "inferred";
            peakForceConfidence?: number;
            reach?: number;
            usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
        }[];
        armor?: {
            type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
            location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            tensileStrength?: number;
            compressiveStrength?: number;
            thickness?: number;
            coverage?: number;
        }[];
        fearThreshold?: number;
        rageThreshold?: number;
    };
    ecology?: {
        habitat?: string[];
        diet?: "carnivore" | "omnivore" | "herbivore";
        activityPattern?: "diurnal" | "nocturnal" | "crepuscular" | "cathemeral";
        socialStructure?: "pack" | "solitary" | "pair" | "family" | "troop" | "herd";
        territorySize?: number;
        homeRange?: number;
    };
    lifeHistory?: {
        lifespan?: {
            wild?: number;
            captivity?: number;
        };
        sexualMaturity?: number;
        gestationPeriod?: number;
        litterSize?: {
            max?: number;
            min?: number;
            avg?: number;
        };
    };
    references?: {
        type?: "paper" | "database" | "observation" | "expert";
        url?: string;
        title?: string;
        year?: number;
        authors?: string[];
        doi?: string;
        notes?: string;
    }[];
}, {
    biomechanics?: {
        acceleration?: {
            unit?: "m/s²";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        biteForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        strikeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        swipeForce?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        gripStrength?: {
            unit?: "N";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        sprintSpeed?: {
            unit?: "m/s";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpHeight?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
        jumpDistance?: {
            unit?: "m";
            source?: {
                type?: "paper" | "database" | "observation" | "expert";
                url?: string;
                title?: string;
                year?: number;
                authors?: string[];
                doi?: string;
                notes?: string;
            };
            value?: number;
            confidence?: number;
        };
    };
    taxonomy?: {
        order?: string;
        class?: string;
        family?: string;
        genus?: string;
        species?: string;
        subspecies?: string;
    };
    physical?: {
        massRange?: {
            max?: number;
            min?: number;
            avg?: number;
        };
        bodyLength?: number;
        shoulderHeight?: number;
        sexualDimorphism?: number;
    };
    behavior?: {
        intelligence?: number;
        aggression?: number;
        territoriality?: number;
        flightiness?: number;
        sociality?: number;
        huntingStyle?: "strike" | "bite" | "ambush" | "chase" | "grapple" | "pack";
        preferredRange?: "long" | "close" | "mid";
        killMethod?: "crushing" | "suffocation" | "exsanguination" | "neck_break" | "overwhelm";
        naturalWeapons?: {
            name?: string;
            type?: "bite" | "claw" | "horn" | "tusk" | "body_slam" | "kick" | "stomp";
            peakForce?: number;
            contactArea?: number;
            damageType?: "blunt" | "piercing" | "crushing" | "slashing";
            peakForceSource?: "measured" | "estimated" | "inferred";
            peakForceConfidence?: number;
            reach?: number;
            usableStates?: ("STANDING" | "CLINCH" | "GROUND_TOP" | "GROUND_BOTTOM")[];
        }[];
        armor?: {
            type?: "thick_skin" | "fat_layer" | "bone_plate" | "fur" | "scales";
            location?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
            tensileStrength?: number;
            compressiveStrength?: number;
            thickness?: number;
            coverage?: number;
        }[];
        fearThreshold?: number;
        rageThreshold?: number;
    };
    ecology?: {
        habitat?: string[];
        diet?: "carnivore" | "omnivore" | "herbivore";
        activityPattern?: "diurnal" | "nocturnal" | "crepuscular" | "cathemeral";
        socialStructure?: "pack" | "solitary" | "pair" | "family" | "troop" | "herd";
        territorySize?: number;
        homeRange?: number;
    };
    lifeHistory?: {
        lifespan?: {
            wild?: number;
            captivity?: number;
        };
        sexualMaturity?: number;
        gestationPeriod?: number;
        litterSize?: {
            max?: number;
            min?: number;
            avg?: number;
        };
    };
    references?: {
        type?: "paper" | "database" | "observation" | "expert";
        url?: string;
        title?: string;
        year?: number;
        authors?: string[];
        doi?: string;
        notes?: string;
    }[];
}>;
export declare const HomeGroundBonusSchema: z.ZodObject<{
    crowdSupport: z.ZodNumber;
    familiarTerrain: z.ZodNumber;
    psychologicalEdge: z.ZodNumber;
    refereeBias: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    crowdSupport?: number;
    familiarTerrain?: number;
    psychologicalEdge?: number;
    refereeBias?: number;
}, {
    crowdSupport?: number;
    familiarTerrain?: number;
    psychologicalEdge?: number;
    refereeBias?: number;
}>;
export declare const EnvironmentSchema: z.ZodObject<{
    terrain: z.ZodEnum<["flat", "uneven", "slippery", "sand", "water_shallow"]>;
    lighting: z.ZodEnum<["bright", "dim", "dark"]>;
    temperature: z.ZodNumber;
    humidity: z.ZodNumber;
    gravity: z.ZodDefault<z.ZodNumber>;
    homeGround: z.ZodEnum<["A", "B", "neutral"]>;
    homeGroundBonus: z.ZodObject<{
        crowdSupport: z.ZodNumber;
        familiarTerrain: z.ZodNumber;
        psychologicalEdge: z.ZodNumber;
        refereeBias: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        crowdSupport?: number;
        familiarTerrain?: number;
        psychologicalEdge?: number;
        refereeBias?: number;
    }, {
        crowdSupport?: number;
        familiarTerrain?: number;
        psychologicalEdge?: number;
        refereeBias?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    homeGround?: "A" | "B" | "neutral";
    terrain?: "flat" | "uneven" | "slippery" | "sand" | "water_shallow";
    lighting?: "bright" | "dim" | "dark";
    temperature?: number;
    humidity?: number;
    gravity?: number;
    homeGroundBonus?: {
        crowdSupport?: number;
        familiarTerrain?: number;
        psychologicalEdge?: number;
        refereeBias?: number;
    };
}, {
    homeGround?: "A" | "B" | "neutral";
    terrain?: "flat" | "uneven" | "slippery" | "sand" | "water_shallow";
    lighting?: "bright" | "dim" | "dark";
    temperature?: number;
    humidity?: number;
    gravity?: number;
    homeGroundBonus?: {
        crowdSupport?: number;
        familiarTerrain?: number;
        psychologicalEdge?: number;
        refereeBias?: number;
    };
}>;
export declare const FightRulesSchema: z.ZodObject<{
    timeLimit: z.ZodNumber;
    roundDuration: z.ZodNumber;
    maxRounds: z.ZodNumber;
    allowedTechniqueCategories: z.ZodArray<z.ZodEnum<["strike_punch", "strike_kick", "strike_elbow", "strike_knee", "strike_headbutt", "grapple_takedown", "grapple_throw", "grapple_clinch", "grapple_choke", "grapple_joint", "grapple_ground", "grapple_sweep", "defense_block", "defense_parry", "defense_dodge", "defense_slip", "defense_weave", "defense_sprawl", "special_feint", "special_combo", "special_counter"]>, "many">;
    forbiddenTargets: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
    knockoutRule: z.ZodEnum<["instant", "count10", "tko"]>;
    surrenderAllowed: z.ZodBoolean;
    deathAllowed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    deathAllowed?: boolean;
    timeLimit?: number;
    roundDuration?: number;
    maxRounds?: number;
    allowedTechniqueCategories?: ("strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter")[];
    forbiddenTargets?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    knockoutRule?: "instant" | "count10" | "tko";
    surrenderAllowed?: boolean;
}, {
    deathAllowed?: boolean;
    timeLimit?: number;
    roundDuration?: number;
    maxRounds?: number;
    allowedTechniqueCategories?: ("strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter")[];
    forbiddenTargets?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
    knockoutRule?: "instant" | "count10" | "tko";
    surrenderAllowed?: boolean;
}>;
export declare const FightContextSchema: z.ZodObject<{
    environment: z.ZodObject<{
        terrain: z.ZodEnum<["flat", "uneven", "slippery", "sand", "water_shallow"]>;
        lighting: z.ZodEnum<["bright", "dim", "dark"]>;
        temperature: z.ZodNumber;
        humidity: z.ZodNumber;
        gravity: z.ZodDefault<z.ZodNumber>;
        homeGround: z.ZodEnum<["A", "B", "neutral"]>;
        homeGroundBonus: z.ZodObject<{
            crowdSupport: z.ZodNumber;
            familiarTerrain: z.ZodNumber;
            psychologicalEdge: z.ZodNumber;
            refereeBias: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            crowdSupport?: number;
            familiarTerrain?: number;
            psychologicalEdge?: number;
            refereeBias?: number;
        }, {
            crowdSupport?: number;
            familiarTerrain?: number;
            psychologicalEdge?: number;
            refereeBias?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        homeGround?: "A" | "B" | "neutral";
        terrain?: "flat" | "uneven" | "slippery" | "sand" | "water_shallow";
        lighting?: "bright" | "dim" | "dark";
        temperature?: number;
        humidity?: number;
        gravity?: number;
        homeGroundBonus?: {
            crowdSupport?: number;
            familiarTerrain?: number;
            psychologicalEdge?: number;
            refereeBias?: number;
        };
    }, {
        homeGround?: "A" | "B" | "neutral";
        terrain?: "flat" | "uneven" | "slippery" | "sand" | "water_shallow";
        lighting?: "bright" | "dim" | "dark";
        temperature?: number;
        humidity?: number;
        gravity?: number;
        homeGroundBonus?: {
            crowdSupport?: number;
            familiarTerrain?: number;
            psychologicalEdge?: number;
            refereeBias?: number;
        };
    }>;
    rules: z.ZodObject<{
        timeLimit: z.ZodNumber;
        roundDuration: z.ZodNumber;
        maxRounds: z.ZodNumber;
        allowedTechniqueCategories: z.ZodArray<z.ZodEnum<["strike_punch", "strike_kick", "strike_elbow", "strike_knee", "strike_headbutt", "grapple_takedown", "grapple_throw", "grapple_clinch", "grapple_choke", "grapple_joint", "grapple_ground", "grapple_sweep", "defense_block", "defense_parry", "defense_dodge", "defense_slip", "defense_weave", "defense_sprawl", "special_feint", "special_combo", "special_counter"]>, "many">;
        forbiddenTargets: z.ZodArray<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>, "many">;
        knockoutRule: z.ZodEnum<["instant", "count10", "tko"]>;
        surrenderAllowed: z.ZodBoolean;
        deathAllowed: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        deathAllowed?: boolean;
        timeLimit?: number;
        roundDuration?: number;
        maxRounds?: number;
        allowedTechniqueCategories?: ("strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter")[];
        forbiddenTargets?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        knockoutRule?: "instant" | "count10" | "tko";
        surrenderAllowed?: boolean;
    }, {
        deathAllowed?: boolean;
        timeLimit?: number;
        roundDuration?: number;
        maxRounds?: number;
        allowedTechniqueCategories?: ("strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter")[];
        forbiddenTargets?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        knockoutRule?: "instant" | "count10" | "tko";
        surrenderAllowed?: boolean;
    }>;
    seed: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    environment?: {
        homeGround?: "A" | "B" | "neutral";
        terrain?: "flat" | "uneven" | "slippery" | "sand" | "water_shallow";
        lighting?: "bright" | "dim" | "dark";
        temperature?: number;
        humidity?: number;
        gravity?: number;
        homeGroundBonus?: {
            crowdSupport?: number;
            familiarTerrain?: number;
            psychologicalEdge?: number;
            refereeBias?: number;
        };
    };
    rules?: {
        deathAllowed?: boolean;
        timeLimit?: number;
        roundDuration?: number;
        maxRounds?: number;
        allowedTechniqueCategories?: ("strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter")[];
        forbiddenTargets?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        knockoutRule?: "instant" | "count10" | "tko";
        surrenderAllowed?: boolean;
    };
    seed?: number;
}, {
    environment?: {
        homeGround?: "A" | "B" | "neutral";
        terrain?: "flat" | "uneven" | "slippery" | "sand" | "water_shallow";
        lighting?: "bright" | "dim" | "dark";
        temperature?: number;
        humidity?: number;
        gravity?: number;
        homeGroundBonus?: {
            crowdSupport?: number;
            familiarTerrain?: number;
            psychologicalEdge?: number;
            refereeBias?: number;
        };
    };
    rules?: {
        deathAllowed?: boolean;
        timeLimit?: number;
        roundDuration?: number;
        maxRounds?: number;
        allowedTechniqueCategories?: ("strike_punch" | "strike_kick" | "strike_elbow" | "strike_knee" | "strike_headbutt" | "grapple_takedown" | "grapple_throw" | "grapple_clinch" | "grapple_choke" | "grapple_joint" | "grapple_ground" | "grapple_sweep" | "defense_block" | "defense_parry" | "defense_dodge" | "defense_slip" | "defense_weave" | "defense_sprawl" | "special_feint" | "special_combo" | "special_counter")[];
        forbiddenTargets?: ("head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin")[];
        knockoutRule?: "instant" | "count10" | "tko";
        surrenderAllowed?: boolean;
    };
    seed?: number;
}>;
export declare const CombatEventSchema: z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodNumber;
    type: z.ZodEnum<["strike", "block", "dodge", "takedown", "submission", "knockdown", "ko", "submission_finish", "surrender", "death", "round_start", "round_end", "clinch", "separation", "feint", "counter"]>;
    actor: z.ZodEnum<["A", "B"]>;
    target: z.ZodEnum<["A", "B"]>;
    techniqueId: z.ZodOptional<z.ZodString>;
    techniqueName: z.ZodOptional<z.ZodString>;
    targetPart: z.ZodOptional<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>>;
    damage: z.ZodOptional<z.ZodNumber>;
    result: z.ZodEnum<["hit", "blocked", "dodged", "parried", "missed", "landed", "escaped", "reversed"]>;
    description: z.ZodString;
    force: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x?: number;
        y?: number;
    }, {
        x?: number;
        y?: number;
    }>>;
    knockback: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x?: number;
        y?: number;
    }, {
        x?: number;
        y?: number;
    }>>;
    stunDuration: z.ZodOptional<z.ZodNumber>;
    injuries: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
        type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
        severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
        functionalLoss: z.ZodNumber;
        timestamp: z.ZodNumber;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }, {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
    id?: string;
    timestamp?: number;
    target?: "A" | "B";
    description?: string;
    force?: {
        x?: number;
        y?: number;
    };
    damage?: number;
    knockback?: {
        x?: number;
        y?: number;
    };
    actor?: "A" | "B";
    techniqueId?: string;
    techniqueName?: string;
    targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
    stunDuration?: number;
    injuries?: {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }[];
}, {
    type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
    id?: string;
    timestamp?: number;
    target?: "A" | "B";
    description?: string;
    force?: {
        x?: number;
        y?: number;
    };
    damage?: number;
    knockback?: {
        x?: number;
        y?: number;
    };
    actor?: "A" | "B";
    techniqueId?: string;
    techniqueName?: string;
    targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
    stunDuration?: number;
    injuries?: {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }[];
}>;
export declare const RoundResultSchema: z.ZodObject<{
    round: z.ZodNumber;
    duration: z.ZodNumber;
    events: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        timestamp: z.ZodNumber;
        type: z.ZodEnum<["strike", "block", "dodge", "takedown", "submission", "knockdown", "ko", "submission_finish", "surrender", "death", "round_start", "round_end", "clinch", "separation", "feint", "counter"]>;
        actor: z.ZodEnum<["A", "B"]>;
        target: z.ZodEnum<["A", "B"]>;
        techniqueId: z.ZodOptional<z.ZodString>;
        techniqueName: z.ZodOptional<z.ZodString>;
        targetPart: z.ZodOptional<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>>;
        damage: z.ZodOptional<z.ZodNumber>;
        result: z.ZodEnum<["hit", "blocked", "dodged", "parried", "missed", "landed", "escaped", "reversed"]>;
        description: z.ZodString;
        force: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>>;
        knockback: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>>;
        stunDuration: z.ZodOptional<z.ZodNumber>;
        injuries: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
            type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
            severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
            functionalLoss: z.ZodNumber;
            timestamp: z.ZodNumber;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }, {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }>, "many">;
    scoreA: z.ZodNumber;
    scoreB: z.ZodNumber;
    knockdownsA: z.ZodNumber;
    knockdownsB: z.ZodNumber;
    dominantFighter: z.ZodEnum<["A", "B", "even"]>;
}, "strip", z.ZodTypeAny, {
    round?: number;
    duration?: number;
    events?: {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }[];
    scoreA?: number;
    scoreB?: number;
    knockdownsA?: number;
    knockdownsB?: number;
    dominantFighter?: "A" | "B" | "even";
}, {
    round?: number;
    duration?: number;
    events?: {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }[];
    scoreA?: number;
    scoreB?: number;
    knockdownsA?: number;
    knockdownsB?: number;
    dominantFighter?: "A" | "B" | "even";
}>;
export declare const PartDamageSummarySchema: z.ZodObject<{
    partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
    totalDamage: z.ZodNumber;
    injurySeverity: z.ZodEnum<["none", "minor", "moderate", "severe", "critical", "loss"]>;
    injuries: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
        type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
        severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
        functionalLoss: z.ZodNumber;
        timestamp: z.ZodNumber;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }, {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }>, "many">;
    functionalLoss: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    functionalLoss?: number;
    injuries?: {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }[];
    totalDamage?: number;
    injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
}, {
    partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
    functionalLoss?: number;
    injuries?: {
        type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
        id?: string;
        timestamp?: number;
        description?: string;
        partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        severity?: "minor" | "moderate" | "severe" | "critical";
        functionalLoss?: number;
    }[];
    totalDamage?: number;
    injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
}>;
export declare const FightResultSchema: z.ZodObject<{
    simulationId: z.ZodString;
    winner: z.ZodEnum<["A", "B", "draw"]>;
    winProbability: z.ZodObject<{
        A: z.ZodNumber;
        B: z.ZodNumber;
        draw: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        A?: number;
        B?: number;
        draw?: number;
    }, {
        A?: number;
        B?: number;
        draw?: number;
    }>;
    duration: z.ZodNumber;
    rounds: z.ZodArray<z.ZodObject<{
        round: z.ZodNumber;
        duration: z.ZodNumber;
        events: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            timestamp: z.ZodNumber;
            type: z.ZodEnum<["strike", "block", "dodge", "takedown", "submission", "knockdown", "ko", "submission_finish", "surrender", "death", "round_start", "round_end", "clinch", "separation", "feint", "counter"]>;
            actor: z.ZodEnum<["A", "B"]>;
            target: z.ZodEnum<["A", "B"]>;
            techniqueId: z.ZodOptional<z.ZodString>;
            techniqueName: z.ZodOptional<z.ZodString>;
            targetPart: z.ZodOptional<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>>;
            damage: z.ZodOptional<z.ZodNumber>;
            result: z.ZodEnum<["hit", "blocked", "dodged", "parried", "missed", "landed", "escaped", "reversed"]>;
            description: z.ZodString;
            force: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x?: number;
                y?: number;
            }, {
                x?: number;
                y?: number;
            }>>;
            knockback: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x?: number;
                y?: number;
            }, {
                x?: number;
                y?: number;
            }>>;
            stunDuration: z.ZodOptional<z.ZodNumber>;
            injuries: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
                type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
                severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
                functionalLoss: z.ZodNumber;
                timestamp: z.ZodNumber;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }, {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
            id?: string;
            timestamp?: number;
            target?: "A" | "B";
            description?: string;
            force?: {
                x?: number;
                y?: number;
            };
            damage?: number;
            knockback?: {
                x?: number;
                y?: number;
            };
            actor?: "A" | "B";
            techniqueId?: string;
            techniqueName?: string;
            targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
            stunDuration?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
        }, {
            type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
            id?: string;
            timestamp?: number;
            target?: "A" | "B";
            description?: string;
            force?: {
                x?: number;
                y?: number;
            };
            damage?: number;
            knockback?: {
                x?: number;
                y?: number;
            };
            actor?: "A" | "B";
            techniqueId?: string;
            techniqueName?: string;
            targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
            stunDuration?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
        }>, "many">;
        scoreA: z.ZodNumber;
        scoreB: z.ZodNumber;
        knockdownsA: z.ZodNumber;
        knockdownsB: z.ZodNumber;
        dominantFighter: z.ZodEnum<["A", "B", "even"]>;
    }, "strip", z.ZodTypeAny, {
        round?: number;
        duration?: number;
        events?: {
            type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
            id?: string;
            timestamp?: number;
            target?: "A" | "B";
            description?: string;
            force?: {
                x?: number;
                y?: number;
            };
            damage?: number;
            knockback?: {
                x?: number;
                y?: number;
            };
            actor?: "A" | "B";
            techniqueId?: string;
            techniqueName?: string;
            targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
            stunDuration?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
        }[];
        scoreA?: number;
        scoreB?: number;
        knockdownsA?: number;
        knockdownsB?: number;
        dominantFighter?: "A" | "B" | "even";
    }, {
        round?: number;
        duration?: number;
        events?: {
            type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
            id?: string;
            timestamp?: number;
            target?: "A" | "B";
            description?: string;
            force?: {
                x?: number;
                y?: number;
            };
            damage?: number;
            knockback?: {
                x?: number;
                y?: number;
            };
            actor?: "A" | "B";
            techniqueId?: string;
            techniqueName?: string;
            targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
            stunDuration?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
        }[];
        scoreA?: number;
        scoreB?: number;
        knockdownsA?: number;
        knockdownsB?: number;
        dominantFighter?: "A" | "B" | "even";
    }>, "many">;
    finishType: z.ZodEnum<["ko", "tko", "submission", "decision", "surrender", "death", "timeout"]>;
    finishTime: z.ZodNumber;
    summary: z.ZodObject<{
        totalStrikes: z.ZodObject<{
            A: z.ZodNumber;
            B: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            A?: number;
            B?: number;
        }, {
            A?: number;
            B?: number;
        }>;
        significantStrikes: z.ZodObject<{
            A: z.ZodNumber;
            B: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            A?: number;
            B?: number;
        }, {
            A?: number;
            B?: number;
        }>;
        takedowns: z.ZodObject<{
            A: z.ZodNumber;
            B: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            A?: number;
            B?: number;
        }, {
            A?: number;
            B?: number;
        }>;
        submissions: z.ZodObject<{
            A: z.ZodNumber;
            B: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            A?: number;
            B?: number;
        }, {
            A?: number;
            B?: number;
        }>;
        knockdowns: z.ZodObject<{
            A: z.ZodNumber;
            B: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            A?: number;
            B?: number;
        }, {
            A?: number;
            B?: number;
        }>;
        clinchTime: z.ZodObject<{
            A: z.ZodNumber;
            B: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            A?: number;
            B?: number;
        }, {
            A?: number;
            B?: number;
        }>;
        groundTime: z.ZodObject<{
            A: z.ZodNumber;
            B: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            A?: number;
            B?: number;
        }, {
            A?: number;
            B?: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        totalStrikes?: {
            A?: number;
            B?: number;
        };
        significantStrikes?: {
            A?: number;
            B?: number;
        };
        takedowns?: {
            A?: number;
            B?: number;
        };
        submissions?: {
            A?: number;
            B?: number;
        };
        knockdowns?: {
            A?: number;
            B?: number;
        };
        clinchTime?: {
            A?: number;
            B?: number;
        };
        groundTime?: {
            A?: number;
            B?: number;
        };
    }, {
        totalStrikes?: {
            A?: number;
            B?: number;
        };
        significantStrikes?: {
            A?: number;
            B?: number;
        };
        takedowns?: {
            A?: number;
            B?: number;
        };
        submissions?: {
            A?: number;
            B?: number;
        };
        knockdowns?: {
            A?: number;
            B?: number;
        };
        clinchTime?: {
            A?: number;
            B?: number;
        };
        groundTime?: {
            A?: number;
            B?: number;
        };
    }>;
    damageByPart: z.ZodObject<{
        A: z.ZodRecord<z.ZodString, z.ZodObject<{
            partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
            totalDamage: z.ZodNumber;
            injurySeverity: z.ZodEnum<["none", "minor", "moderate", "severe", "critical", "loss"]>;
            injuries: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
                type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
                severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
                functionalLoss: z.ZodNumber;
                timestamp: z.ZodNumber;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }, {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }>, "many">;
            functionalLoss: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>>;
        B: z.ZodRecord<z.ZodString, z.ZodObject<{
            partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
            totalDamage: z.ZodNumber;
            injurySeverity: z.ZodEnum<["none", "minor", "moderate", "severe", "critical", "loss"]>;
            injuries: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
                type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
                severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
                functionalLoss: z.ZodNumber;
                timestamp: z.ZodNumber;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }, {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }>, "many">;
            functionalLoss: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>>;
    }, "strip", z.ZodTypeAny, {
        A?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
        B?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
    }, {
        A?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
        B?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
    }>;
    timeline: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        timestamp: z.ZodNumber;
        type: z.ZodEnum<["strike", "block", "dodge", "takedown", "submission", "knockdown", "ko", "submission_finish", "surrender", "death", "round_start", "round_end", "clinch", "separation", "feint", "counter"]>;
        actor: z.ZodEnum<["A", "B"]>;
        target: z.ZodEnum<["A", "B"]>;
        techniqueId: z.ZodOptional<z.ZodString>;
        techniqueName: z.ZodOptional<z.ZodString>;
        targetPart: z.ZodOptional<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>>;
        damage: z.ZodOptional<z.ZodNumber>;
        result: z.ZodEnum<["hit", "blocked", "dodged", "parried", "missed", "landed", "escaped", "reversed"]>;
        description: z.ZodString;
        force: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>>;
        knockback: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>>;
        stunDuration: z.ZodOptional<z.ZodNumber>;
        injuries: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
            type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
            severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
            functionalLoss: z.ZodNumber;
            timestamp: z.ZodNumber;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }, {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    timeline?: {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }[];
    summary?: {
        totalStrikes?: {
            A?: number;
            B?: number;
        };
        significantStrikes?: {
            A?: number;
            B?: number;
        };
        takedowns?: {
            A?: number;
            B?: number;
        };
        submissions?: {
            A?: number;
            B?: number;
        };
        knockdowns?: {
            A?: number;
            B?: number;
        };
        clinchTime?: {
            A?: number;
            B?: number;
        };
        groundTime?: {
            A?: number;
            B?: number;
        };
    };
    duration?: number;
    simulationId?: string;
    winner?: "A" | "B" | "draw";
    winProbability?: {
        A?: number;
        B?: number;
        draw?: number;
    };
    rounds?: {
        round?: number;
        duration?: number;
        events?: {
            type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
            id?: string;
            timestamp?: number;
            target?: "A" | "B";
            description?: string;
            force?: {
                x?: number;
                y?: number;
            };
            damage?: number;
            knockback?: {
                x?: number;
                y?: number;
            };
            actor?: "A" | "B";
            techniqueId?: string;
            techniqueName?: string;
            targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
            stunDuration?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
        }[];
        scoreA?: number;
        scoreB?: number;
        knockdownsA?: number;
        knockdownsB?: number;
        dominantFighter?: "A" | "B" | "even";
    }[];
    finishType?: "timeout" | "tko" | "ko" | "submission" | "decision" | "surrender" | "death";
    finishTime?: number;
    damageByPart?: {
        A?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
        B?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
    };
}, {
    timeline?: {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }[];
    summary?: {
        totalStrikes?: {
            A?: number;
            B?: number;
        };
        significantStrikes?: {
            A?: number;
            B?: number;
        };
        takedowns?: {
            A?: number;
            B?: number;
        };
        submissions?: {
            A?: number;
            B?: number;
        };
        knockdowns?: {
            A?: number;
            B?: number;
        };
        clinchTime?: {
            A?: number;
            B?: number;
        };
        groundTime?: {
            A?: number;
            B?: number;
        };
    };
    duration?: number;
    simulationId?: string;
    winner?: "A" | "B" | "draw";
    winProbability?: {
        A?: number;
        B?: number;
        draw?: number;
    };
    rounds?: {
        round?: number;
        duration?: number;
        events?: {
            type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
            id?: string;
            timestamp?: number;
            target?: "A" | "B";
            description?: string;
            force?: {
                x?: number;
                y?: number;
            };
            damage?: number;
            knockback?: {
                x?: number;
                y?: number;
            };
            actor?: "A" | "B";
            techniqueId?: string;
            techniqueName?: string;
            targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
            stunDuration?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
        }[];
        scoreA?: number;
        scoreB?: number;
        knockdownsA?: number;
        knockdownsB?: number;
        dominantFighter?: "A" | "B" | "even";
    }[];
    finishType?: "timeout" | "tko" | "ko" | "submission" | "decision" | "surrender" | "death";
    finishTime?: number;
    damageByPart?: {
        A?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
        B?: Record<string, {
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            functionalLoss?: number;
            injuries?: {
                type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
                id?: string;
                timestamp?: number;
                description?: string;
                partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
                severity?: "minor" | "moderate" | "severe" | "critical";
                functionalLoss?: number;
            }[];
            totalDamage?: number;
            injurySeverity?: "none" | "minor" | "moderate" | "severe" | "critical" | "loss";
        }>;
    };
}>;
export declare const ReplaySnapshotSchema: z.ZodObject<{
    timestamp: z.ZodNumber;
    fighters: z.ZodRecord<z.ZodString, z.ZodObject<{
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>;
        angle: z.ZodNumber;
        pose: z.ZodArray<z.ZodObject<{
            joint: z.ZodString;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x?: number;
                y?: number;
            }, {
                x?: number;
                y?: number;
            }>;
            angle: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            angle?: number;
            position?: {
                x?: number;
                y?: number;
            };
            joint?: string;
        }, {
            angle?: number;
            position?: {
                x?: number;
                y?: number;
            };
            joint?: string;
        }>, "many">;
        velocity: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>;
        angularVelocity: z.ZodNumber;
        health: z.ZodNumber;
        stamina: z.ZodNumber;
        activeInjuries: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
            type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
            severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
            functionalLoss: z.ZodNumber;
            timestamp: z.ZodNumber;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }>, "many">;
        currentAction: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        angle?: number;
        position?: {
            x?: number;
            y?: number;
        };
        velocity?: {
            x?: number;
            y?: number;
        };
        angularVelocity?: number;
        pose?: {
            angle?: number;
            position?: {
                x?: number;
                y?: number;
            };
            joint?: string;
        }[];
        health?: number;
        stamina?: number;
        activeInjuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
        currentAction?: string;
    }, {
        angle?: number;
        position?: {
            x?: number;
            y?: number;
        };
        velocity?: {
            x?: number;
            y?: number;
        };
        angularVelocity?: number;
        pose?: {
            angle?: number;
            position?: {
                x?: number;
                y?: number;
            };
            joint?: string;
        }[];
        health?: number;
        stamina?: number;
        activeInjuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
        currentAction?: string;
    }>>;
    events: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        timestamp: z.ZodNumber;
        type: z.ZodEnum<["strike", "block", "dodge", "takedown", "submission", "knockdown", "ko", "submission_finish", "surrender", "death", "round_start", "round_end", "clinch", "separation", "feint", "counter"]>;
        actor: z.ZodEnum<["A", "B"]>;
        target: z.ZodEnum<["A", "B"]>;
        techniqueId: z.ZodOptional<z.ZodString>;
        techniqueName: z.ZodOptional<z.ZodString>;
        targetPart: z.ZodOptional<z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>>;
        damage: z.ZodOptional<z.ZodNumber>;
        result: z.ZodEnum<["hit", "blocked", "dodged", "parried", "missed", "landed", "escaped", "reversed"]>;
        description: z.ZodString;
        force: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>>;
        knockback: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x?: number;
            y?: number;
        }, {
            x?: number;
            y?: number;
        }>>;
        stunDuration: z.ZodOptional<z.ZodNumber>;
        injuries: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            partId: z.ZodEnum<["head", "neck", "torso_front", "torso_back", "torso_side_l", "torso_side_r", "arm_upper_l", "arm_lower_l", "hand_l", "arm_upper_r", "arm_lower_r", "hand_r", "leg_upper_l", "leg_lower_l", "foot_l", "leg_upper_r", "leg_lower_r", "foot_r", "groin"]>;
            type: z.ZodEnum<["bruise", "laceration", "fracture", "dislocation", "concussion", "organ_damage", "nerve_damage", "vessel_rupture"]>;
            severity: z.ZodEnum<["minor", "moderate", "severe", "critical"]>;
            functionalLoss: z.ZodNumber;
            timestamp: z.ZodNumber;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }, {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }, {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    timestamp?: number;
    events?: {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }[];
    fighters?: Record<string, {
        angle?: number;
        position?: {
            x?: number;
            y?: number;
        };
        velocity?: {
            x?: number;
            y?: number;
        };
        angularVelocity?: number;
        pose?: {
            angle?: number;
            position?: {
                x?: number;
                y?: number;
            };
            joint?: string;
        }[];
        health?: number;
        stamina?: number;
        activeInjuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
        currentAction?: string;
    }>;
}, {
    timestamp?: number;
    events?: {
        type?: "strike" | "block" | "ko" | "submission" | "surrender" | "death" | "dodge" | "takedown" | "knockdown" | "submission_finish" | "round_start" | "round_end" | "clinch" | "separation" | "feint" | "counter";
        id?: string;
        timestamp?: number;
        target?: "A" | "B";
        description?: string;
        force?: {
            x?: number;
            y?: number;
        };
        damage?: number;
        knockback?: {
            x?: number;
            y?: number;
        };
        actor?: "A" | "B";
        techniqueId?: string;
        techniqueName?: string;
        targetPart?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
        result?: "blocked" | "hit" | "dodged" | "parried" | "missed" | "landed" | "escaped" | "reversed";
        stunDuration?: number;
        injuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
    }[];
    fighters?: Record<string, {
        angle?: number;
        position?: {
            x?: number;
            y?: number;
        };
        velocity?: {
            x?: number;
            y?: number;
        };
        angularVelocity?: number;
        pose?: {
            angle?: number;
            position?: {
                x?: number;
                y?: number;
            };
            joint?: string;
        }[];
        health?: number;
        stamina?: number;
        activeInjuries?: {
            type?: "bruise" | "laceration" | "fracture" | "dislocation" | "concussion" | "organ_damage" | "nerve_damage" | "vessel_rupture";
            id?: string;
            timestamp?: number;
            description?: string;
            partId?: "head" | "neck" | "torso_front" | "torso_back" | "torso_side_l" | "torso_side_r" | "arm_upper_l" | "arm_lower_l" | "hand_l" | "arm_upper_r" | "arm_lower_r" | "hand_r" | "leg_upper_l" | "leg_lower_l" | "foot_l" | "leg_upper_r" | "leg_lower_r" | "foot_r" | "groin";
            severity?: "minor" | "moderate" | "severe" | "critical";
            functionalLoss?: number;
        }[];
        currentAction?: string;
    }>;
}>;
export declare const WinProbabilitySchema: z.ZodObject<{
    winRate: z.ZodObject<{
        A: z.ZodNumber;
        B: z.ZodNumber;
        draw: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        A?: number;
        B?: number;
        draw?: number;
    }, {
        A?: number;
        B?: number;
        draw?: number;
    }>;
    finishTypeDistribution: z.ZodRecord<z.ZodString, z.ZodNumber>;
    avgDuration: z.ZodNumber;
    durationStdDev: z.ZodNumber;
    confidenceInterval: z.ZodObject<{
        lower: z.ZodNumber;
        upper: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        upper?: number;
        lower?: number;
    }, {
        upper?: number;
        lower?: number;
    }>;
}, "strip", z.ZodTypeAny, {
    winRate?: {
        A?: number;
        B?: number;
        draw?: number;
    };
    finishTypeDistribution?: Record<string, number>;
    avgDuration?: number;
    durationStdDev?: number;
    confidenceInterval?: {
        upper?: number;
        lower?: number;
    };
}, {
    winRate?: {
        A?: number;
        B?: number;
        draw?: number;
    };
    finishTypeDistribution?: Record<string, number>;
    avgDuration?: number;
    durationStdDev?: number;
    confidenceInterval?: {
        upper?: number;
        lower?: number;
    };
}>;
export declare const UserSettingsSchema: z.ZodObject<{
    statsScale: z.ZodDefault<z.ZodEnum<["relative", "absolute"]>>;
    simulationCount: z.ZodDefault<z.ZodNumber>;
    timeLimit: z.ZodDefault<z.ZodEnum<["1min", "5min", "10min", "unlimited"]>>;
    version: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    version?: number;
    timeLimit?: "1min" | "5min" | "10min" | "unlimited";
    statsScale?: "absolute" | "relative";
    simulationCount?: number;
}, {
    version?: number;
    timeLimit?: "1min" | "5min" | "10min" | "unlimited";
    statsScale?: "absolute" | "relative";
    simulationCount?: number;
}>;
export type UserSettings = z.infer<typeof UserSettingsSchema>;
export type ParsedBackground = z.infer<typeof ParsedBackgroundSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type BodySpec = z.infer<typeof BodySpecSchema>;
export type CoreStats = z.infer<typeof CoreStatsSchema>;
export type Mentality = z.infer<typeof MentalitySchema>;
export type Condition = z.infer<typeof ConditionSchema>;
export type Technique = z.infer<typeof TechniqueSchema>;
export type AnimalTraits = z.infer<typeof AnimalTraitsSchema>;
export type DetailedAnimalProfile = z.infer<typeof DetailedAnimalProfileSchema>;
export type FightContext = z.infer<typeof FightContextSchema>;
export type FightResult = z.infer<typeof FightResultSchema>;
export type ReplaySnapshot = z.infer<typeof ReplaySnapshotSchema>;
export type WinProbability = z.infer<typeof WinProbabilitySchema>;
//# sourceMappingURL=schemas.d.ts.map