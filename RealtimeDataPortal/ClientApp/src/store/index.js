import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/userSlice';
import navbar from '../reducers/navbarSlice';
import configurator from '../reducers/configuratorSlice';
import mnemoscheme from '../reducers/mnemoschemeSlice';
import graphics from '../reducers/graphicsSlice';
import customTable from '../reducers/customTableSlice';

const store = configureStore({
    reducer: { user, navbar, configurator, graphics, mnemoscheme, customTable },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;