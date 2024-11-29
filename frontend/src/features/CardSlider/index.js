import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Product from "./Product";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export default function CardSlider({ data }) {
  const { productData } = data;

  const product = productData.map((item) => (
    <Product
      key={item.id}
      id={item.id}
      title={item.title}
      url={item.thumbnail}
      price={item.price}
      discountPrice={item.discountPrice}
      description={item.description}
    />
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8">
      <Carousel
        showDots={true}
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={2000}
        containerClass="carousel-container"
        swipeable={false}
        draggable={false}
        ssr={true}
        infinite={true}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-20-px"
      >
        {product}
      </Carousel>
    </div>
  );
}
