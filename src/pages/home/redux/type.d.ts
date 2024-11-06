import { WasteType } from "../constants";

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
    embeddedSystemData: Record<WasteType, EmbeddedSystemData>;
    errorMessage: string;
    qrData?: QrData;
    classifyByUserName: string;
};
