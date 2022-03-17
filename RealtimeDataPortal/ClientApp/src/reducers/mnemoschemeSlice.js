import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    canvas: ''
};

const mnemoschemeSlice = createSlice({
    name: 'mnemoscheme',
    initialState,
    reducers: {
        setCanvas: (state, action) => { console.log(action.payload); state.canvas = action.payload }
    }
});

const { actions, reducer } = mnemoschemeSlice;

export default reducer;

export const {
    setCanvas,
} = actions;