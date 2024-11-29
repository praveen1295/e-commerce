import { InboxArrowDownIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const Description = ({ product }) => {
  // const [oldImagesUrls, setOldImagesUrls] = useState([]);
  return (
    <div>
      <div className="text-gray-500">
        {product?.otherDetails?.description.map((description, idx) => {
          return (
            <div key={InboxArrowDownIcon}>
              <small className="block">{description}</small>
              <br />
              {/* <small className="block mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint
                ullam, culpa exercitationem perferendis eos nulla a suscipit
                ipsam aut quod! Expedita, labore minus voluptates doloribus
                excepturi odit commodi autem beatae ab explicabo deserunt,
                sapiente ullam, quidem hic! Perspiciatis, commodi ullam suscipit
                soluta quam ducimus delectus quasi labore magni quisquam, nobis
                error harum mollitia, amet officiis aspernatur adipisci.
              </small> */}
            </div>
          );
        })}
        <div className="flex flex-wrap">
          {product?.otherDetails?.images.map((image, index) => {
            return (
              <div key={index} className="w-full md:w-1/2 px-4">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="object-cover w-full h-auto"
                  style={{ maxWidth: "50vw", maxHeight: "50vh" }}
                />
              </div>
            );
          })}

          {/* <div className="w-full md:w-1/2 px-4">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Image 2"
              className="w-full h-auto"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Description;
