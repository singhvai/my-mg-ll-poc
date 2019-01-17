import { Performer } from "@aristocrat/gdk/lib/slot-base-mercury";
import { Scenery } from "@aristocrat/gdk/lib/slot-base-mercury";
import { applyDefaults } from "@aristocrat/gdk/lib/slot-base-mercury";
import { ExampleScenery } from "../sceneries/example-scenery";

/**
 * Used by scene configuration to pair performer type with configuration interface
 */
export interface Type {
    type: typeof ExamplePerformer;
    data: Config;
}

/**
 * Performer configuration interface
 */
export interface Config {
    exampleSceneryId: string;
    exampleValue?: number;
}

/**
 * Performer configuration defaults
 */
export let defaults = {
    exampleValue: 1
};

/**
 * Objects needed to construct this performer
 */
export interface Dependencies {
    // Performers have these dependencies avaialable to them. Add those you need and remove the rest.
    // =================================================
    // sceneryMap: Map<string, Scenery> // Needed to access other scenery
    // fileSystem: FileSystem // Needed to access files
    // contextTable: ContextTable // Needed to access contexts (account, jackpot, etc.)

    sceneryMap: Map<string, Scenery>;
}

/**
 * Creates a performer object
 * @param id the id of the performer
 * @param config the configuration data
 * @param dependencies object containing any dependencies
 * @returns ExamplePerformer
 */
export function create(id: string, config: Config, dependencies: Dependencies): ExamplePerformer {
    applyDefaults(config, defaults);

    const exampleScenery = dependencies.sceneryMap.get(config.exampleSceneryId) as ExampleScenery;

    return new ExamplePerformer(id, exampleScenery);
}

/**
 * This is an example of how to make a custom performer
 */
export class ExamplePerformer extends Performer {
    protected exampleScenery: ExampleScenery;

    /**
     * Constructor
     * @param id the performer id
     * @param exampleScenery an example of how scenery is referenced by a performer
     */
    public constructor(id: string, exampleScenery: ExampleScenery) {
        super(id);
        this.exampleScenery = exampleScenery;
    }

    /**
     * This is an example of a handler
     * @param done called on completion
     */
    public doSomething(done: () => void) {
        // TODO: Add code to do something, then call done when complete

        // this.exampleScenery.example = 123; // Example of accessing a scenery

        done();
    }

    // Naming guidelines for performer handlers:
    // - Handlers should start with a present tense verb. For example
    // - Handlers don't reference the event that they expect to be triggered by. For example, use "incrementBet" instead of "incrementButtonClicked"
    // - Handlers don't start with "on". For example, use "refresh" instead of "onBetChange"
    // - Handlers should be named "refresh" in the case of a general update. For example, a bet has changed and you need to refresh the scenery.
}

/**
 * Reference to the performer
 */
export const performer = ExamplePerformer;