import { createSlice } from "@reduxjs/toolkit";
import { HomeState } from "./type";
import {
    updateSensorsDataCase,
    setEmbeddedSystemStateCase,
    setErrorMessageCase,
    setQrDataCase,
    setClassifyUserNameCase,
    updateSensorsFrontDataCase,
    setEmbeddedSystemFrontStateCase,
} from "./home.reducers";
import { EmbeddedSystemState, WasteType } from "../constants";

const initialState: HomeState = {
    embeddedSystemFrontData: {
        hasObject: false,
    },
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
    qrData: undefined,
    classifyByUserName: "",
};

// Create redux slice
export const homeSlice = createSlice({
    name: "HOME_STATE",
    initialState,
    reducers: {
        updateSensorsFrontData: updateSensorsFrontDataCase,
        setEmbeddedSystemFrontState: setEmbeddedSystemFrontStateCase,
        updateSensorsData: updateSensorsDataCase,
        setEmbeddedSystemState: setEmbeddedSystemStateCase,
        setErrorMessage: setErrorMessageCase,
        setQrData: setQrDataCase,
        setClassifyUserName: setClassifyUserNameCase,
    },
});

// Export actions
export const { updateSensorsFrontData, setEmbeddedSystemFrontState, updateSensorsData, setEmbeddedSystemState, setErrorMessage, setQrData, setClassifyUserName } =
    homeSlice.actions;

// Export reducer
export const homeReducer = homeSlice.reducer;
