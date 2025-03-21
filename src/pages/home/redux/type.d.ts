import { EmbeddedSystemFrontState, EmbeddedSystemState, WasteType } from "../constants";

export type EmbeddedSystemFrontData = {
    hasObject: boolean;
    embeddedSystemFrontState?: EmbeddedSystemFrontState;
};

export type EmbeddedSystemData = {
    isDoorOpened: boolean;
    height: number;
    embeddedSystemState: EmbeddedSystemState;
};

export type QrData = {
    embeddedSystemIP: string;
    isCorrect: boolean;
    token: string;
};

export type HomeState = {
    embeddedSystemFrontData: EmbeddedSystemFrontData;
    embeddedSystemData: Record<WasteType, EmbeddedSystemData>;
    errorMessage: string;
    qrData?: QrData;
    classifyByUserName: string;
};
