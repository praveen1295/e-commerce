const moment = require("moment");
const { Order } = require("../model/Order");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { OrderCounter } = require("../model/OrderCounter");
const mongoose = require("mongoose"); // Ensure you have mongoose required

const {
  sendMail,
  invoiceTemplate,
  getPdfFile,
  getTexInvoiceHTML,
  mapOrderDataToInvoiceOptions,
  getPackingSlipHTML,
  mapOrderDaTaToPackingSlipOptions,
} = require("../services/common");

const getNextOrderId = async () => {
  const counter = await OrderCounter.findByIdAndUpdate(
    "order_id",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const newOrderId = `WEBBCI${counter.seq.toString().padStart(7, "0")}`;
  return newOrderId;
};

exports.createOrder = async (req, res) => {
  // const order = new Order(req.body);

  try {
    // Generate a new Order ID
    const orderId = await getNextOrderId();

    // Create a new order with the generated orderId
    const order = new Order({ ...req.body, orderId });

    const doc = await order.save();
    const user = await User.findById(order.user);

    if (doc.paymentMethod === "cash") {
      // Keep track of any issues encountered
      let issues = [];

      for (let item of order.items) {
        let product = await Product.findOneAndUpdate(
          { _id: item.product.id, stock: { $gt: 0 } },
          {
            $inc: { stock: -1 * item.quantity, sales: item.quantity },
          },
          { new: true } // Returns the updated document
        );

        if (!product) {
          // Handle cases where the product was not found or had insufficient stock
          issues.push(
            `Product with ID ${item.product.id} was not available or had insufficient stock.`
          );
        }
      }

      // Send an email if no issues were found
      if (issues.length === 0) {
        await sendMail({
          to: user.email,
          html: invoiceTemplate(order),
          subject: "Order Received",
        });
      } else {
        // Optionally, handle the issues (e.g., log them, notify admin, etc.)
        console.error(
          "Some products could not be processed:",
          issues.join(", ")
        );
      }
    }

    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchOrdersByUser = async (req, res) => {
  const { id } = req.query;
  const { _sort, _order, _page = 1, _limit = 10 } = req.query;

  // Validate _order
  const order = _order === "asc" || _order === "desc" ? _order : "asc";

  // Validate and sanitize _sort field if necessary
  const sortField =
    _sort && ["price", "date", "createdAt", "status", "orderId"].includes(_sort)
      ? _sort
      : "date";

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  let query = Order.find({ user: id, deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ user: id, deleted: { $ne: true } });

  if (sortField) {
    query = query.sort({ [sortField]: order });
  }

  const totalDocs = await totalOrdersQuery.countDocuments().exec();

  const pageSize = parseInt(_limit);
  const page = parseInt(_page);

  if (pageSize > 0 && page > 0) {
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { orderStages } = req.body;

  try {
    if (orderStages) {
    }

    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    const user = await User.findById(order.user);

    let title = null;
    let attachments = null;

    if (order.status) {
      if (order.status === "dispatched") {
        const pdfBuffer = await getPdfFile(order, user);
        title = "Your order is dispatched successfully";

        attachments = [
          {
            filename: `invoice_${order.id}.pdf`,
            content: pdfBuffer,
            encoding: "base64",
          },
        ];
      }
      sendMail({
        to: user.email,
        subject: "Order Status updated",
        html: invoiceTemplate(order, title),
        attachments: attachments ? attachments : [],
      });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

// exports.fetchAllOrders = async (req, res) => {
//   // sort = {_sort:"price",_order="desc"}
//   // pagination = {_page:1,_limit=10}
//   let query = Order.find({ deleted: { $ne: true } }).populate("user");
//   let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

//   if (req.query._sort && req.query._order) {
//     query = query.sort({ [req.query._sort]: req.query._order });
//   }

//   const totalDocs = await totalOrdersQuery.countDocuments().exec();

//   if (req.query._page && req.query._limit) {
//     const pageSize = parseInt(req.query._limit);
//     const page = parseInt(req.query._page);
//     query = query.skip(pageSize * (page - 1)).limit(pageSize);
//   }

//   try {
//     const docs = await query.exec();
//     res.set("X-Total-Count", totalDocs);
//     res.status(200).json(docs);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

exports.fetchAllOrders = async (req, res) => {
  let pipeline = [
    { $match: { deleted: { $ne: true } } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ];

  // Apply filtering based on `username` and `orderId`
  if (req.query.username) {
    const username = req.query.username;
    pipeline.push({
      $match: { "user.name": { $regex: username, $options: "i" } },
    });
  }

  if (req.query.orderId) {
    const orderId = req.query.orderId;

    pipeline.push({
      $match: { orderId: { $regex: orderId, $options: "i" } },
    });
  }

  // if (req.query.orderId) {
  //   const orderId = req.query.orderId;
  //   // Ensure that orderId is a valid ObjectId
  //   if (orderId) {
  //     pipeline.push({ $match: { orderId: orderId } });
  //   } else {
  //     return res.status(400).json({ message: "Invalid orderId" });
  //   }
  // }

  // Sorting logic
  if (req.query._sort && req.query._order) {
    const sortField = req.query._sort;
    const sortOrder = req.query._order === "asc" ? 1 : -1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });
  }

  // Pagination logic
  let totalDocs;
  if (req.query._page && req.query._limit) {
    const pageSize = parseInt(req.query._limit);
    const page = parseInt(req.query._page);

    totalDocs = await Order.countDocuments({ deleted: { $ne: true } }).exec();
    pipeline.push({ $skip: pageSize * (page - 1) });
    pipeline.push({ $limit: pageSize });
  } else {
    totalDocs = await Order.countDocuments({ deleted: { $ne: true } }).exec();
  }

  try {
    let docs = await Order.aggregate(pipeline).exec();

    // Convert _id to id
    docs = docs.map((doc) => {
      doc.id = doc._id;
      delete doc._id;
      return doc;
    });

    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchOrderById = async (req, res) => {
  const { orderId } = req.query;

  try {
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.downloadInvoice = async (req, res) => {
  try {
    const order = req.body.order; // Ensure your client sends the necessary data in the request body
    const user = await User.findById(order.user);
    const pdfBuffer = await getPdfFile(
      getTexInvoiceHTML(mapOrderDataToInvoiceOptions(order, user)),
      "",
      "",
      order.id
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
};

exports.downloadPackingSlip = async (req, res) => {
  try {
    const order = req.body.order; // Ensure your client sends the necessary data in the request body
    const user = await User.findById(order.user);
    const pdfBuffer = await getPdfFile(
      getPackingSlipHTML(mapOrderDaTaToPackingSlipOptions(order, user))
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating PDF");
  }
};
