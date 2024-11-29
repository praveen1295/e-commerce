import toast from "react-hot-toast";

export function getGstIncludedPrice(user_category, product) {
  const userCategory = user_category ? user_category : "regular";

  // Check if product is an object and product.gstIncludedPrice is an object
  if (
    product &&
    typeof product === "object" &&
    product.gstIncludedPrice &&
    typeof product.gstIncludedPrice === "object"
  ) {
    if (userCategory in product.gstIncludedPrice) {
      return product.gstIncludedPrice[userCategory];
    } else {
      return product.gstIncludedPrice["regular"]; // Default value if no match found
    }
  } else {
    console.error("Invalid product or gstIncludedPrice structure");
    return null; // or a default value
  }
}

export function getDiscountPrice(user_category, product) {
  const userCategory = user_category ? user_category : "regular";

  // Check if product is an object and product.gstIncludedPrice is an object
  if (
    product &&
    typeof product === "object" &&
    product.discountPrice &&
    typeof product.discountPrice === "object"
  ) {
    if (userCategory in product.discountPrice) {
      return product.discountPrice[userCategory];
    } else {
      return product.discountPrice["regular"]; // Default value if no match found
    }
  } else {
    console.error("Invalid product or discount price structure");
    return null; // or a default value
  }
}

export function getDiscountPercentage(user_category, product) {
  const userCategory = user_category ? user_category : "regular";

  // Check if product is an object and product.discountPercentage is an object
  if (
    product &&
    typeof product === "object" &&
    product.discountPercentage &&
    typeof product.discountPercentage === "object"
  ) {
    if (userCategory in product.discountPercentage) {
      return product.discountPercentage[userCategory];
    } else {
      return product.discountPercentage["regular"]; // Default value if no match found
    }
  } else {
    console.error("Invalid product or discountPercentage structure");
    return null; // or a default value
  }
}

// export function getDiscountPercentage(user_category, product) {
//   const userCategory = user_category ? user_category : "regular";

//   // Check if product is an object and product.discountPercentage is an object
//   if (
//     product &&
//     typeof product === "object" &&
//     product.gstIncludedPrice &&
//     typeof product.gstIncludedPrice === "object"
//   ) {
//     if (userCategory in product.gstIncludedPrice) {
//       const discountPercentage =
//         ((product.price - product.gstIncludedPrice[userCategory]) /
//           product.price) *
//         100;

//       return discountPercentage > 0
//         ? parseFloat(discountPercentage.toFixed(2))
//         : null;
//     } else {
//       return parseFloat(product.discountPercentage["regular"].toFixed(2)); // Default value if no match found
//     }
//   } else {
//     console.error("Invalid product or discountPercentage structure");
//     return null; // or a default value
//   }
// }

export function handleApiError(error) {
  if (error.response) {
    // Server responded with a status other than 200 range
    switch (error.response.status) {
      case 400:
        toast.error(error.response.data.message || error.message);
        console.error("Bad Request:", error.response.data);
        break;
      case 401:
        toast.error(error.response.data);
        console.error("Unauthorized:", error.response.data);
        break;
      case 403:
        toast.error(error.message);
        console.error("Forbidden:", error.response.data);
        break;
      case 404:
        toast.error(error.message);
        console.error("Not Found:", error.response.data);
        break;
      case 409:
        // Conflict - Duplicate key error handling
        if (error.response.data && error.response.data.keyValue) {
          const keyValue = error.response.data.keyValue;
          const duplicateKey = Object.keys(keyValue)[0];
          const duplicateValue = keyValue[duplicateKey];

          toast.error(
            `User with this ${duplicateKey} ${duplicateValue} already exists.`
          );
          console.error(
            `User with ${duplicateKey} ${duplicateValue} already exists.`
          );
        } else {
          toast.error("Conflict occurred. Please try again.");
          console.error("Conflict:", error.response.data);
        }
        break;
      case 500:
        toast.error(error.response.data.error || error.message);
        console.error("Internal Server Error:", error.response.data);
        break;
      default:
        toast.error(error.message);
        console.error("Error:", error.response.status, error.response.data);
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error("Network error:", error.request);
  } else {
    // Something else happened
    console.error("Error:", error.message);
  }
}

export async function handleRazorPayPayment(
  order,
  toast,
  user,
  handleSuccessPayment
) {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/createPayment`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.totalAmount,
        }),
      }
    );

    const data = await res.json();
    handlePaymentVerify(data.data, toast, order, user, handleSuccessPayment);
  } catch (error) {
    console.log(error);
  }
}

const handlePaymentVerify = async (
  data,
  toast,
  order,
  user,
  handleSuccessPayment
) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: data.amount,
    currency: data.currency,
    name: user.name,
    description: "",
    order_id: data.id,
    handler: async (response) => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/createPayment/verify`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
            }),
          }
        );

        const verifyData = await res.json();

        if (verifyData.message) {
          toast.success(verifyData.message);
        }

        if (verifyData.success) {
          handleSuccessPayment(verifyData.success);
        }
      } catch (error) {
        console.log(error);
      }
    },
    theme: {
      color: "#5f63b8",
    },
  };
  const rzp1 = new window.Razorpay(options);
  rzp1.open();
};
// queryUtils.js
export function generateQueryString(params) {
  return Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
