import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    statusFetchingMnemoscheme: 'idle',
    title: '',
    mnemoschemeData: null
};

const mnemoschemeSlice = createSlice({
    name: 'mnemoscheme',
    initialState,
    reducers: {
        fetchingMnemoscheme: (state) => { state.statusFetchingMnemoscheme = 'loading' },
        fetchingMnemoschemeConfirmed: (state) => { state.statusFetchingMnemoscheme = 'confirmed' },
        fetchingMnemoschemeError: (state) => { state.statusFetchingMnemoscheme = 'error' },
        initializeMnemoscheme: (state, action) => {
            state.statusFetchingMnemoscheme = 'confirmed';
            state.mnemoschemeData = action.payload;
        }
    }
});

const { actions, reducer } = mnemoschemeSlice;

export default reducer;

export const {
    fetchingMnemoscheme,
    fetchingMnemoschemeConfirmed,
    fetchingMnemoschemeError,
    initializeMnemoscheme
} = actions;