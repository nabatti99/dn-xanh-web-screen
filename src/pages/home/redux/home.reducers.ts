import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { EmbeddedSystemData, EmbeddedSystemFrontData, HomeState, QrData } from "./type";
import { EmbeddedSystemFrontState, EmbeddedSystemState, WasteType } from "../constants";

// Embedded System Front
export const updateSensorsFrontDataCase: CaseReducer<
    HomeState,
    PayloadAction<{
        data: Pick<EmbeddedSystemFrontData, "hasObject">;
    }>
> = (state, action) => {
    state.embeddedSystemFrontData = {
        ...state.embeddedSystemFrontData,
        hasObject: action.payload.data.hasObject,
    };
};

export const setEmbeddedSystemFrontStateCase: CaseReducer<
    HomeState,
    PayloadAction<{
        embeddedSystemFrontState: EmbeddedSystemFrontState;
    }>
> = (state, action) => {
    state.embeddedSystemFrontData.embeddedSystemFrontState = action.payload.embeddedSystemFrontState;
};

// Embedded System Main
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
        embeddedSystemState: EmbeddedSystemState;
    }>
> = (state, action) => {
    state.embeddedSystemData[action.payload.wasteType] = {
        ...state.embeddedSystemData[action.payload.wasteType],
        embeddedSystemState: action.payload.embeddedSystemState,
    };
};

export const setQrDataCase: CaseReducer<HomeState, PayloadAction<QrData | undefined>> = (state, action) => {
    state.qrData = action.payload;
};

export const setClassifyUserNameCase: CaseReducer<HomeState, PayloadAction<string>> = (state, action) => {
    state.classifyByUserName = action.payload;
};

export const setErrorMessageCase: CaseReducer<
    HomeState,
    PayloadAction<{
        errorMessage: string;
    }>
> = (state, action) => {
    state.errorMessage = action.payload.errorMessage;
};
