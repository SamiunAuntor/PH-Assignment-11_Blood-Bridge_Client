import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../Components/Navbar';

const HomeLayout = () => {
    return (
        <div>
            <NavBar></NavBar>
            <Outlet />
        </div>
    );
};

export default HomeLayout;