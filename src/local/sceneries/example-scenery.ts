import { applyDefaults, GDK, Scenery } from "@aristocrat/gdk/lib/slot-base-mercury";

/**
 * Used by scene configuration to pair scene type with configuration interface
 */
export interface Type {
    type: typeof ExampleScenery;
    data: Config;
}

/**
 * Scenery configuration interface
 */
export interface Config {
    degreesPerSecond: number;
    timelineSceneryId: string;
}

/**
 * Scenery configuration defaults
 */
export const defaults = {
    degreesPerSecond: 1
};

/**
 * Objects needed to construct this scenery
 */
// tslint:disable-next-line
export interface Dependencies {
    // Sceneries have these dependencies avaialable to them. Add those you need and remove the rest.
    // =================================================
    // eventManager: EventManager // Needed to post events to the game (for performers)
    // hostEventManager: EvenetManager // Needed to post and receieve events from the host
    // sceneryMap: Map<string, Scenery> // Needed to access other scenery
    // fileSystem: FileSystem // Needed to access files
    // contextTable: ContextTable // Needed to access contexts (account, jackpot, etc.)

    sceneryMap: Map<string, Scenery>;
}

/**
 * Creates a scenery object
 * @param id the id of the scenery
 * @param config the configuration data
 * @param dependencies object containing any dependencies
 * @returns ExampleScenery
 */
export function create(id: string, config: Config, dependencies: Dependencies): ExampleScenery {
    applyDefaults(config, defaults);

    const timelineScenery = dependencies.sceneryMap.get(config.timelineSceneryId) as GDK.Scenery.TimelineScenery;

    return new ExampleScenery(id, timelineScenery, config.degreesPerSecond);
}

/**
 * Creates the events created by an object
 * @param id the id of the scenery
 * @param config the configuration data
 * @param dependencies object containing any dependencies
 * @returns a string array of events
 */
export function getEvents(id: string, config: Config, dependencies: Dependencies): string[] {
    return [
        // TODO: Add any custom events here. These are used by validation

        // Naming guidelines for scenery events:
        // - Events start with the scenery id
        // - Do not include "on" in an event name, for example, "Clicked" instead of "onClicked"
        // - Events are upper case for each word. For example use "ColorUpdated" instead of "colorUpdated"
        // - Event use past tense verbs. For example, use "Clicked" instead of "Click"
        // - Events use the word "Changed" for any sort of change. For example, use "BetChanged" instead of "BetUpdated" or "BetAdjusted"
    ];
}

/**
 * This is an example of how to make a custom scenery
 */
export class ExampleScenery extends Scenery {
    protected timelineScenery: GDK.Scenery.TimelineScenery;
    protected degreesPerSecond: number;

    /**
     * Constructor
     * @param id the scenery id
     * @param exampleValue an example of a value needed by this scenery
     */
    public constructor(id: string, timelineScenery: GDK.Scenery.TimelineScenery, degreesPerSecond: number) {
        super(id);
        this.timelineScenery = timelineScenery;
        this.degreesPerSecond = degreesPerSecond;
    }

    public load(): Promise<any> {

        return super.load();
    }
}

/**
 * Reference to the scenery
 */
export const scenery = ExampleScenery;