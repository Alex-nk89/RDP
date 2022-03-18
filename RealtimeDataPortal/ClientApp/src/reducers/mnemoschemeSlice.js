import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    statusFetchingMnemoscheme: 'idle',
    title: '',
    mnemoscheme: ''
};

const mnemoschemeSlice = createSlice({
    name: 'mnemoscheme',
    initialState,
    reducers: {
        fetchingMnemoscheme: (state) => { state.statusFetchingMnemoscheme = 'loading' }
    }
});

const { actions, reducer } = mnemoschemeSlice;

export default reducer;

export const {
    fetchingMnemoscheme
} = actions;