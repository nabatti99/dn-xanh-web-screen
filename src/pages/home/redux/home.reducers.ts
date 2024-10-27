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
    state.embeddedSystemData[action.payload.wasteType] = {
        ...state.embeddedSystemData[action.payload.wasteType],
        isDoorOpened: action.payload.data.isDoorOpened,
        height: action.payload.data.height,
    };
};

export const setEmbeddedSystemStateCase: CaseReducer<
    HomeState,
    PayloadAction<{
        wasteType: WasteType;
        embeddedSystemState: EmbeddedSystemData["embeddedSystemState"];
    }>
> = (state, action) => {
    state.embeddedSystemData[action.payload.wasteType] = {
        ...state.embeddedSystemData[action.payload.wasteType],
        embeddedSystemState: action.payload.embeddedSystemState,
    };
};

export const setErrorMessageCase: CaseReducer<
    HomeState,
    PayloadAction<{
        errorMessage: string;
    }>
> = (state, action) => {
    state.errorMessage = action.payload.errorMessage;
};
