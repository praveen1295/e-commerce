require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const colorsRouter = require("./routes/ColorRoute");

const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const newUserRequestRouter = require("./routes/NewUserRequest");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const couponRouter = require("./routes/CouponRoute");
const paymentRouter = require("./routes/PaymentRoute");
const reviewRouter = require("./routes/ReviewRoute");
const blogRouter = require("./routes/BlogsRoute");
const bankRouter = require("./routes/bankDetails");

const { upload } = require("./middlewares/fileUpload");
const { rootDir } = require("./middlewares/fileUpload");
const bannersRouter = require("./routes/banners");

const cpUpload = upload.fields([
  { name: "productPhotos", maxCount: 10 },
  { name: "assetsPhoto", maxCount: 10 },
  { name: "thumbnail", maxCount: 1 },
  { name: "otherDescriptionImage", maxCount: 5 },
  { name: "blogsThumbnail", maxCount: 1 },
  { name: "blogsPhotos", maxCount: 5 },
  { name: "bannerImg", maxCount: 5 },
]);

const ordersRouter = require("./routes/Order");
const { User } = require("./model/User");
const {
  isAuth,
  sanitizeUser,
  cookieExtractor,
  isAdmin,
} = require("./services/common");
const path = require("path");
const { Order } = require("./model/Order");
const { env } = require("process");

// Webhook

// const AWS = require("aws-sdk");

// AWS.config.update({
//   accessKeyId: "your_access_key_id",
//   secretAccessKey: "your_secret_access_key",
//   region: "ap-south-1",
// });

// const s3 = new AWS.S3();
// s3.listBuckets((err, data) => {
//   if (err) console.log(err, err.stack);
//   else console.log(data.Buckets);
// });

const endpointSecret = process.env.ENDPOINT_SECRET;

// JWT options

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

//middlewares

// server.use(express.static(path.resolve(__dirname, "build")));
server.use(express.static(path.resolve(__dirname, "../frontend/build")));

server.use(cookieParser());

const allowedOrigins = [
  "https://ecommerce-frontend.onrender.com",
  "https://biotronixfrontend.netlify.app",
  "http://localhost:3001",
  "http://localhost:8080",
  "http://localhost:8080/api",
  "http://www.ecommerce.com",
  "http://3.111.3.98",
  "http://3.111.3.98/api",
];

server.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // allowedHeaders: "Content-Type,Authorization",
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      secure: process.env.NODE_ENV === "production", // true for HTTPS
      httpOnly: true,
      sameSite: "None",
    },
  })
);

server.use(passport.authenticate("session"));

server.use(express.json()); // to parse req.body

// Serve static files
server.use(
  "/api/v1/static/assets",
  express.static(path.join(rootDir, "assets"))
);
server.use(
  "/api/v1/static/images",
  express.static(path.join(rootDir, "PRODUCT_PHOTOS"))
);
server.use(
  "/api/v1/static/thumbnail",
  express.static(path.join(rootDir, "THUMBNAIL"))
);
server.use(
  "/api/v1/static/assetsFile",
  express.static(path.join(rootDir, "ASSESTSFILES"))
);

server.use(
  "/api/v1/static/blogsThumbnail",
  express.static(path.join(rootDir, "BLOGS_THUMBNAIL"))
);
server.use(
  "/api/v1/static/blogsPhotos",
  express.static(path.join(rootDir, "BLOGS_PHOTOS"))
);

server.use(
  "/api/v1/static/banner",
  express.static(path.join(rootDir, "BANNERS"))
);

server.use("/products", cpUpload, productsRouter.router);
// we can also use JWT token for client-only auth
server.use("/categories", categoriesRouter.router);
server.use("/colors", colorsRouter.router);

server.use("/brands", brandsRouter.router);
server.use("/users", isAuth(), usersRouter.router);

server.use("/newUserRequests", isAuth(), newUserRequestRouter.router);
server.use("/auth", authRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), ordersRouter.router);
server.use("/coupons", couponRouter.router);
server.use("/reviews", reviewRouter.router);
server.use("/createPayment", paymentRouter.router);
server.use("/blogs", cpUpload, blogRouter);
server.use("/bank-details", bankRouter);

server.use("/banners", cpUpload, bannersRouter);

// this line we add to make react router work in case of other routes doesnt match
server.get("*", (req, res) =>
  res.sendFile(path.resolve("build", "index.html"))
);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
      console.log("passport user", user);
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY
          );
          done(null, { id: user.id, role: user.role, token });
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this changes session variable req.user when called from authorized request

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Payments

// This is your test secret API key.
// const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

// server.post("/create-payment-intent", async (req, res) => {
//   const { totalAmount, orderId } = req.body;

//   // Validate and sanitize inputs
//   if (!totalAmount || !orderId) {
//     return res.status(400).send({ error: "Invalid request parameters" });
//   }

//   try {
//     // Create a PaymentIntent with the order amount and currency
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(Number(totalAmount) * 100), // Multiply by 100 to convert to the smallest currency unit
//       currency: "inr",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//       metadata: {
//         orderId,
//       },
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// });

// checkout api
// server.post("/create-checkout-session", async (req, res) => {
//   const { items: products } = req.body;

//   const lineItems = products.map((product) => {
//     return {
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: product?.product.title,
//           images: [product?.product.thumbnail],
//         },
//         unit_amount: Number(product?.product.discountPrice.ordered) * 100,
//       },
//       quantity: product.quantity,
//     };
//   });

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineItems,
//     mode: "payment",
//     success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//     cancel_url: `${process.env.FRONTEND_URL}/cancel`,

//     // customer_details: {
//     //   name: "user1",
//     //   address: {
//     //     line1: "add1",
//     //     line2: "add2",
//     //     city: "multai",
//     //     state: "madhya pradesh",
//     //     postal_code: "460661",
//     //     country: "India",
//     //   },
//     // },
//   });

//   res.json({ id: session.id });
// });

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
  console.log("database connected");
}

server.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
