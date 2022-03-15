import { configureStore } from '@reduxjs/toolkit';
import user from '../reducers/user';
import navbar from '../reducers/navbar';
import configurator from '../reducers/configurator';
import graphics from '../reducers/graphics';
import mnemoscheme from '../reducers/mnemoschemeSlice';

const store = configureStore({
    reducer: { user, navbar, configurator, graphics, mnemoscheme },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production'
})

export default store;