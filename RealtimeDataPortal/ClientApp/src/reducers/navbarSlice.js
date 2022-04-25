import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    configMode: false,
    adminMode: false,
    isOpenNavbar: true,
    updateNavbar: true
};

const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        toogleConfigMode: (state) => { state.configMode = !state.configMode },
        toogleAdminMode: (state) => { state.adminMode = !state.adminMode },
        toogleNavbarState: (state) => { state.isOpenNavbar = !state.isOpenNavbar },
        updateNavbar: (state) => { state.updateNavbar = !state.updateNavbar }
    }
});

const { actions, reducer } = navbarSlice;

export default reducer;

export const {
    toogleConfigMode,
    toogleAdminMode,
    toogleNavbarState,
    updateNavbar
} = actions;