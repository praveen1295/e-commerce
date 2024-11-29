import React from "react";
import { Link } from "react-router-dom";
import CommonButton from "../common/CommonButton";

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
                Ecommerce Care International LLP was launched in 2020 by Mr.
                Pankaj Mutreja. Prior to this, in 2006, Mr. Pankaj founded
                Solution Forever, a sibling company to Ecommerce Care
                International LLP. Driven by an entrepreneurial spirit, Mr.
                Pankaj was determined to leverage his skills to make a positive
                impact on the world. His passion for engineering and designing
                devices led to a pivotal moment when he dedicated himself to
                helping a child stand and walk. Despite having no formal
                education in this field, Mr. Pankaj spent countless days and
                nights researching and developing equipment to assist the child.
                The success of this initiative gave him a profound sense of
                purpose, encapsulated in his reflection, "We helped him stand,
                and that's when we realized how helpful we might be in the
                market.”
              </p>
              <p className="text-gray-700 leading-relaxed">
                Since 2006, the technology and competition have evolved, but
                Solution Forever remains renowned for its quality and
                reliability. This significant mission is now carried forward by
                the second generation, who are committed to expanding their
                reach to more customers. Our mission is to revolutionize
                physiotherapy and rehabilitation by providing top-notch
                equipment and solutions to improve patient care. As an umbrella
                brand, Solution Forever focuses on manufacturing high-quality
                products, while Ecommerce Care International excels in importing
                and trading. We serve a diverse clientele, including patients,
                physiotherapy centres, doctors, and potential multinational
                corporations.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                We pride ourselves on our commitment to accessibility, ensuring
                that even those with financial constraints receive the care they
                deserve. Our in-house manufacturing allows us to offer
                customized solutions at competitive prices, making healthcare
                more affordable and efficient.
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
    </div>
  );
};

export default AboutUs;
