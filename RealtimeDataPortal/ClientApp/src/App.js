import React, { useState, useEffect } from 'react';
import { Route } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mantine/core';

import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Graphics from './components/graphics/Graphics';
import TableRealtime from './components/tables/TableRealtime';
//import Page_404 from './components/Page_404';
import ErrorsPage from './components/errors-page/ErrorsPage';
import Configurator from './components/configurator/Configurator';
import { Administrstor } from './components/administrator/Administrator';
import AppPreloader from './components/loader/appPreloader';
import { useRequest } from './hooks/useRequest';

import { userInitialize, userFetching, userFetchingError } from './actions';

import "./css/bootstrap-reboot.min.css";


const App = () => {
    const { request, error } = useRequest();
    const [openedNavbar, setOpenNavbar] = useState(true);
    const [isConfigModeOn, setIsConfigModeOn] = useState(false);
    const [isAdminModeOn, setIsAdminModeOn] = useState(false);
    const [updateNavbar, setUpdateNavbar] = useState(false);

    const dispatch = useDispatch();
    const { userFetchingStatus } = useSelector(state => state);

    const updatingNavbar = () => setUpdateNavbar(!updateNavbar);

    const app =
        <>
            <nav>
                <Navbar
                    openedNavbar={openedNavbar}
                    isConfigModeOn={isConfigModeOn}
                    isAdminModeOn={isAdminModeOn}
                    updateNavbar={updateNavbar}
                    updatingNavbar={updatingNavbar}
                />
            </nav>

            <main className={`${openedNavbar ? 'navbarOpen' : ''}`}>
                <Header
                    setOpenNavbar={setOpenNavbar}
                    openedNavbar={openedNavbar}
                    isConfigModeOn={isConfigModeOn}
                    setIsConfigModeOn={setIsConfigModeOn}
                    isAdminModeOn={isAdminModeOn}
                    setIsAdminModeOn={setIsAdminModeOn} />
                <Container size='md' className='container'>
                    <Route exact path='/' component={Home} />
                    <Route exact path="/Graphics/:id" component={Graphics} />
                    <Route exact path="/Table/:id" component={TableRealtime} />
                    <Route exact path="/Configurator/:operation/:id"
                        render={props => <Configurator updatingNavbar={updatingNavbar} {...props} />} />
                    <Route exact path="/Administrator/:operation" component={Administrstor} />
                    <Route exact path="/Error" component={ErrorsPage} />
                </Container>
            </main>
        </>


    useEffect(() => {
        dispatch(userFetching());

        request('GetUser')
            .then((user) => {
                dispatch(userInitialize(user));
                //setProccess('confirmed');
            })
            .catch(() => dispatch(userFetchingError()));
        //eslint-disable-next-line
    }, [])

    switch (userFetchingStatus) {
        case 'loading':
            return <main><AppPreloader /></main>
        case 'confirmed':
            return app;
        case 'error':
            return <main><ErrorsPage {...error} /></main>
        default:
            return null;
    }
}

export default App;
