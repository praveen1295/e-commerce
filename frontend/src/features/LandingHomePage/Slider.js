import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./bannerSlider.scss"; // Ensure you have appropriate styles here
import { useSelector } from "react-redux";
import { selectBanners } from "../Banners/bannersSlice";

const BannerSlider = () => {
  const banners = useSelector(selectBanners);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        {banners.map((banner, index) =>
          banner.status === "active" && banner.image ? (
            <div key={index} className="slide">
              <img
                className="slide-image"
                src={banner.image}
                alt={`Slide ${index}`}
              />
            </div>
          ) : null
        )}
      </Slider>
    </div>
  );
};

export default BannerSlider;
