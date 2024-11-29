import React from "react";
import { useSelector } from "react-redux";
import { selectBanners } from "../Banners/bannersSlice";

function SliderContent({ activeIndex }) {
  const banners = useSelector(selectBanners);

  return (
    <section>
      {banners.map((slide, index) => (
        <>
          {slide.status === "active" && slide.image ? (
            <div
              key={index}
              className={index === activeIndex ? "slides active" : "slides"}
            >
              <img className="slide-image" src={slide.image} alt="" />
            </div>
          ) : (
            ""
          )}
        </>
      ))}
    </section>
  );
}

export default SliderContent;
