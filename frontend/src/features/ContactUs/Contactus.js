import React, { useState } from "react";
import CommonButton from "../common/CommonButton";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineChatAlt2,
  HiOutlineInformationCircle,
} from "react-icons/hi";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitEnQuiry = (e) => {
    e.preventDefault();
    // Here you can handle form submission, such as sending the data to a server
    // Reset the form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2 p-4">
          <div className="text-center mb-8">
            <h4 className="text-3xl font-bold">Contact Info</h4>
            <small className="text-gray-500">
              Please note our office address is not a shop and is not open to
              the public
            </small>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 p-2">
              <div className="bg-gray-200 h-52 rounded-lg flex flex-col justify-center items-center">
                <HiOutlineUser className="text-3xl mb-2" />
                <h3 className="text-lg font-bold">CALL US</h3>
                <p className="text-sm text-gray-700">Enter your full name</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <div className="bg-gray-300 h-52 rounded-lg flex flex-col justify-center items-center">
                <HiOutlineMail className="text-3xl mb-2" />
                <h3 className="text-lg font-bold">EMAIL US</h3>
                <p className="text-sm text-gray-700">
                  Enter your email address
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <div className="bg-gray-400 h-52 rounded-lg flex flex-col justify-center items-center">
                <HiOutlineInformationCircle className="text-3xl mb-2" />
                <h3 className="text-lg font-bold">HEAD OFFICE</h3>
                <p className="text-sm text-gray-700">
                  Enter the subject of your message
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 p-2">
              <div className="bg-gray-500 h-52 rounded-lg flex flex-col justify-center items-center">
                <HiOutlineChatAlt2 className="text-3xl mb-2" />
                <h3 className="text-lg font-bold">BIOTRONIX</h3>
                <p className="text-sm text-gray-700">Enter your message here</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-4">
          <div className="text-center mb-8">
            <h4 className="text-3xl font-bold">Send Us a Message</h4>
          </div>
          <form
            onSubmit={handleSubmitEnQuiry}
            className="bg-gray-300 p-6 rounded-lg"
          >
            <div className="mb-4">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="6"
              ></textarea>
            </div>
            <div className="flex items-center justify-between">
              <CommonButton
                type="submit"
                text={"Send Enquiry"}
                width="w-full"
                bgColor="bg-green-500"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
