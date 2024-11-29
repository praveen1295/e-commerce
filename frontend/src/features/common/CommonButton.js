import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";

const CommonButton = ({
  buttonClick,
  type,
  text,
  width,
  bgColor,
  className,
  loading,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={buttonClick ? () => buttonClick() : () => ""}
      className={`bg-blue-950 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full border-violet-800 border-4 p-2 focus:outline-none focus:shadow-outline ${
        disabled ? "cursor-not-allowed" : "pointer"
      } ${width ? width : ""} ${className}`}
      disabled={disabled}
    >
      {text} {loading ? <Spin indicator={<LoadingOutlined spin />} /> : ""}
    </button>
  );
};

export default CommonButton;
