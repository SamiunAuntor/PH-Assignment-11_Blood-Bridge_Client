import React, { useEffect, useState } from 'react';
import useAuth from '../Hooks/useAuth';
import Loading from '../Components/Loading';
import Banner from '../Components/Banner';
import ContactUsSection from '../Components/ContactUsSection';
import FeaturedSection from '../Components/FeaturedSection';




const HomePage = () => {

    const { loading } = useAuth();

    // State to manage minimum loading time
    const [pageLoading, setPageLoading] = useState(true);

    // Ensure loading spinner shows for at least 0.5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setPageLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Show loading spinner if auth state is loading or minimum time not met
    if (loading || pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loading />
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            <Banner></Banner>
            <FeaturedSection></FeaturedSection>
            <ContactUsSection></ContactUsSection>
        </div>
    );
};

export default HomePage;