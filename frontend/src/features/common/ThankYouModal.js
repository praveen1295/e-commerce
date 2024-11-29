import React from "react";

const ThankYouModal = ({ isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h1 className="text-3xl font-bold text-center mb-4">Thank you!</h1>
        <p className="text-lg text-center mb-6">
          Your form has been submitted successfully.
        </p>
        <div className="flex justify-center">
          <button
            onClick={closeModal}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;
