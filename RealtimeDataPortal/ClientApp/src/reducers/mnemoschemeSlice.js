import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    statusFetchingMnemoscheme: 'idle',
    id: 0,
    title: '',
    mnemoschemeData: {},
};

const mnemoschemeSlice = createSlice({
    name: 'mnemoscheme',
    initialState,
    reducers: {
        fetchingMnemoscheme: (state) => { state.statusFetchingMnemoscheme = 'loading' },
        fetchingMnemoschemeConfirmed: (state) => { state.statusFetchingMnemoscheme = 'confirmed' },
        fetchingMnemoschemeError: (state) => { state.statusFetchingMnemoscheme = 'error' },
        initializeMnemoscheme: (state, action) => {
            state.id = action.payload[0].id;
            state.title = action.payload[0].mnemoschemeName;
            state.mnemoschemeData = action.payload[0].mnemoschemeContain;
        },
    }
});

const { actions, reducer } = mnemoschemeSlice;

export default reducer;

export const {
    fetchingMnemoscheme,
    fetchingMnemoschemeConfirmed,
    fetchingMnemoschemeError,
    initializeMnemoscheme,
} = actions;