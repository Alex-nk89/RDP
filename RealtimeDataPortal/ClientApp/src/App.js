import React, { useState, useEffect } from 'react';
import { Route } from 'react-router';
import { Container } from '@mantine/core';

import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home';
import { useRequest } from './hooks/request';

import "./style/_fonts.sass";

const App = () => {
    const { request, proccess } = useRequest();
    const [openedNavbar, setOpenNavbar] = useState(true);
    const [user, setUser] = useState({});

    useEffect(() => {
        request('GetUser')
            .then(user => setUser(user));
        //eslint-disable-next-line
    }, [])

    return (
        <>
            <nav>
                <Navbar openedNavbar={openedNavbar} />
            </nav>

            <main>
                <Header setOpenNavbar={setOpenNavbar} openedNavbar={openedNavbar} user={user} proccess={proccess} />
                <Container>
                    <Route exact path='/' component={Home} />
                </Container>
            </main>
        </>
    )
}

export default App;
