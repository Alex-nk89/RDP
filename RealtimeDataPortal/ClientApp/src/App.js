import React, { useState, useEffect } from 'react';
import { Route } from 'react-router';
import { Container } from '@mantine/core';

import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import ExternalPage from './components/external-page/ExternalPage';
//import Page_404 from './components/Page_404';
import { useRequest } from './hooks/useRequest';

import "./style/_fonts.sass";
import "./css/bootstrap-reboot.min.css";

const App = () => {
    const { request, proccess, setProccess } = useRequest();
    const [openedNavbar, setOpenNavbar] = useState(true);
    const [user, setUser] = useState({});
    const [isConfigModeOn, setIsConfigModeOn] = useState(false);

    useEffect(() => {
        request('GetUser')
            .then(user => setUser(user))
            .then(() => setProccess('confirmed'));
        //eslint-disable-next-line
    }, [])

    return (
        <>
            <nav>
                <Navbar openedNavbar={openedNavbar} isConfigModeOn={isConfigModeOn}/>
            </nav>

            <main>
                <Header 
                    setOpenNavbar={setOpenNavbar} 
                    openedNavbar={openedNavbar} 
                    user={user} 
                    proccess={proccess} 
                    isConfigModeOn={isConfigModeOn}
                    setIsConfigModeOn={setIsConfigModeOn}/>
                <Container padding='md' size='md'>
                    <Route exact path='/' component={Home} />
                    <Route exact path="/Page"component={ExternalPage} />
                </Container>
            </main>
        </>
    )
}

export default App;
