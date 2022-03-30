import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    operation: '',
    componentInfo: {},
    statusFetchingComponentInfo: 'idle'
};

const configuratorSlice = createSlice({
    name: 'configurator',
    initialState,
    reducers: {
        operationInitialize: (state, action) => { state.operation = action.payload },
        fetchingComponentInfo: state => { state.statusFetchingComponentInfo = 'loading' },
        fetchingComponentInfoError: state => {
            state.statusFetchingComponentInfo = 'error';
            state.componentInfo = {};
        },
        initializeComponentInfo: (state, action) => {
            state.statusFetchingComponentInfo = 'idle';
            state.componentInfo = action.payload;
        }
    }
});

const { actions, reducer } = configuratorSlice;

export default reducer;

export const {
    operationInitialize,
    fetchingComponentInfo,
    fetchingComponentInfoError,
    initializeComponentInfo
} = actions;