// src/components/TermsConditions.js

import React from "react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to Ecommerce. These Terms and Conditions govern your use of
            our website. By accessing or using our website, you agree to comply
            with and be bound by these Terms and Conditions. If you do not agree
            to these terms, please do not use our website.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Use of Our Website</h2>
          <ul className="list-disc list-inside mb-4">
            <li>You must be at least 18 years old to use our website.</li>
            <li>You agree to use our website only for lawful purposes.</li>
            <li>
              You agree not to engage in any activity that may harm or disrupt
              our website.
            </li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <p className="mb-4">
            All content on our website, including text, images, and logos, is
            the property of [Your Company Name] and is protected by intellectual
            property laws. You may not use any content from our website without
            our express written permission.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Limitation of Liability
          </h2>
          <p className="mb-4">
            To the fullest extent permitted by law, [Your Company Name] shall
            not be liable for any indirect, incidental, special, or
            consequential damages arising out of or in connection with your use
            of our website.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to update or modify these Terms and Conditions
            at any time. We will notify you of any changes by posting the new
            Terms and Conditions on this page. Your continued use of our website
            after any changes constitutes your acceptance of the new Terms and
            Conditions.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms and Conditions, please
            contact us:
          </p>
          <p className="mb-4">
            <strong>Email:</strong> support@example.com
          </p>
          <p className="mb-4">
            <strong>Address:</strong> F-400, Sudershan Park, Moti Nagar, Near
            Gopal Ji Dairy, New Delhi -110015, Delhi 110015
          </p>
        </section>
      </main>
      {/* 
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 [Your Company Name]. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default TermsConditions;
