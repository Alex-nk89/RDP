import { createStore, combineReducers } from 'redux';
import user from '../reducers/user';
import navbar from '../reducers/navbar';
import configurator from '../reducers/configurator';
import graphics from '../reducers/graphics';

const store = createStore(
    combineReducers({ user, navbar, configurator, graphics }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;