import React from "react";
import { Avatar, Card } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../user/userSlice";
import { getDiscountPercentage, getDiscountPrice } from "../../utils";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

const BestSellingCard = ({ product }) => {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();

  const isValidImageUrl = (url) => /^(https?:\/\/)/i.test(url);

  return (
    <Card
      style={{
        width: 300,
        cursor: "pointer",
      }}
      cover={
        <img
          className="h-48"
          alt="bestseller"
          src={
            isValidImageUrl(product.thumbnail)
              ? product.thumbnail
              : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          }
        />
      }
      onClick={() => navigate(`/product-detail/${product?.id}`)}
    >
      <Meta
        // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
        title={product.title}
        description={
          <div className="h-12">
            {product?.description?.length > 74
              ? product?.description?.substring(0, 74) + "..."
              : product?.description}
          </div>
        }
      />
      <section className="flex gap-2">
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
    </Card>
  );
};
export default BestSellingCard;
