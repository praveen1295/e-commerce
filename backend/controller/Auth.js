const { User } = require("../model/User");
const { NewUserRequest } = require("../model/NewUserRequest");
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/common");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const otpStore = {};

// exports.createUser = async (req, res) => {
//   const { adminInfo } = req.body;

//   try {
//     const salt = crypto.randomBytes(16);
//     crypto.pbkdf2(
//       req.body.password,
//       salt,
//       310000,
//       32,
//       "sha256",
//       async function (err, hashedPassword) {
//         if (err) {
//           throw err; // Handle crypto errors if needed
//         }

//         if (adminInfo && adminInfo.role === "admin") {
//           const admin = await User.findOne({ email: adminInfo.email });

//           if (admin && admin.role === "admin") {
//             const { adminInfo, ...adminData } = req.body; // Exclude adminInfo from req.body

//             const newAdmin = new User({
//               ...adminData,
//               password: hashedPassword,
//               salt,
//             });

//             // Save the new user or handle further logic here
//             await newAdmin.save();
//           }
//           return;
//         }

//         const user = new User({
//           ...req.body,
//           password: hashedPassword,
//           salt,
//         });

//         try {
//           const doc = await user.save();

//           // Create a NewUserRequest
//           const newUserRequest = new NewUserRequest({
//             user: doc._id,
//             request_type: "new_signup",
//             admin_notes: "",
//           });

//           await newUserRequest.save();

//           // Send an email to the admin
//           const adminEmail = process.env.ADMIN_EMAIL; // Ensure you have the admin's email in your environment variables
//           const subject = "New User Signup Request";
//           const html = `<p>A new user has signed up and a request has been created for admin review.</p>
//                         <p>User ID: ${doc._id}</p>
//                         <p>Email: ${doc.email}</p>
//                         <p>Please review the request in the admin panel.</p>`;
//           await sendMail({ to: adminEmail, subject, html });

//           req.login(sanitizeUser(doc), (err) => {
//             // this also calls serializer and adds to session
//             if (err) {
//               throw err; // Handle login errors if needed
//             } else {
//               const token = jwt.sign(
//                 sanitizeUser(doc),
//                 process.env.JWT_SECRET_KEY
//               );
//               res
//                 .cookie("jwt", token, {
//                   expires: new Date(Date.now() + 3600000),
//                   httpOnly: true,
//                 })
//                 .status(201)
//                 .json({ id: doc.id, role: doc.role });
//             }
//           });
//         } catch (error) {
//           if (error.code === 11000) {
//             // MongoDB duplicate key error (E11000)
//             res.status(409).json(error);
//           } else {
//             throw error; // Re-throw other errors for global error handling
//           }
//         }
//       }
//     );
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.loginUser = async (req, res) => {
//   const user = req.user;
//   res
//     .cookie("jwt", user.token, {
//       expires: new Date(Date.now() + 3600000),
//       httpOnly: true,
//     })
//     .status(201)
//     .json({ id: user.id, role: user.role });
// };

exports.createUser = async (req, res) => {
  const { password, ownerInfo, ...userData } = req.body;

  try {
    // Generate salt and hash password
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });

    if (ownerInfo && ownerInfo.role === "owner") {
      const owner = await User.findById(ownerInfo.id);

      if (owner && owner.role === "owner") {
        const newAdmin = new User({
          ...userData,
          password: hashedPassword,
          salt,
        });

        await newAdmin.save();

        return res
          .status(201)
          .json({ message: "Admin user created successfully." });
      }
      return res.status(500).json({ message: "Unauthorized action." });
    } else {
      const user = new User({
        ...userData,
        password: hashedPassword,
        salt,
      });

      const doc = await user.save();

      // Create a NewUserRequest
      const newUserRequest = new NewUserRequest({
        user: doc._id,
        request_type: "new_signup",
        admin_notes: "",
      });

      await newUserRequest.save();

      // Send an email to the owner
      const adminEmail = process.env.ADMIN_EMAIL; // Ensure you have the owner's email in your environment variables
      const subject = "New User Signup Request";
      const html = `
        <p>A new user has signed up and a request has been created for owner review.</p>
        <p>User ID: ${doc._id}</p>
        <p>Email: ${doc.email}</p>
        <p>Please review the request in the owner panel.</p>`;
      await sendMail({ to: adminEmail, subject, html });

      req.login(sanitizeUser(doc), (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error", error: err });
        }

        const token = jwt.sign(sanitizeUser(doc), process.env.JWT_SECRET_KEY);
        res
          .cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
          })
          .status(201)
          .json({ id: doc._id, role: doc.role });
      });
    }
  } catch (err) {
    console.error("Error in createUser:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      sameSite: "None", // Ensure cross-site usage
      secure: true, // Ensure the cookie is only sent over HTTPS
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};

exports.logout = async (req, res) => {
  res
    .cookie("jwt", "", {
      expires: new Date(0), // Set expiration date to the past
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Add secure flag in production
      sameSite: "Strict", // Adjust based on your requirement
    })
    .sendStatus(200);
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();
    // Also set token in email
    const resetPageLink =
      `${process.env.FRONTEND_URL}/reset-password?token=` +
      token +
      "&email=" +
      email;
    const subject = "reset password for ecommerce";
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email: email, resetPasswordToken: token });
  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();

        const subject = "password successfully reset for ecommerce";
        const html = `<p>Successfully able to Reset Password</p>`;
        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
};

exports.sendOtp = async (req, res) => {
  const { userId, email, phone_number, otpType } = req.body;

  try {
    const user = await User.findById(userId);

    if (user) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      otpStore[user.email] = otp;

      let subject = "";
      let html = "";

      switch (otpType) {
        case "profileUpdate":
          subject = `Update ${
            phone_number ? "phone number" : "email"
          } for ecommerce`;
          html = `<p>Your one-time password for changing ${
            phone_number ? "phone number" : "email"
          } is: <span>${otp}</span></p>`;
          break;

        case "register":
          subject = "Otp for registration";
          html = `<p>Your one-time password for registration is: <span>${otp}</span></p>`;
          break;

        default:
          return res
            .status(400)
            .send({ success: false, message: "Invalid OTP type" });
      }

      if (email) {
        const response = await sendMail({ to: user.email, subject, html });
        return res.json({
          success: true,
          message: "OTP sent successfully",
          response,
        });
      } else {
        return res
          .status(400)
          .send({ success: false, message: "Email is required" });
      }
    } else {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .send({ success: false, message: "Email and OTP are required" });
  }

  const storedOTP = otpStore[email];

  if (!storedOTP) {
    return res.status(400).send({
      success: false,
      message: "Invalid OTP. Please request a new one.",
    });
  }

  if (otp === storedOTP) {
    delete otpStore[email];
    return res
      .status(200)
      .send({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(400).send({ success: false, message: "Invalid OTP" });
  }
};
