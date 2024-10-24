import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { HomeState } from "./type";

export const updateSensorsDataCase: CaseReducer<HomeState, PayloadAction<Pick<HomeState, "isDoorOpened" | "height">>> = (state, action) => {
    state.isDoorOpened = action.payload.isDoorOpened;
    state.height = action.payload.height;
};

export const setEmbeddedSystemStateCase: CaseReducer<HomeState, PayloadAction<HomeState["embeddedSystemState"]>> = (state, action) => {
    state.embeddedSystemState = action.payload;
};
