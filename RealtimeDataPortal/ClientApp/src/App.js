import React, { useState, useEffect } from 'react';
import { Route } from 'react-router';
import { Container } from '@mantine/core';

import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import ExternalPage from './components/external-page/ExternalPage';
//import Page_404 from './components/Page_404';
import ErrorsPage from './components/errors-page/ErrorsPage';
import Configurator from './components/configurator/Configurator';
import AppPreloader from './components/loader/appPreloader';
import { useRequest } from './hooks/useRequest';

import "./style/_fonts.sass";
import "./css/bootstrap-reboot.min.css";

const App = () => {
    const { request, proccess, setProccess, error } = useRequest();
    const [openedNavbar, setOpenNavbar] = useState(true);
    const [user, setUser] = useState({});
    const [isConfigModeOn, setIsConfigModeOn] = useState(false);

    const app =
        <>
            <nav>
                <Navbar openedNavbar={openedNavbar} isConfigModeOn={isConfigModeOn} />
            </nav>

            <main>
                <Header
                    setOpenNavbar={setOpenNavbar}
                    openedNavbar={openedNavbar}
                    user={user}
                    isConfigModeOn={isConfigModeOn}
                    setIsConfigModeOn={setIsConfigModeOn} />
                <Container size='md' className='container'>
                    <Route exact path='/' component={Home} />
                    <Route exact path="/Page/:id" component={ExternalPage} />
                    <Route exact path="/Configurator/:operation/:id" component={Configurator} />
                    <Route exact path="/Error" component={ErrorsPage} />
                </Container>
            </main>
        </>


    useEffect(() => {
        request('GetUser')
            .then((user) => {
                if (Object.keys(user).length !== 0) {
                    setUser(user);
                    setProccess('confirmed');
                }
            });
        //eslint-disable-next-line
    }, [])

    switch (proccess) {
        case 'loading':
            return <main><AppPreloader /></main>
        case 'confirmed':
            return app;
        case 'error':
            return <ErrorsPage {...error} />
        default:
            return null;
    }
}

export default App;
