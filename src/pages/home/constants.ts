import { joinPaths } from "@remix-run/router";
import { ROOT } from "@global/constants";

export const HOME_PAGE = "";
export const HOME_PAGE_PATH = joinPaths([ROOT, HOME_PAGE]);

export enum EmbeddedSystemFrontState {
    IDLE = "IDLE",
    COLLECTING_DATA = "COLLECTING_DATA",
    REQUESTING_OPEN_DOOR = "REQUESTING_OPEN_DOOR",
    WAITING_ESP32_MAIN = "WAITING_ESP32_MAIN",
    REMINDING = "REMINDING",
    THANKS = "THANKS",
}

export enum EmbeddedSystemState {
    IDLE = "IDLE",
    WAITING_FOR_OPEN_DOOR = "WAITING_FOR_OPEN_DOOR",
    OPENING_DOOR = "OPENING_DOOR",
    COLLECTING_DATA = "COLLECTING_DATA",
    CLAIM_REWARD = "CLAIM_REWARD",
    REQUESTING_FINISH = "REQUESTING_FINISH",
}

export enum WasteType {
    ORGANIC = "ORGANIC",
    RECYCLABLE = "RECYCLABLE",
    NON_RECYCLABLE = "NON_RECYCLABLE",
}

export const wasteTypeMap: Record<WasteType, string> = {
    [WasteType.ORGANIC]: "Hữu cơ",
    [WasteType.RECYCLABLE]: "Tái chế",
    [WasteType.NON_RECYCLABLE]: "Vô cơ",
};