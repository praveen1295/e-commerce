// src/components/PrivacyPolicy.js

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to Ecommerce. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you visit our
            website. Please read this privacy policy carefully.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside mb-4">
            <li>Personal Data: Name, email address, phone number, etc.</li>
            <li>Usage Data: Information about how you use our website.</li>
            <li>
              Cookies: Data collected from cookies and similar technologies.
            </li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Provide, operate, and maintain our website.</li>
            <li>Improve, personalize, and expand our website.</li>
            <li>Understand and analyze how you use our website.</li>
            <li>
              Communicate with you, either directly or through one of our
              partners, including for customer service, to provide you with
              updates and other information relating to the website.
            </li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Security</h2>
          <p className="mb-4">
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this Privacy Policy are effective when they are
            posted on this page.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us:
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

      {/* <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 [Your Company Name]. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default PrivacyPolicy;
