import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonButton from "../common/CommonButton";
import ThankYouModal from "../common/ThankYouModal";
import { useLocation } from "react-router-dom";

export default function SubscribeForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    other: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("submitForm") === "true") {
      setIsModalOpen(true);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    // Optionally, remove query params from the URL
    const newUrl = window.location.pathname;
    window.history.replaceState(null, null, newUrl);
  };

  return (
    <>
      <form
        action={`https://formsubmit.co/${process.env.REACT_APP_ADMIN_EMAIL}`}
        method="POST"
        enctype="multipart/form-data"
        // onSubmit={handleSubmit}
        className="shadow-md rounded p-8 bg-green-100"
      >
        <input
          type="hidden"
          id="nextInput"
          name="_next"
          value={`${
            process.env.REACT_APP_FRONTEND_URL + location.pathname
          }?submitForm=true`}
        />
        <input type="hidden" name="_captcha" value="false" />

        <div className="mb-4">
          <label
            className="hidden text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Your Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="hidden text-gray-700 text-sm font-bold mb-2"
            htmlFor="company"
          >
            Your Company Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="company"
            name="company"
            type="text"
            placeholder="Your Company Name"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="mb-6">
          <label
            className="hidden text-gray-700 text-sm font-bold mb-2"
            htmlFor="other"
          >
            Other
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="other"
            name="other"
            type="text"
            placeholder="Other"
            value={formData.other}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <CommonButton type={"submit"} text={"Submit"} />
        </div>
      </form>

      <ThankYouModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
}
