/**
 * Exports the state types. Used by configuration type checking
 */
export { StateType } from "./index-type";

/**
 * Exports the state classes. Used by configuration and dependencies/extensions to reference the class.
 */
import * as state from "./index-class";
export { state }; // For configuration use: "GDK.state.ExampleState"
export * from "./index-class"; // For class extension use: "GDK.ExampleState"

/**
 * Exports the methods, interfaces, and classes needed by the state factories
 */
import * as StateFactories from "./index-factory";
export { StateFactories };