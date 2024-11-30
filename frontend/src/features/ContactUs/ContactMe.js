import React, { useState, useEffect } from "react";
import CommonButton from "../common/CommonButton";
import { Link, useLocation } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";
import ThankYouModal from "../common/ThankYouModal";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const ContactOptions = () => {
  const [isSendFeedback, setIsSendFeedback] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("submitForm") === "true") {
      setIsModalOpen(true);
    }
  }, [location]);

  const closeModal = () => {
    setIsModalOpen(false);
    const newUrl = window.location.pathname;
    window.history.replaceState(null, null, newUrl);
  };

  const handleSendFeedback = () => {
    setIsSendFeedback(!isSendFeedback);
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 gap-4 w-full max-w-4xl">
          <div className="text-left">
            <h4 className="text-3xl font-bold mb-4">
              How would you like to contact Ecommerce?
            </h4>
          </div>
        </div>
      </div>

      {!isSendFeedback ? (
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
            <RequestCallForm />
            <div className="flex flex-col gap-4 text-left bg-transparent">
              <ContactOption
                title="Give us a call."
                content={
                  <>
                    <div>
                      <a
                        className="display-phone text-night nowrap"
                        href="tel:91 965-486-6346"
                      >
                        <span className="hidden-xs">+91 9479779107</span>
                      </a>{" "}
                      |{" "}
                      <a
                        className="dialing-phone text-night nowrap"
                        href="tel:1-947-977-9107"
                      >
                        +91 9425919583
                      </a>
                    </div>
                    <p>
                      <span className="header-text">+91 9479779107 </span> |
                      <span className="header-text">+91 9425919583</span>
                    </p>
                    <p>
                      <a href="" target="_blank">
                        <small className="text-blue-500">
                          {" "}
                          Get billing and tech support
                        </small>
                      </a>
                    </p>
                  </>
                }
              />

              <ContactOption
                title="Address"
                content={<div>68-Ashoka garden bhopal</div>}
                linkText="Find your local office"
              />

              <ContactOption
                title="Leave us some feedback."
                content={
                  <p style={{ whiteSpace: "nowrap" }}>
                    Good or bad, we love to hear it all.
                  </p>
                }
                onClick={handleSendFeedback}
                linkText="Send feedback"
              />
            </div>
          </div>
        </div>
      ) : (
        <FeedbackForm setIsSendFeedback={setIsSendFeedback} />
      )}
      <ThankYouModal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};

const ContactOption = ({ title, content, linkText, onClick }) => (
  <div className="columnContainer parbase section bg-white p-4">
    <div className="columns-wrapper container-fluid margin-20-bottom-lg column-container-component">
      <div className="bg-snow bg-opacity-90">&nbsp;</div>
      <div className="row columns-wrapper">
        <div className="col text-left">
          <div className="headingComponent parbase section">
            <h2 className="h3 text-night text-left salesforce-sans-bold margin-30-top-lg margin-20-right-lg margin-10-bottom-lg margin-30-left-lg">
              <h3 className="header-text text-2xl font-bold">{title}</h3>
            </h2>
          </div>
          <div className="bodyCopyComponent parbase section">
            <div className="margin-30-right-lg margin-10-bottom-lg margin-30-left-lg text-size-default line-height-default">
              {content}
            </div>
          </div>
          {linkText && (
            <div className="buttonCTAComponent parbase section">
              <div className="margin-10-top-lg margin-30-right-lg margin-20-bottom-lg margin-30-left-lg text-left">
                <div className="cta_0 buttonCTAItemComponent parbase">
                  <div className="btn-container">
                    <Link
                      role="button"
                      className="btn btn-lg btn-primary salesforce-sans-regular"
                      onClick={onClick}
                    >
                      <small className="text-blue-500">{linkText}</small>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const RequestCallForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    UserFirstName: "",
    UserLastName: "",
    UserTitle: "",
    UserEmail: "",
    UserPhone: "",
    CompanyName: "",
    CompanyEmployees: "",
    CompanyCountry: "",
    CompanyState: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      UserFirstName: "",
      UserLastName: "",
      UserTitle: "",
      UserEmail: "",
      UserPhone: "",
      CompanyName: "",
      CompanyEmployees: "",
      CompanyCountry: "",
      CompanyState: "",
    });
  };

  return (
    <div className="col text-left bg-white p-4">
      <div className="columnContainer parbase section">
        <div className="columns-wrapper container-fluid column-container-component">
          <div className="bg-snow bg-opacity-90">&nbsp;</div>
          <div className="row columns-wrapper">
            <div className="col text-left">
              <div className="formContainerV2 parbase section">
                <div className="form-container-v2 sfdc-form-day sfdc-form-closed sfdc-form-small">
                  <div className="form-header-wrap">
                    <div className="headingComponent parbase section">
                      <h2 className="h3 text-night text-left salesforce-sans-bold">
                        <h3 className="header-text text-2xl font-bold">
                          Request a call.
                        </h3>
                      </h2>
                    </div>
                    <div className="bodyCopyComponent parbase section">
                      <div className="margin-20-bottom-lg margin-10-bottom-xs text-size-default">
                        Give us some info so the right person can get back to
                        you.
                      </div>
                    </div>
                  </div>
                  <form
                    action={`https://formsubmit.co/${process.env.REACT_APP_ADMIN_EMAIL}`}
                    method="POST"
                    onSubmit={handleSubmit}
                    className="form-builder-form sfdc-form-adaptive-label"
                    id="reg_form_VDgQ"
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
                    <input type="hidden" name="skipForm" value="false" />
                    <input
                      type="hidden"
                      name="mcloudFormName"
                      value="GLOB_MAIN_T2L1_OCMS_LCS1"
                    />
                    <input
                      type="hidden"
                      name="FormCampaignId"
                      value="7010M000002NcMHQA0"
                    />
                    <input type="hidden" name="PartnerPromoCode" value="None" />
                    <input
                      type="hidden"
                      name="DriverCampaignId"
                      value="70130000000sUVq"
                    />

                    <div className="fields-container flex flex-col gap-4">
                      <div className="fields-wrapper grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="field-container">
                          <input
                            id="UserFirstName-txg8"
                            type="text"
                            name="UserFirstName"
                            value={formData.UserFirstName}
                            onChange={handleChange}
                            placeholder="First name"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>

                        <div className="field-container">
                          <input
                            id="UserLastName-r76I"
                            type="text"
                            name="UserLastName"
                            value={formData.UserLastName}
                            onChange={handleChange}
                            placeholder="Last name"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>
                      </div>

                      <div className="fields-wrapper grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="field-container">
                          <input
                            id="UserEmail-yZ1Z"
                            type="email"
                            name="UserEmail"
                            value={formData.UserEmail}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>

                        <div className="field-container">
                          <input
                            id="UserTitle-PD0t"
                            type="text"
                            name="UserTitle"
                            value={formData.UserTitle}
                            onChange={handleChange}
                            placeholder="Title"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>
                      </div>

                      <div className="fields-wrapper grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="field-container">
                          <input
                            id="UserPhone-WRlv"
                            type="text"
                            name="UserPhone"
                            value={formData.UserPhone}
                            onChange={handleChange}
                            placeholder="Phone"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>

                        <div className="field-container">
                          <input
                            id="CompanyName-FKUD"
                            type="text"
                            name="CompanyName"
                            value={formData.CompanyName}
                            onChange={handleChange}
                            placeholder="Company"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>
                      </div>

                      <div className="fields-wrapper grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="field-container">
                          <input
                            id="gstNumber"
                            type="text"
                            name="gstNumber"
                            value={formData.CompanyEmployees}
                            onChange={handleChange}
                            placeholder="GST Number"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>

                        <div className="field-container">
                          <select
                            id="CompanyCountry-WcNI"
                            name="CompanyCountry"
                            value={formData.CompanyCountry}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          >
                            <option value="">Country</option>
                            {countries.map((country, idx) => {
                              return (
                                <option key={idx} value={country}>
                                  {country}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="fields-wrapper">
                        <div className="field-container">
                          <input
                            id="CompanyState-U8D8"
                            type="text"
                            name="CompanyState"
                            value={formData.CompanyState}
                            onChange={handleChange}
                            placeholder="State"
                            required
                            className="border border-gray-300 px-3 py-2 w-full rounded-md"
                          />
                        </div>
                      </div>

                      <div className="fields-wrapper">
                        <div className="field-container">
                          <CommonButton text="Submit" type="submit" />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOptions;
