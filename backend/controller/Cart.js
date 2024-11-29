const { Cart } = require("../model/Cart");
const { Product } = require("../model/Product");

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate("product");

    // Calculate GST included price for each cart item
    const cartItemsWithGst = cartItems.map((cartItem) => {
      const product = cartItem.product;

      if (product && typeof product.calculateGstIncludedPrice === "function") {
        if (product.discountPrice) {
          product.gstIncludedPrice = {
            regular: product.calculateGstIncludedPrice(
              product.discountPrice.regular
            ),
            gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
            silver: product.calculateGstIncludedPrice(
              product.discountPrice.silver
            ),
            platinum: product.calculateGstIncludedPrice(
              product.discountPrice.platinum
            ),
          };

          product.gstAmount = {
            regular: product.calculateGstAmount(product.discountPrice.regular),
            gold: product.calculateGstAmount(product.discountPrice.gold),
            silver: product.calculateGstAmount(product.discountPrice.silver),
            platinum: product.calculateGstAmount(
              product.discountPrice.platinum
            ),
          };
        }
      } else {
        console.log("Product is not an instance or methods are not available.");
      }

      // Convert cartItem and product to plain objects
      const cartItemObj = cartItem.toObject();
      cartItemObj.product = product ? product.toObject() : null;

      cartItemObj.id = cartItemObj._id.toHexString(); // Add id field
      delete cartItemObj._id; // Remove _id field
      cartItemObj.product.id = cartItemObj.product._id.toHexString(); // Add id field
      delete cartItemObj.product._id; // Remove _id field

      // Ensure the gstIncludedPrice is included in the cartItemObj
      if (cartItemObj.product) {
        cartItemObj.product.gstIncludedPrice = product.gstIncludedPrice;
        cartItemObj.product.gstAmount = product.gstAmount;
      }

      return cartItemObj;
    });

    // Log the final cart items with GST included prices

    res.status(200).json(cartItemsWithGst);
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    res.status(500).json({
      message: "An error occurred while fetching cart items.",
      error: err.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });
  try {
    const doc = await cart.save();
    const cartItems = await doc.populate("product");

    // const cartItemsWithGst = cartItems.map((cartItem) => {
    //   const product = cartItem.product;

    //   if (product && typeof product.calculateGstIncludedPrice === "function") {
    //     if (product.discountPrice) {
    //       product.gstIncludedPrice = {
    //         regular: product.calculateGstIncludedPrice(
    //           product.discountPrice.regular
    //         ),
    //         gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
    //         silver: product.calculateGstIncludedPrice(
    //           product.discountPrice.silver
    //         ),
    //         platinum: product.calculateGstIncludedPrice(
    //           product.discountPrice.platinum
    //         ),
    //       };

    //       product.gstAmount = {
    //         regular: product.calculateGstAmount(product.discountPrice.regular),
    //         gold: product.calculateGstAmount(product.discountPrice.gold),
    //         silver: product.calculateGstAmount(product.discountPrice.silver),
    //         platinum: product.calculateGstAmount(
    //           product.discountPrice.platinum
    //         ),
    //       };
    //     }
    //   } else {
    //     console.log("Product is not an instance or methods are not available.");
    //   }

    //   // Convert cartItem and product to plain objects
    //   const cartItemObj = cartItem.toObject();
    //   cartItemObj.product = product ? product.toObject() : null;

    //   cartItemObj.id = cartItemObj._id.toHexString(); // Add id field
    //   delete cartItemObj._id; // Remove _id field
    //   cartItemObj.product.id = cartItemObj.product._id.toHexString(); // Add id field
    //   delete cartItemObj.product._id; // Remove _id field

    //   // Ensure the gstIncludedPrice is included in the cartItemObj
    //   if (cartItemObj.product) {
    //     cartItemObj.product.gstIncludedPrice = product.gstIncludedPrice;
    //     cartItemObj.product.gstAmount = product.gstAmount;
    //   }

    //   return cartItemObj;
    // });

    res.status(201).json(cartItems);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const cartItem = await cart.populate("product");
    console.log("cartItems", cartItem);
    const product = cartItem.product;

    // const cartItemsWithGst = cartItems?.product?.map((product) => {
    if (product && typeof product.calculateGstIncludedPrice === "function") {
      if (product.discountPrice) {
        product.gstIncludedPrice = {
          regular: product.calculateGstIncludedPrice(
            product.discountPrice.regular
          ),
          gold: product.calculateGstIncludedPrice(product.discountPrice.gold),
          silver: product.calculateGstIncludedPrice(
            product.discountPrice.silver
          ),
          platinum: product.calculateGstIncludedPrice(
            product.discountPrice.platinum
          ),
        };

        product.gstAmount = {
          regular: product.calculateGstAmount(product.discountPrice.regular),
          gold: product.calculateGstAmount(product.discountPrice.gold),
          silver: product.calculateGstAmount(product.discountPrice.silver),
          platinum: product.calculateGstAmount(product.discountPrice.platinum),
        };
      }
    } else {
      console.log("Product is not an instance or methods are not available.");
    }

    // Convert cartItem and product to plain objects
    const cartItemObj = cartItem.toObject();
    cartItemObj.product = product ? product.toObject() : null;

    cartItemObj.id = cartItemObj._id.toHexString(); // Add id field
    delete cartItemObj._id; // Remove _id field
    cartItemObj.product.id = cartItemObj.product._id.toHexString(); // Add id field
    delete cartItemObj.product._id; // Remove _id field

    // Ensure the gstIncludedPrice is included in the cartItemObj
    if (cartItemObj.product) {
      cartItemObj.product.gstIncludedPrice = product.gstIncludedPrice;
      cartItemObj.product.gstAmount = product.gstAmount;
    }

    // return cartItemObj;
    // });
    res.status(200).json({
      message: "Quantity updated successfully.",
      updatedCartItem: cartItemObj,
    });
  } catch (err) {
    console.log("error", err);
    res.status(400).json(err);
  }
};
