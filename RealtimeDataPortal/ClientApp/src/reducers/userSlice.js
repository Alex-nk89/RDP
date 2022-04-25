import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    userFetchingStatus: 'idle'
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userInitialize: (state, action) => {
            state.user = action.payload;
            state.userFetchingStatus = 'confirmed';
        },
        userFetching: (state) => { state.userFetchingStatus = 'loading' },
        userFetchingError: (state) => { state.userFetchingStatus = 'error' },
    }
});

const { actions, reducer } = userSlice;

export default reducer;

export const {
    userInitialize,
    userFetching,
    userFetchingError
} = actions;

