import { createSlice } from "@reduxjs/toolkit";
import { HomeState } from "./type";
import { updateSensorsDataCase, setEmbeddedSystemStateCase } from "./home.reducers";
import { EmbeddedSystemState } from "../constants";

const initialState: HomeState = {
    isDoorOpened: false,
    height: 0,
    embeddedSystemState: EmbeddedSystemState.IDLE,
};

// Create redux slice
export const homeSlice = createSlice({
    name: "HOME_STATE",
    initialState,
    reducers: {
        updateSensorsData: updateSensorsDataCase,
        setEmbeddedSystemState: setEmbeddedSystemStateCase,
    },
});

// Export actions
export const { updateSensorsData, setEmbeddedSystemState } = homeSlice.actions;

// Export reducer
export const homeReducer = homeSlice.reducer;
