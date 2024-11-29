const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");

const { sendMail, invoiceTemplate } = require("../services/common");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const { trusted } = require("mongoose");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ROUTE 1 : Create Order Api Using POST Method http://localhost:8000/api/payment/order
exports.createPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

// ROUTE 2 : Create Verify Api Using POST Method http://localhost:8000/api/payment/verify
// exports.verifyPayment = async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     orderId,
//   } = req.body;

//   try {
//     // Create Sign
//     const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSign = crypto
//       .createHmac("sha256", process.env.RAZORPAY_SECRET)
//       .update(sign)
//       .digest("hex");

//     // Verify Signature
//     const isAuthentic = expectedSign === razorpay_signature;

//     if (isAuthentic) {
//       const order = await Order.findById(orderId);
//       if (!order) {
//         return res.status(404).json({ message: "Order not found!" });
//       }

//       order.paymentStatus = "received";
//       await order.save();

//       // Prepare to handle stock and sales updates
//       const issues = [];
//       const user = await User.findById(order.user);
//       if (!user) {
//         return res.status(404).json({ message: "User not found!" });
//       }

//       for (let item of order.items) {
//         const product = await Product.findOneAndUpdate(
//           { _id: item.product.id, stock: { $gte: item.quantity } },
//           {
//             $inc: { stock: -item.quantity, sales: item.quantity },
//           },
//           { new: true }
//         );

//         if (!product) {
//           issues.push(
//             `Product with ID ${item.product.id} was not available or had insufficient stock.`
//           );
//         }
//       }

//       if (issues.length === 0) {
//         await sendMail({
//           to: user.email,
//           html: invoiceTemplate(order),
//           subject: "Order Received",
//         });
//       } else {
//         console.error(
//           "Some products could not be processed:",
//           issues.join(", ")
//         );
//       }

//       res.json({ success: true, message: "Payment Successfully Verified" });
//     } else {
//       res.status(400).json({ message: "Invalid Signature" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error!" });
//     console.error(error);
//   }
// };

const mongoose = require("mongoose");

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  try {
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: "Invalid Signature" });
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(orderId).session(session);
      if (!order) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Order not found!" });
      }

      order.paymentStatus = "received";
      order.status = "placed";
      order.orderStages = [
        {
          date: new Date().toISOString(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          title: "Order placed successfully.",
          city: "",
          stage: "placed",
        },
      ];

      await order.save({ session });

      const issues = [];
      const user = await User.findById(order.user).session(session);
      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({ message: "User not found!" });
      }

      for (let item of order.items) {
        const product = await Product.findOneAndUpdate(
          { _id: item.product.id, stock: { $gte: item.quantity } },
          {
            $inc: { stock: -item.quantity, sales: item.quantity },
          },
          { new: true, session }
        );

        if (!product) {
          issues.push(
            `Product with ID ${item.product.id} was not available or had insufficient stock.`
          );
        }
      }

      if (issues.length > 0) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Some products could not be processed.",
          issues,
        });
      }

      await session.commitTransaction();
      session.endSession();

      await sendMail({
        to: user.email,
        html: invoiceTemplate(order),
        subject: "Order Received",
      });

      res.json({ success: true, message: "Payment Successfully Verified" });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Transaction failed", err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  } catch (error) {
    console.error("Payment verification failed", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
