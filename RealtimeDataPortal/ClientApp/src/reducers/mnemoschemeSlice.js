import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    statusFetchingMnemoscheme: 'idle',
    id: 0,
    title: '',
    mnemoschemeData: null
};

const mnemoschemeSlice = createSlice({
    name: 'mnemoscheme',
    initialState,
    reducers: {
        fetchingMnemoscheme: (state) => { state.statusFetchingMnemoscheme = 'loading' },
        fetchingMnemoschemeError: (state) => { state.statusFetchingMnemoscheme = 'error' },
        initializeMnemoscheme: (state, action) => {
            state.statusFetchingMnemoscheme = 'confirmed';
            state.id = action.payload[0].id;
            state.title = action.payload[0].mnemoschemeName;
            state.mnemoschemeData = action.payload[0].mnemoschemeContain;
        }
    }
});

const { actions, reducer } = mnemoschemeSlice;

export default reducer;

export const {
    fetchingMnemoscheme,
    fetchingMnemoschemeError,
    initializeMnemoscheme
} = actions;