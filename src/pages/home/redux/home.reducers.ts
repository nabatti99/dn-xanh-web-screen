import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { EmbeddedSystemData, HomeState } from "./type";
import { WasteType } from "../constants";

export const updateSensorsDataCase: CaseReducer<
    HomeState,
    PayloadAction<{
        wasteType: WasteType;
        data: Pick<EmbeddedSystemData, "isDoorOpened" | "height">;
    }>
> = (state, action) => {
    state[action.payload.wasteType].isDoorOpened = action.payload.data.isDoorOpened;
    state[action.payload.wasteType].height = action.payload.data.height;
};

export const setEmbeddedSystemStateCase: CaseReducer<
    HomeState,
    PayloadAction<{
        wasteType: WasteType;
        embeddedSystemState: EmbeddedSystemData["embeddedSystemState"];
    }>
> = (state, action) => {
    state[action.payload.wasteType].embeddedSystemState = action.payload.embeddedSystemState;
};
