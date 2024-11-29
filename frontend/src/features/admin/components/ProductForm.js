import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedProduct,
  createProductAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectProductById,
  updateProductAsync,
} from "../../product/productSlice";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import { useAlert } from "react-alert";
import Description from "../../product/components/Description";
import CategoryModal from "../../categories/CategoryModal";
import {
  fetchAllCategoriesAsync,
  selectCategories,
} from "../../categories/categorySlice";
import ColorModal from "../../color/ColorModal";
import { Select } from "antd";
import { fetchAllColorsAsync, selectColors } from "../../color/colorSlice";

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const colors = useSelector(selectColors);

  console.log("xxxxxxxxxxxxx", categories);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [image1Preview, setImage1Preview] = useState(null);
  const [image2Preview, setImage2Preview] = useState(null);
  const [image3Preview, setImage3Preview] = useState(null);
  const [otherDescriptionImage1Preview, setOtherDescriptionImage1Preview] =
    useState(null);
  const [otherDescriptionImage2Preview, setOtherDescriptionImage2Preview] =
    useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const alert = useAlert();

  const colorOptions = [];
  for (let i = 10; i < 36; i++) {
    colorOptions.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }

  const handleColorChange = (value) => {
    setSelectedColors(value);
  };
  const sizes = [
    { name: "XXS", inStock: true, id: "xxs" },
    { name: "XS", inStock: true, id: "xs" },
    { name: "S", inStock: true, id: "s" },
    { name: "M", inStock: true, id: "m" },
    { name: "L", inStock: true, id: "l" },
    { name: "XL", inStock: true, id: "xl" },
    { name: "2XL", inStock: true, id: "2xl" },
    { name: "3XL", inStock: true, id: "3xl" },
  ];

  const handleFileChange = (event, setPreview) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
    } else {
      dispatch(clearSelectedProduct());
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    dispatch(fetchAllCategoriesAsync());
    dispatch(fetchAllColorsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct && params.id) {
      setValue("id", params.id);
      setValue("title", selectedProduct.title);
      setValue("description", selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("sku", selectedProduct.sku);

      // Set discount percentages for each category
      setValue(
        "discountPercentage.regular",
        selectedProduct.discountPercentage?.regular
      );
      setValue(
        "discountPercentage.gold",
        selectedProduct.discountPercentage?.gold
      );
      setValue(
        "discountPercentage.silver",
        selectedProduct.discountPercentage?.silver
      );
      setValue(
        "discountPercentage.platinum",
        selectedProduct.discountPercentage?.platinum
      );

      setValue("stock", selectedProduct.stock);
      setValue("gstPercentage", selectedProduct.gstPercentage);

      setValue(
        "relatedProducts",
        selectedProduct?.relatedProducts
          .map((item, idx) => {
            if (idx > 0) {
              return " " + item;
            }
            return item;
          })
          .join(",")
      );

      // thumbnailPreview
      //   ? setValue("thumbnail", selectedProduct.thumbnailPreview)
      //   : setValue("thumbnail", selectedProduct.thumbnailPreview);
      // setThumbnailPreview(selectedProduct.thumbnail);

      // image1Preview
      //   ? setValue("image1", selectedProduct?.image1Preview)
      //   : setValue("image1", selectedProduct?.images[0]);
      // image2Preview
      //   ? setValue("image2", selectedProduct?.image2Preview)
      //   : setValue("image2", selectedProduct?.images[1]);
      // image3Preview
      //   ? setValue("image3", selectedProduct?.image3Preview)
      //   : setValue("image3", selectedProduct?.images[2]);

      setThumbnailPreview(selectedProduct.thumbnail);
      setImage1Preview(selectedProduct?.images[0]);
      setImage2Preview(selectedProduct?.images[1]);
      setImage3Preview(selectedProduct?.images[2]);

      setOtherDescriptionImage1Preview(
        selectedProduct?.otherDetails?.images[0]
      );
      setOtherDescriptionImage2Preview(
        selectedProduct?.otherDetails?.images[1]
      );

      selectedProduct?.otherDetails?.description.map((description, idx) => {
        setValue(`otherDescription${idx + 1}`, description);
        return description;
      });
      setValue("brand", selectedProduct.brand);
      setValue("category", selectedProduct.category);
      setSelectedColors(selectedProduct.colors);

      setValue("dimensions", selectedProduct?.dimensions);
      setValue("weight", selectedProduct?.weight);

      // Set highlights
      setValue("highlight1", selectedProduct.highlights[0]);
      setValue("highlight2", selectedProduct.highlights[1]);
      setValue("highlight3", selectedProduct.highlights[2]);
      setValue("highlight4", selectedProduct.highlights[3]);

      // Set sizes and colors
      setValue(
        "sizes",
        selectedProduct.sizes.map((size) => size.id)
      );
      setValue(
        "colors",
        selectedProduct.colors.map((color) => color.id)
      );
    }
  }, [selectedProduct, params.id, setValue]);

  const handleDelete = () => {
    const product = { ...selectedProduct };
    product.deleted = true;
    dispatch(updateProductAsync(product));
  };

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit(async (data) => {
          const formData = new FormData();

          // Append non-file fields
          const fields = [
            "title",
            "description",
            "brand",
            "category",
            "price",
            "stock",
            "gstPercentage",
            "sku",
            "relatedProducts",
          ];
          fields.forEach((field) => formData.append(field, data[field]));

          // Append highlights
          const highlights = [
            data.highlight1,
            data.highlight2,
            data.highlight3,
            data.highlight4,
          ].filter(Boolean);
          highlights.forEach((highlight, index) =>
            formData.append(`highlights[${index}]`, highlight)
          );

          // Append other details descriptions
          const otherDetailsDescriptionArr = [
            data.otherDescription1,
            data.otherDescription2,
          ].filter(Boolean);
          otherDetailsDescriptionArr.forEach((otherDetails, index) => {
            formData.append(
              `otherDetailsDescriptionArr[${index}]`,
              otherDetails
            );
          });

          // Append other description images

          [data.otherDescriptionImage1, data.otherDescriptionImage2].forEach(
            (image, index) => {
              if (image?.[0])
                formData.append("otherDescriptionImage", image[0]);
            }
          );

          // Append colors and sizes
          ["sizes"].forEach((field) => {
            if (data[field])
              data[field].forEach((item) => formData.append(field, item));
          });

          if (selectedColors) {
            selectedColors.forEach((item) => formData.append(colors, item));
          }

          // Append discount percentages
          if (data.discountPercentage) {
            ["regular", "gold", "silver", "platinum"].forEach((type) => {
              if (data.discountPercentage[type] != null) {
                formData.append(
                  `discountPercentage[${type}]`,
                  data.discountPercentage[type]
                );
              }
            });
          }

          // Append image files
          if (data.thumbnail[0]) {
            formData.append("thumbnail", data.thumbnail[0]);
          }
          [data.image1, data.image2, data.image3].forEach((image, index) => {
            if (image?.[0]) formData.append("productPhotos", image[0]);
          });

          // Handle product creation/updating
          if (params.id) {
            const imagesUrlsArr = [];
            if (data.thumbnail[0])
              imagesUrlsArr.push(selectedProduct.thumbnail);

            [data.image1, data.image2, data.image3]
              .filter(Boolean)
              .forEach((image, index) => {
                if (image && selectedProduct.images[index]) {
                  imagesUrlsArr.push(selectedProduct.images[index]);
                }
              });

            [data.otherDescriptionImage1, data.otherDescriptionImage2]
              .filter(Boolean)
              .forEach((image, index) => {
                if (image && selectedProduct.otherDetails.images[index + 1]) {
                  imagesUrlsArr.push(
                    selectedProduct.otherDetails.images[index + 1]
                  );
                }
              });

            // Append imagesUrlsArr to formData as JSON string
            formData.append("oldImagesUrls", JSON.stringify(imagesUrlsArr));

            dispatch(updateProductAsync({ formData: formData, id: params.id }));
            alert.success("Product Updated");
          } else {
            formData.append("rating", 0);
            dispatch(createProductAsync(formData));
            alert.success("Product Created");
          }
        })}
      >
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Product
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {selectedProduct && selectedProduct.deleted && (
                <h2 className="text-red-500 sm:col-span-6">
                  This product is deleted
                </h2>
              )}

              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("title", {
                        required: "name is required",
                      })}
                      id="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sort Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "description is required",
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about product.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="otherDescription1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description Line 1
                </label>
                <div className="mt-2">
                  <textarea
                    id="otherDescription1"
                    {...register("otherDescription1", {
                      required: "description is required",
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>

                <label
                  htmlFor="otherDescription2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description Line 2
                </label>
                <div className="mt-2">
                  <textarea
                    id="otherDescription2"
                    {...register("otherDescription2", {
                      required: "description is required",
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>

                <h3 className="block text-sm font-medium leading-6 text-gray-900 mt-2">
                  Images For Product Description
                </h3>

                <div className="flex gap-7">
                  <div className="col-span-3">
                    <label
                      htmlFor="otherDescriptionImage1"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Image 1
                    </label>
                    <div className="mt2">
                      <input
                        type="file"
                        {...register("otherDescriptionImage1", {
                          required: params.id ? false : "Image require",
                        })}
                        id="otherDescriptionImage1"
                        accept="image/*"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        onChange={(e) =>
                          handleFileChange(e, setOtherDescriptionImage1Preview)
                        }
                      />

                      {errors.otherDescriptionImage1 && (
                        <span className="text-red-600">
                          {errors.otherDescriptionImage1.message}
                        </span>
                      )}
                      {otherDescriptionImage1Preview && (
                        <img
                          src={otherDescriptionImage1Preview}
                          alt="otherDescriptionImage1 preview"
                          className="mt-2 w-60"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-span3">
                    <label
                      htmlFor="otherDescriptionImage2"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Image 2
                    </label>
                    <div className="mt2">
                      <input
                        type="file"
                        {...register("otherDescriptionImage2", {
                          required: params.id ? false : "Image require",
                        })}
                        id="otherDescriptionImage2"
                        accept="image/*"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        onChange={(e) =>
                          handleFileChange(e, setOtherDescriptionImage2Preview)
                        }
                      />
                      {errors.otherDescriptionImage2 && (
                        <span className="text-red-600">
                          {errors.otherDescriptionImage2.message}
                        </span>
                      )}
                      {otherDescriptionImage2Preview && (
                        <img
                          src={otherDescriptionImage2Preview}
                          alt="Image 1 preview"
                          className="mt-2 w-60"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  SKU
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("sku", {
                        required: "SKU is required",
                      })}
                      id="sku"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Brand
                </label>
                <div className="mt-2">
                  <select
                    {...register("brand", {
                      required: false,
                    })}
                  >
                    <option value="">--choose brand--</option>
                    {brands.map((brand) => (
                      <option key={brand.value} value={brand.value}>
                        {brand.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="relatedProducts"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Related Products
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("relatedProducts", {
                        required: "Related products is required",
                      })}
                      id="relatedProducts"
                      placeholder="Enter comma separate SKU of products"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="dimensions"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Dimensions
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("dimensions", {
                        required: false,
                      })}
                      id="dimensions"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Weight
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("weight", {
                        required: false,
                      })}
                      id="weight"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex gap-4 items-end">
                  <div>
                    <label
                      htmlFor="colors"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Colors
                    </label>
                    {/* <div className="mt-2">
                      {colors.map((color) => (
                        <div key={color.id}>
                          <input
                            type="checkbox"
                            {...register("colors", {})}
                            value={color.id}
                          />{" "}
                          {color.name}
                        </div>
                      ))}
                    </div> */}
                    {console.log("selectedCCC", selectedColors)}
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "400px", height: "40px" }}
                      placeholder="Please select"
                      defaultValue={selectedColors}
                      onChange={handleColorChange}
                      options={colors}
                    />
                  </div>
                  <div>
                    <ColorModal btnText={"edit"} />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="sizes"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Sizes
                </label>
                <div className="mt-2">
                  {sizes.map((size) => (
                    <div key={size.id}>
                      <input
                        type="checkbox"
                        {...register("sizes", {})}
                        value={size.id}
                      />{" "}
                      {size.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-full">
                <div className="flex gap-4 items-end">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Category
                    </label>
                    <div className="mt-2">
                      <select
                        {...register("category", {
                          required: params.id ? false : "category is required",
                        })}
                      >
                        <option value="">--choose category--</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <CategoryModal btnText={"edit"} />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register("price", {
                        required: "price is required",
                        min: 1,
                        max: 1000000,
                      })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="gstPercentage"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    GST Percentage
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="number"
                        {...register("gstPercentage", {
                          required: "gst percentage is required",
                          min: 0,
                        })}
                        id="gstPercentage"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="sm:col-span-2">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount Percentage
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register("discountPercentage", {
                        required: "discountPercentage is required",
                        min: 0,
                        max: 100,
                      })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div> */}

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Discount Percentage
                </label>
                <div className="mt-2 space-y-4">
                  {["regular", "gold", "silver", "platinum"].map((category) => (
                    <div key={category}>
                      <label
                        htmlFor={`discountPercentage_${category}`}
                        className="block text-sm font-medium leading-6 text-gray-900 capitalize"
                      >
                        {category} Discount Percentage
                      </label>
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                        <input
                          type="number"
                          {...register(`discountPercentage.${category}`, {
                            required: `${category} discountPercentage is required`,
                            min: {
                              value: 1,
                              message: `Minimum ${category} discount is 1%`,
                            },
                            max: {
                              value: 99,
                              message: `Maximum ${category} discount is 99%`,
                            },
                          })}
                          id={`discountPercentage_${category}`}
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                      </div>
                      {errors.discountPercentage?.[category] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.discountPercentage[category].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Stock
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="number"
                      {...register("stock", {
                        required: "stock is required",
                        min: 0,
                      })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <label
                  htmlFor="thumbnail"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Thumbnail
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("thumbnail", {
                      required: params.id ? false : "Thumbnail is required",
                    })}
                    id="thumbnail"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    onChange={(e) => handleFileChange(e, setThumbnailPreview)}
                  />
                  {errors.thumbnail && (
                    <span className="text-red-600">
                      {errors.thumbnail.message}
                    </span>
                  )}
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="mt-2 w-60"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-4">
                <label
                  htmlFor="image1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 1
                </label>
                <div className="mt2">
                  <input
                    type="file"
                    {...register("image1", {
                      required: params.id ? false : "Image 1 is required",
                    })}
                    id="image1"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    onChange={(e) => handleFileChange(e, setImage1Preview)}
                  />
                  {errors.image1 && (
                    <span className="text-red-600">
                      {errors.image1.message}
                    </span>
                  )}
                  {image1Preview && (
                    <img
                      src={image1Preview}
                      alt="Image 1 preview"
                      className="mt-2 w-60"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-4">
                <label
                  htmlFor="image2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 2
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("image2", {
                      required: params.id ? false : "Image 2 is required",
                      // required: false,
                    })}
                    id="image2"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    onChange={(e) => handleFileChange(e, setImage2Preview)}
                  />
                  {errors.image2 && (
                    <span className="text-red-600">
                      {errors.image2.message}
                    </span>
                  )}
                  {image2Preview && (
                    <img
                      src={image2Preview}
                      alt="Image 2 preview"
                      className="mt-2 w-60"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-4">
                <label
                  htmlFor="image3"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Image 3
                </label>
                <div className="mt-2">
                  <input
                    type="file"
                    {...register("image3", {
                      required: params.id ? false : "Image 3 is required",
                      // required: false,
                    })}
                    id="image3"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                    onChange={(e) => handleFileChange(e, setImage3Preview)}
                  />
                  {errors.image3 && (
                    <span className="text-red-600">
                      {errors.image3.message}
                    </span>
                  )}
                  {image3Preview && (
                    <img
                      src={image3Preview}
                      alt="Image 3 preview"
                      className="mt-2 w-60"
                    />
                  )}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight1"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 1
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("highlight1", {})}
                      id="highlight1"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6 ">
                <label
                  htmlFor="highlight2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 2
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("highlight2", {})}
                      id="highlight2"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight3"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 3
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("highlight3", {})}
                      id="highlight3"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="highlight4"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Highlight 4
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <input
                      type="text"
                      {...register("highlight4", {})}
                      id="highlight4"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>

      {selectedProduct && (
        <Modal
          title={`Delete ${selectedProduct.title}`}
          message="Are you sure you want to delete this Product ?"
          dangerOption="Delete"
          cancelOption="Cancel"
          dangerAction={handleDelete}
          cancelAction={() => setOpenModal(null)}
          showModal={openModal}
        ></Modal>
      )}
    </>
  );
}

export default ProductForm;
