import { createStore, combineReducers } from 'redux';
import user from '../reducers/user';
import navbar from '../reducers/navbar';
import configurator from '../reducers/configurator';

const store = createStore(
    combineReducers({ user, navbar, configurator }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;