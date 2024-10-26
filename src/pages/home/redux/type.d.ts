import { WasteType } from "../constants";

export type EmbeddedSystemData = {
    isDoorOpened: boolean;
    height: number;
    embeddedSystemState: EmbeddedSystemState;
};

export type HomeState = Record<WasteType, EmbeddedSystemData>;
