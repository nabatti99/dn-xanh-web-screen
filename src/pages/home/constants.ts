import { joinPaths } from "@remix-run/router";
import { ROOT } from "@global/constants";

export const HOME_PAGE = "";
export const HOME_PAGE_PATH = joinPaths([ROOT, HOME_PAGE]);

export enum EmbeddedSystemState {
    IDLE = "IDLE",
    OPENING_DOOR = "OPENING_DOOR",
    COLLECTING_DATA = "COLLECTING_DATA",
    SERVER_PROCESSING = "SERVER_PROCESSING",
    CLAIM_REWARD = "CLAIM_REWARD",
}

export enum WasteType {
    RECYCLABLE = "RECYCLABLE",
    ORGANIC = "ORGANIC",
    NON_RECYCLABLE = "NON_RECYCLABLE",
}