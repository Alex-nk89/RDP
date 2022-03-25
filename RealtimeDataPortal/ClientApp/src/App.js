import React, { useEffect } from 'react';
import { Route } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from '@mantine/core';

import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import Graphics from './components/graphics/Graphics';
import TableRealtime from './components/tables/TableRealtime';
import Mnemoscheme from './components/mnemoscheme/Mnemoscheme';
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

    const dispatch = useDispatch();
    const { userFetchingStatus } = useSelector(state => state.user);
    const { isOpenNavbar } = useSelector(state => state.navbar);

    const app =
        <>
            <nav>
                <Navbar />
            </nav>

            <main className={`${isOpenNavbar ? 'navbarOpen' : ''}`}>
                <Header />

                <Container size='md' padding='xs' className='container'>
                    <Route exact path='/' component={Home} />
                    <Route exact path="/Graphics/:id" component={Graphics} />
                    <Route exact path="/Table/:id" component={TableRealtime} />
                    <Route exact path='/Mnemoscheme/:id' component={Mnemoscheme} />
                    <Route exact path="/Configurator/:operation/:id" component={Configurator} />
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
