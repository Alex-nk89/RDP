import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: 'add',
    editor: undefined,
    onReady: undefined
};

const mnemoschemeSlice = createSlice({
    name: 'mnemoscheme',
    initialState,
    reducers: {
        getTitle: (state, action) => { state.title = action.payload },
        setEditor: (state, action) => { state.editor = action.payload },
        setOnReady: (state, action) => { state.onReady = action.payload }
    }
});

const { actions, reducer } = mnemoschemeSlice;

export default reducer;

export const {
    getTitle,
    setEditor,
    setOnReady
} = actions;