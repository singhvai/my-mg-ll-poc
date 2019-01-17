import { GDK, SceneConfig as Config } from "@aristocrat/gdk/lib/slot-base-mercury";
import * as Local from "./local";
export { GDK, Local };

export type PerformerType =
    | GDK.PerformerType;

export type SceneryType =
    | GDK.SceneryType;

export type StateType =
    | GDK.StateType
    | Local.StateType;

export type SceneConfig = Config<SceneryType, PerformerType, StateType>;

