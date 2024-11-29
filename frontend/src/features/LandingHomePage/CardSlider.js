/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./cardSlider.scss";
import { Card, Col, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../user/userSlice";
import { getDiscountPercentage, getDiscountPrice } from "../../utils";

const CardSlider = ({ products, slidesToScroll, slidesToShow }) => {
  const userInfo = useSelector(selectUserInfo);

  const navigate = useNavigate();

  const [thumbnailImages, setThumbnailImages] = useState([]);

  const isValidImageUrl = (url) => /^(https?:\/\/)/i.test(url);

  const fetchPhotos = async (url) => {
    try {
      const res = await fetch(url);
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      return imageObjectURL;
    } catch (error) {
      console.error("Error fetching image:", error);
      return "/assets/images/imgNotFound.svg"; // Default image if fetch fails
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const images = await Promise.all(
        products.map(async (item) => {
          if (item?.thumbnail && isValidImageUrl(item.thumbnail)) {
            return await fetchPhotos(item.thumbnail);
          } else {
            return "/assets/no_image_found.png";
          }
        })
      );
      setThumbnailImages(images);
    };

    loadImages();
  }, [products]);

  const settings = {
    dots: true,
    infinite: true, // Enable infinite loop
    speed: 500,
    autoplay: true, // Enable automatic sliding
    autoplaySpeed: 2000, // Duration of each slide (in milliseconds)
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true, // Ensure infinite loop in responsive view
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  const renderItem = (product) => {
    return (
      <section className="flex gap-4">
        <div className="flex gap-2">
          {getDiscountPrice(userInfo?.user_category, product) <
            product?.price && (
            <span
              style={{
                textDecoration: "line-through",
              }}
              className="text-gray-400"
            >
              ₹{product?.price}
            </span>
          )}
          <span className="text-black font-bold">
            ₹{getDiscountPrice(userInfo?.user_category, product)}
          </span>

          {getDiscountPercentage(userInfo?.user_category, product) && (
            <span className="text-green-500 font-bold">
              {getDiscountPercentage(userInfo?.user_category, product)}% off
            </span>
          )}
        </div>
        <span className="rating"> | Rating: {product?.rating}</span>
      </section>
    );
  };

  return (
    <Col className="cardSlider">
      <Row
        gutter={[16, { xs: 8, sm: 10, md: 16, lg: 16, xl: 16, xxl: 16 }]}
        className="card-2"
      >
        {products.map((item, idx) => (
          <Col
            key={`slider-${idx}`}
            xs={24}
            sm={24}
            md={12}
            lg={8}
            xl={8}
            xxl={8}
          >
            <Card
              className="other-projects-card"
              hoverable
              onClick={() => navigate(`/product-detail/${item?.id}`)}
            >
              <Row className="other-projects-card-1">
                <Col
                  xs={11}
                  sm={11}
                  md={11}
                  lg={11}
                  xl={11}
                  xxl={11}
                  className="ant-card-cover"
                >
                  <img
                    alt=""
                    src={
                      thumbnailImages[idx] || "/assets/images/imgNotFound.svg"
                    }
                  />
                </Col>
                <Col xs={13} sm={13} md={13} lg={13} xl={13} xxl={13}>
                  <Meta
                    title={item?.title}
                    description={
                      item?.description?.length > 75
                        ? item?.description?.substring(0, 74) + "..."
                        : item?.description
                    }
                  />
                  <hr />
                  {renderItem(item)}
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="card-1">
        <Slider {...settings}>
          {products.map((item, idx) => (
            <Card
              key={`slider-${idx}`}
              className="other-projects-card border-4"
              hoverable
              onClick={() => {
                navigate(`/product-detail/${item?.id}`);
                window.scrollTo(0, 0);
              }}
              cover={
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    className="object-cover w-full h-full"
                    alt=""
                    src={
                      thumbnailImages[idx] || "/assets/images/imgNotFound.svg"
                    }
                  />
                </div>
              }
            >
              <Meta
                title={item?.title}
                description={
                  <div>
                    {item?.description?.length > 75
                      ? item?.description?.substring(0, 74) + "..."
                      : item?.description}
                  </div>
                }
              />
              <hr />
              {renderItem(item)}
            </Card>
          ))}
        </Slider>
      </div>
    </Col>
  );
};

export default CardSlider;
