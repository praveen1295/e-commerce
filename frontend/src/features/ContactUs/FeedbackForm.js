import React, { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import CommonButton from "../common/CommonButton";

const FeedbackForm = ({ setIsSendFeedback }) => {
  const location = useLocation();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject && description && rating && recommendation) {
      // Handle form submission logic here
      setSubmitted(true);
    } else {
      setErrorMessage("Please fill in all required fields.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <div className="w-full max-w-3xl">
          {/* Go Back Button */}
          <button
            className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
            onClick={() => {
              setIsSendFeedback(false);
            }}
          >
            <HiArrowLeft className="text-xl mr-2" />
            <span>Go Back</span>
          </button>

          <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-6">How are we doing?</h1>

            {submitted ? (
              <div className="text-center">
                <img
                  src="https://www.salesforce.com/content/dam/web/en_us/www/images/company/forms/contact-feedback-confirmation-checkmark.png"
                  alt="Success!"
                  className="mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold">Feedback received!</h2>
                <p>Thank you for taking time to tell us what you think.</p>
              </div>
            ) : (
              <form
                action={`https://formsubmit.co/${process.env.REACT_APP_ADMIN_EMAIL}`}
                method="POST"
                encType="multipart/form-data"
                // onSubmit={handleSubmit}
              >
                <input
                  type="hidden"
                  id="nextInput"
                  name="_next"
                  value={`${
                    process.env.REACT_APP_FRONTEND_URL + location.pathname
                  }/thankyou`}
                />
                <input type="hidden" name="_captcha" value="false" />
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700">
                    What kind of feedback do you have?
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                  >
                    <option value="" disabled>
                      Select feedback type
                    </option>
                    <option value="Support - Accounts & Billing">
                      Support - Accounts & Billing
                    </option>
                    <option value="Support - Tech Help/Product Support">
                      Support - Tech Help/Product Support
                    </option>
                    <option value="Support - General">Support - General</option>
                    <option value="Support - International">
                      Support - International
                    </option>
                    <option value="Sales - Pricing & Product Inquiry">
                      Sales - Pricing & Product Inquiry
                    </option>
                    <option value="Sales - General">Sales - General</option>
                    <option value="Sales - International">
                      Sales - International
                    </option>
                    <option value="Marketing Opt-Out - Phone">
                      Marketing Opt-Out - Phone
                    </option>
                    <option value="Marketing Opt-Out - Email">
                      Marketing Opt-Out - Email
                    </option>
                    <option value="Website Issue - USA & CA">
                      Website Issue - USA & CA
                    </option>
                    <option value="Website Issue - International">
                      Website Issue - International
                    </option>
                    <option value="Compliment - General">
                      Compliment - General
                    </option>
                    <option value="Complaint - General">
                      Complaint - General
                    </option>
                    <option value="Product Feedback">Product Feedback</option>
                    <option value="Other Feedback">Other Feedback</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700">
                    What's on your mind?
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="text-gray-700 mb-2">
                    How would you rate our site?
                  </div>
                  <div className="flex flex-wrap space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value="1"
                        onChange={(e) => setRating(e.target.value)}
                        required
                      />
                      <span className="ml-2">Terrible</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value="2"
                        onChange={(e) => setRating(e.target.value)}
                        required
                      />
                      <span className="ml-2">Bad</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value="3"
                        onChange={(e) => setRating(e.target.value)}
                        required
                      />
                      <span className="ml-2">Okay</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value="4"
                        onChange={(e) => setRating(e.target.value)}
                        required
                      />
                      <span className="ml-2">Great</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        value="5"
                        onChange={(e) => setRating(e.target.value)}
                        required
                      />
                      <span className="ml-2">Amazing</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="recommendation"
                    className="block text-gray-700"
                  >
                    How likely are you to recommend our site?
                  </label>
                  <select
                    id="recommendation"
                    name="recommendation"
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                    required
                  >
                    <option value="" disabled>
                      Select your score (0-10)
                    </option>
                    <option value="0">0 - Not at all likely</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10 - Extremely likely</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-500 mb-4">{errorMessage}</p>
                )}

                <CommonButton
                  type="submit"
                  text={"Send feedback"}
                  className="rounded-full"
                />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
