/**
 * Exports the performer types. Used by configuration type checking
 */
export { PerformerType } from "./index-type";

/**
 * Exports the performer classes. Used by configuration and dependencies/extensions to reference the class.
 */
import * as Performer from "./index-class";
export { Performer }; // For configuration use: "GDK.Performer.ExamplePerformer"
export * from "./index-class"; // For class extension use: "GDK.ExamplePerformer"

/**
 * Exports the methods, interfaces, and classes needed by the performer factories
 */
import * as PerformerFactories from "./index-factory";
export { PerformerFactories };