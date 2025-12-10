import React from "react";
import { showToast } from "../Utilities/ToastMessage";

const ContactUsSection = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast("Thank you for reaching out! We will contact you soon.", "success");
        e.target.reset();
    };

    return (
        <div className="w-full bg-white py-16 px-6">

            {/* Heading */}
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-6">
                    Contact Us
                </h2>
                <p className="text-gray-600 mb-10">
                    Have questions or need support? Reach out to us anytime.
                    We’re here to help you save lives.
                </p>
            </div>

            {/* Contact Card */}
            <div className="max-w-3xl mx-auto bg-red-100 shadow-xl rounded-2xl p-8">

                {/* Phone */}
                <div className="text-center mb-8">
                    <p className="text-lg text-gray-700 font-semibold">Call Us</p>
                    <h3 className="text-2xl font-bold text-red-600">+880 122-754-6576</h3>
                </div>

                <hr className="my-8 border-red-200" />

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        className="px-4 py-3 bg-white border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                        className="px-4 py-3 bg-white border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows={5}
                        required
                        className="px-4 py-3 bg-white border-2 border-red-300 focus:border-red-500 rounded-md outline-none"
                    ></textarea>

                    <button
                        type="submit"
                        className="px-4 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                    >
                        Send Message
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ContactUsSection;
