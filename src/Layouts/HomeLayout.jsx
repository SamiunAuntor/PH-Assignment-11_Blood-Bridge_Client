import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '../Components/Navbar';
import Footer from '../Components/Footer';
import ScrollToTop from '../Components/ScrollToTop';

const HomeLayout = () => {
    return (
        <div className='max-w-[1440px]'>
            <ScrollToTop />
            <NavBar></NavBar>
            <Outlet />
            <Footer></Footer>
        </div>
    );
};

export default HomeLayout;