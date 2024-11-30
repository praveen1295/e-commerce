import React from "react";
import { Link } from "react-router-dom";
import CommonButton from "../common/CommonButton";
import HomePage from "../chat/HomePage";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div
        className="relative w-full bg-cover bg-center py-32 md:py-48 flex items-center"
        style={{
          backgroundImage: "url('/assets/About-us-banner.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 w-full px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-left text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">About Us</h1>
            <p className="text-lg md:text-xl">
              Where innovation meets compassion in the world of healthcare.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 md:p-12">
            {/* Who Are We Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Who Are We?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                At Global Health Innovators LLP, founded in 2015 by Praveen
                Bankhede, we are dedicated to reshaping the future of healthcare
                and rehabilitation. Praveen Bankhede envisioned a world where
                innovative solutions make healthcare accessible and efficient
                for everyone. His journey began with a personal mission to
                assist a young child in regaining mobility. Despite lacking
                formal training in medical device engineering, Praveen Bankhede
                devoted himself to creating a customized solution. This triumph
                became the foundation of his lifelong commitment to innovation
                and compassion in healthcare.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Over the years, Global Health Innovators LLP has grown from a
                small initiative into a leading provider of cutting-edge
                physiotherapy and rehabilitation solutions. Today, we stand as a
                beacon of reliability and excellence, serving clients from
                diverse backgrounds, including patients, physiotherapists,
                medical professionals, and international corporations.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Our mission is clear: to empower healthcare providers with the
                tools they need to improve patient outcomes and redefine
                standards of care. With a focus on research, development, and
                manufacturing, we specialize in delivering tailor-made,
                high-quality equipment at competitive prices. Our parallel arm,
                HealthCare Emporium, excels in the import and distribution of
                premium medical products, ensuring global accessibility for
                local needs.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                At Global Health Innovators LLP, our ethos revolves around
                compassion, innovation, and accessibility. We believe that
                financial constraints should never hinder anyone from receiving
                the care they deserve. Our dedicated team continues to break
                barriers and expand horizons, driving a future where healthcare
                innovation knows no bounds.
              </p>
            </section>

            {/* Mission Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Our mission is to provide innovative, high-quality physiotherapy
                and rehabilitation equipment that aids patient care and
                accessibility. We strive to offer customized solutions at
                competitive prices, ensuring that everyone, regardless of their
                financial status, can benefit from our products.
              </p>
            </section>

            {/* Vision Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become a leading brand in the physiotherapy industry,
                recognized nationwide for our commitment to excellence,
                innovation, and compassion. We aim to establish a presence in
                every state of India, making Ecommerce a household name
                synonymous with top-tier physiotherapy solutions.
              </p>
            </section>

            {/* Purpose Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Purpose</h2>
              <p className="text-gray-700 leading-relaxed">
                Ecommerce's mission is to transform healthcare by closing the
                gap between affordability and quality. We are committed to
                making physiotherapy equipment available to all patients,
                improving their quality of life through new solutions and
                unrelenting compassion.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We would love to hear from you! If you have any questions,
                feedback, or inquiries, please feel free to contact us.
              </p>
              <div className="text-center">
                <Link to="/contactus" className="">
                  <CommonButton
                    type="submit"
                    text={"Get in Touch"}
                    className="rounded-full"
                    // bgColor="bg-green-500"
                  />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
      {<HomePage />}
    </div>
  );
};

export default AboutUs;
