import { DisplayState } from "@aristocrat/gdk/lib/base/state/display-state";
import { GDK } from "@aristocrat/gdk/lib/slot-base-mercury";
import { Scenery } from "@aristocrat/gdk/lib/slot-base-mercury";
import { applyDefaults } from "@aristocrat/gdk/lib/slot-base-mercury";
import { CounterScenery } from "@aristocrat/gdk/lib/slot-base-mercury/gdk/sceneries/counter-scenery";
import { ResultsScenery } from "@aristocrat/gdk/lib/slot-base-mercury/gdk/sceneries/results-scenery";
import { hasFeature, SpinReelSetResponse } from "@aristocrat/gdk/lib/slot-base/services/spin-reel-set-service";

/**
 * Used by scene configuration to pair scene type with configuration interface
 */
export interface Type {
    type: typeof FeatureRetriggerState;
    data: Config;
    transitions: {
        standard: string;
        feature: string;
    };
}

/**
 * State configuration interface
 */
export interface Config {
    feature: string;
    counterSceneryId: string;
    maxRetriggerCount: number;
    resultsSceneryId: string;
}

/**
 * State configuration defaults
 */
export const defaults = {
};

/**
 * Objects needed to construct this state
 */
export interface Dependencies {
    // States have these dependencies avaialable to them. Add those you need and remove the rest.
    // =================================================
    // sceneryMap: Map<string, Scenery> // Needed to access other scenery
    // contextTable: ContextTable // Needed to access contexts (account, jackpot, etc.)

    sceneryMap: Map<string, Scenery>;
}

/**
 * Creates a state
 * @param id the id of the state
 * @param transitions a map of transitions
 * @param config the configuration data
 * @param dependencies object containing any dependencies
 * @returns FeatureRetriggerState
 */
export function create(id: string, transitions: any, config: Config, dependencies: Dependencies): FeatureRetriggerState {
    applyDefaults(config, defaults);

    const resultsScenery = dependencies.sceneryMap.get(config.resultsSceneryId) as ResultsScenery;
    const counterScenery = dependencies.sceneryMap.get(config.counterSceneryId) as CounterScenery;

    return new FeatureRetriggerState(id, transitions, resultsScenery, counterScenery, config.feature, config.maxRetriggerCount);
}

/**
 * An example of a branching state
 */
export class FeatureRetriggerState extends DisplayState {

    /**
     * Get an array of transitions that this state has available
     * @returns an array of transition names
     */
    public static getTransitions(): string[] {
        return ["standard", "feature"];
    }

    private feature: string;
    private counterScenery: GDK.Scenery.CounterScenery;
    private maxRetriggerCount: number;
    private resultsScenery: GDK.Scenery.ResultsScenery;

    /**
     * Constructor
     * @param id name of the state
     * @param transitions optional map of transition ids to state ids
     * @param resultsScenery the scenery to find the play results
     */
    public constructor(
        id: string,
        transitions: { [key: string]: string },
        resultsScenery: GDK.Scenery.ResultsScenery,
        counterScenery: GDK.Scenery.CounterScenery,
        feature: string,
        maxRetriggerCount: number) {

        super(id, transitions);
        this.counterScenery = counterScenery;
        this.feature = feature;
        this.maxRetriggerCount = maxRetriggerCount;
        this.resultsScenery = resultsScenery;
    }

    /**
     * Gets the transition id of where this state is headed
     * @returns transition id
     */
    public getTargetTransition(): string {
        if (this.hasFeature() &&
            this.counterScenery.count < this.maxRetriggerCount + 1) {
            return "feature";
        }

        return "standard";
    }

    /**
     * @returns true if a feature is present
     */
    public hasFeature(): boolean {
        return hasFeature(this.resultsScenery.getResults<SpinReelSetResponse>(), this.feature);
    }
}

/**
 * Reference to the state
 */
export const state = FeatureRetriggerState;