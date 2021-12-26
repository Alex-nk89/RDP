import React, { useState } from 'react';
import { Route } from 'react-router';
import { Container } from '@mantine/core';

import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Home from './components/home/Home'

import "./style/_fonts.sass";

const App = () => {
    const [openedNavbar, setOpenNavbar] = useState(true);

    return (
        <>
            <nav>
                <Navbar openedNavbar={openedNavbar} />
            </nav>

            <main>
                <Header setOpenNavbar={setOpenNavbar} openedNavbar={openedNavbar} />
                <Container>
                    <Route exact path='/' component={Home} />
                </Container>
            </main>
        </>
    )
}

export default App;
