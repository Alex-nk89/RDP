import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    attributesGraphic: {},
    tabsNames: [],
    statusFetchingGraphic: 'idle',
    activeTab: 0,
    isScale: false,
    isVisibleTable: true,
    isDoubleView: false
};

const configuratorSlice = createSlice({
    name: 'graphics',
    initialState,
    reducers: {
        initialStateGraphics: (state) => {
            state.activeTab = 0;
            state.attributesGraphic = {};
            state.isDoubleView = false;
            state.isScale = false;
            state.isVisibleTable = true;
            state.statusFetchingGraphic = 'idle';
            state.tabsNames = [];
            state.statusFetchingGraphic = 'loading';
        },
        getAttributesForGraphic: (state, action) => {
            state.attributesGraphic = action.payload;
            state.tabsNames = Array.from(new Set(action.payload.map(item => item.typeName)));
            state.statusFetchingGraphic = 'confirmed'
        },
        fetchedAttributesGraphicError: (state) => { state.statusFetchingGraphic = 'error'; },
        toggleIsScale: (state) => { state.isScale = !state.isScale; },
        toggleIsVisibleTable: (state) => { state.isVisibleTable = !state.isVisibleTable; },
        toggleIsDoubleView: (state) => { state.isDoubleView = !state.isDoubleView; },
        setActiveTab: (state, action) => { state.activeTab = action.payload; }
    }
});

const { actions, reducer } = configuratorSlice;

export default reducer;

export const {
    initialStateGraphics,
    getAttributesForGraphic,
    fetchedAttributesGraphicError,
    toggleIsScale,
    toggleIsVisibleTable,
    toggleIsDoubleView,
    setActiveTab
} = actions;