import { createSlice } from "@reduxjs/toolkit";
import { HomeState } from "./type";
import { updateSensorsDataCase, setEmbeddedSystemStateCase, setErrorMessageCase } from "./home.reducers";
import { EmbeddedSystemState, WasteType } from "../constants";

const initialState: HomeState = {
    embeddedSystemData: {
        [WasteType.RECYCLABLE]: {
            isDoorOpened: false,
            height: 0,
            embeddedSystemState: EmbeddedSystemState.IDLE,
        },
        [WasteType.ORGANIC]: {
            isDoorOpened: false,
            height: 0,
            embeddedSystemState: EmbeddedSystemState.IDLE,
        },
        [WasteType.NON_RECYCLABLE]: {
            isDoorOpened: false,
            height: 0,
            embeddedSystemState: EmbeddedSystemState.IDLE,
        },
    },
    errorMessage: "",
};

// Create redux slice
export const homeSlice = createSlice({
    name: "HOME_STATE",
    initialState,
    reducers: {
        updateSensorsData: updateSensorsDataCase,
        setEmbeddedSystemState: setEmbeddedSystemStateCase,
        setErrorMessage: setErrorMessageCase,
    },
});

// Export actions
export const { updateSensorsData, setEmbeddedSystemState, setErrorMessage } = homeSlice.actions;

// Export reducer
export const homeReducer = homeSlice.reducer;
