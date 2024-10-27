import { WasteType } from "../constants";

export type EmbeddedSystemData = {
    isDoorOpened: boolean;
    height: number;
    embeddedSystemState: EmbeddedSystemState;
};

export type HomeState = {
    embeddedSystemData: Record<WasteType, EmbeddedSystemData>;
    errorMessage: string;
};
