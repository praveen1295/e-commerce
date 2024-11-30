import React from "react";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineChatAlt2,
  HiOutlineInformationCircle,
} from "react-icons/hi";
import ContactOptions from "./ContactMe";
import "./ContactUs.scss"; // Import CSS file for styling
import HomePage from "../chat/HomePage";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div
        className="relative w-full bg-cover bg-center py-32 md:py-48 flex items-center"
        style={{
          backgroundImage: "url('/assets/contactus.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 w-full px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-left text-white">
            <h4 className="text-3xl md:text-5xl font-bold mb-4">
              Get in Touch
            </h4>
            <small className="text-gray-300 text-lg md:text-2xl">
              Want to get in touch? We'd love to hear from you. Here's how you
              can reach us.
            </small>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 md:p-12">
            {/* Contact Options Section */}
            <div className="w-full p-4 flex flex-col items-start justify-center">
              <ContactOptions />
            </div>
          </div>
        </div>
      </div>
      {<HomePage />}
    </div>
  );
};

export default ContactUs;
