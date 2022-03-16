import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: 'add',
};

const mnemoschemeSlice = createSlice({
    name: 'mnemoscheme',
    initialState,
    reducers: {
        getTitle: (state, action) => { state.title = action.payload },
    }
});

const { actions, reducer } = mnemoschemeSlice;

export default reducer;

export const {
    getTitle
} = actions;