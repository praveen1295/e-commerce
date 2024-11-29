import React from "react";
import CommonButton from "../common/CommonButton";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const cardData = [
    {
      imageSrc: "assets/fastestDelivery.svg",
      heading: "Fast Delivery Times",
      description:
        "We aim to keep as much of our medical equipment in stock at all times so that we can offer you the best delivery times possible.",
    },
    {
      imageSrc: "assets/shopOffer.svg",
      heading: "Check Out Our Offers",
      description:
        "If you're after a bargain, take a look into our clearance and offers section for some great deals on medical supplies.",
    },
    {
      imageSrc: "assets/talkToTeam.svg",
      heading: "Talk To Our Team",
      description:
        "If you have any enquiries about any of our products please don't hesitate to get in touch to discuss your requirements further.",
    },
  ];

  const navigate = useNavigate();
  const handleShopNow = () => {
    navigate("/shop/products");
  };
  const handleCardClick = () => {};
  return (
    <div className="container mx-auto py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        <div className="bg-white p-4">
          <img src="assets/shop1.svg" alt="" className="w-full" />
        </div>
        <div className="bg-white p-4">
          <h1 className="text-5xl font-bold mb-5">
            Prominent Indian Supplier of Medical Goods & Equipment
          </h1>
          <p className="text-gray-500 mb-4">
            K-Med stands as one of India's foremost manufacturers and
            distributors of hospital necessities, healthcare supplies, and
            medical equipment.
          </p>
          <p className="text-gray-500 mb-3">
            We boast the most extensive selection of medical supplies and
            equipment accessible in India, encompassing a variety from blood
            pressure monitors and infrared non-contact thermometers to
            ultrasound scanners, syringes, Welch Allyn products, and more...
          </p>
          <small className="text-blue-600 mb-2 block cursor-pointer     ">
            More...
          </small>
          <CommonButton text={"View Shop"} buttonClick={handleShopNow} />
        </div>
      </div>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-3/4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-2 shadow-md cursor-pointer hover:bg-gray-200"
              onClick={handleCardClick}
            >
              <img
                src={card.imageSrc}
                alt=""
                className="w-3/5 md:w-1/3 rounded-lg mb-2"
              />
              <h3 className="text-base font-semibold mb-1">{card.heading}</h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
