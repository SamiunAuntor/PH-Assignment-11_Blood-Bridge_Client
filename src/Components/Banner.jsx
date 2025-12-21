import React from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import useAuth from "../Hooks/useAuth";

import bannerImg2 from "../assets/banner-1.jpg";
import bannerImg3 from "../assets/banner-2.jpg";
import bannerImg1 from "../assets/banner-3.jpg";
import bannerImg4 from "../assets/banner-4.png";
import bannerImg5 from "../assets/banner-5.jpg";
import bannerImg6 from "../assets/banner-6.png";
import bannerImg7 from "../assets/banner-7.jpg";

const Banner = () => {

    const { user } = useAuth();

    return (
        <div className="w-full">

            {/* Swiper Slideshow */}
            <Swiper
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: false }}
                className="h-[250px] sm:h-[400px] md:h-[450px] lg:h-[750px]"
            >
                <SwiperSlide>
                    <img src={bannerImg1} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={bannerImg2} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={bannerImg3} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={bannerImg4} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={bannerImg5} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={bannerImg6} className="w-full h-full object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={bannerImg7} className="w-full h-full object-cover" />
                </SwiperSlide>
            </Swiper>

            {/* Banner Section */}
            <div className=" w-full bg-red-600 text-white py-16 px-6 flex flex-col items-center text-center shadow-lg">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-6 leading-snug">
                    Save Lives Today — <br className="md:hidden" />
                    Become a Blood Donor
                </h1>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">

                    {/* Show only when user not logged in */}
                    {!user && (
                        <Link
                            to="/register"
                            className="px-6 py-3 bg-white text-red-600 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition"
                        >
                            Join as a Donor
                        </Link>
                    )}

                    <Link
                        to="/search"
                        className="px-6 py-3 bg-red-700 text-white font-semibold rounded-xl shadow-md hover:bg-red-800 transition"
                    >
                        Search Donors
                    </Link>

                </div>
            </div>

        </div>
    );
};

export default Banner;
