require("dotenv").config();
const passport = require("passport");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { FIREFOX_PATH, PDF_CONFIG } = require("../config");

// const logo = require("../assets/biotronixLogo.png");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Use the correct SMTP server for Gmail
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVICE_MAIL_ID,
    pass: process.env.EMAIL_SERVICE_MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendMail = async function ({ to, subject, text, html, attachments }) {
  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_SERVICE_MAIL_ID, // sender address
      to, // recipient address
      subject, // subject line
      text, // plain text body
      html, // html body
      attachments,
    });
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

// exports.sendMail = async function ({ to, subject, text, html }) {
//   try {
//     let info = await transporter.sendMail({
//       from: process.env.EMAIL_SERVICE_MAIL_ID, // sender address
//       to: "erpvbankhede27@gmail.com",
//       subject,
//       text,
//       html,
//     });
//     return info;
//   } catch (error) {
//     console.error("Error sending email: ", error);
//     throw error;
//   }
// };

// Call sendMail with correct parameters
// sendMail({
//   to: "erpvbankhede27@gmail.com",
//   subject: "Test Email",
//   text: "This is a test email",
//   html: "<b>This is a test email</b>",
// });

exports.isAuth = () => {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user; // Attach the user object to the request
      next();
    })(req, res, next);
  };
};

exports.isAdmin = () => {
  return (req, res, next) => {
    const user = req?.body.user;
    if (user && user.role === "admin") {
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

exports.invoiceTemplate = function (order, title) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Email Receipt</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        @media screen {
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 400;
            src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
          }
          @font-face {
            font-family: 'Source Sans Pro';
            font-style: normal;
            font-weight: 700;
            src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
          }
        }
        body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        a[x-apple-data-detectors] { font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important; }
        div[style*="margin: 16px 0;"] { margin: 0 !important; }
        body { width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; }
        table { border-collapse: collapse !important; }
        a { color: #1a82e2; }
        img { height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none; }
      </style>
    </head>
    <body style="background-color: #D2C7BA;">
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
        A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
      </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center" bgcolor="#D2C7BA">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="center" valign="top" style="padding: 36px 24px;">
                  <a href="https://sendgrid.com" target="_blank" style="display: inline-block;">
                    <img src="../assets/biotronixLogo.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#D2C7BA">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Thank you for your order!</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" bgcolor="#D2C7BA">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <p style="margin: 0;">${
                    title ? title : "Here is a summary of your recent order."
                  } If you have any questions or concerns about your order, please <a href="mailto:${
    process.env.CONTACT_SUPPORT_EMAIL
  }">contact us</a>.</p>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="left" bgcolor="#D2C7BA" width="60%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Order #</strong></td>
                      <td align="left" bgcolor="#D2C7BA" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"></td>
                      <td align="left" bgcolor="#D2C7BA" width="20%" style="padding: 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>${
                        order.id
                      }</strong></td>
                    </tr>
                    ${order.items
                      .map(
                        (item) => `
                      <tr>
                        <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${item.product.title}</td>
                        <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">${item.quantity}</td>
                        <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">$${item.product.discountPrice.ordered}</td>
                      </tr>`
                      )
                      .join("")}
                    <tr>
                      <td align="left" width="80%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Total</strong></td>
                      <td align="left" width="20%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>$${
                        order.totalAmount
                      }</strong></td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
                  <p style="margin: 0;">Cheers,<br> Paste</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      </body>
      </html>
      `;
};

const getPackingSlipItemsHTML = (items) => {
  let data = "";
  for (let item of items) {
    data += `
    <div class="table-row items-center border-b" key=${item.id}>
        <div class="table-cell text-left py-2 px-4 border-x-2 border-white w-1/12 text-sm">
          {index + 1}
        </div>
        <div class="table-cell py-2 px-4 border-x-2 border-white w-1/12 text-center">
          <img
            src=${item.thumbnail}
            alt=${"item image"}
            class=""
            style="width: 70px;"
          />
        </div>
        <div class="table-cell text-left py-2 px-4 border-x-2 border-white w-4/12">
          ${item.name}
        </div>
        <div class="table-cell text-left py-2 px-4 border-x-2 border-white w-3/12">
          ${item.sku}
        </div>
        <div class="table-cell text-right py-2 px-4 border-x-2 border-white w-1/12 text-sm">
          ${item.quantity}
        </div>
      </div>
    `;
  }
  return data;
};

exports.getPackingSlipHTML = function (options) {
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
             /*! tailwindcss v3.0.12 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:initial;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:initial}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:after,:before{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.flex{display:flex}.table{display:table}.table-cell{display:table-cell}.table-header-group{display:table-header-group}.table-row-group{display:table-row-group}.table-row{display:table-row}.hidden{display:none}.w-60{width:15rem}.w-40{width:10rem}.w-full{width:100%}.w-\[12rem\]{width:12rem}.w-9\/12{width:75%}.w-3\/12{width:25%}.w-6\/12{width:50%}.w-2\/12{width:16.666667%}.w-\[10\%\]{width:10%}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.justify-center{justify-content:center}.rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.border-x-\[1px\]{border-left-width:1px;border-right-width:1px}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.p-10{padding:2.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pl-4{padding-left:1rem}.pb-20{padding-bottom:5rem}.pb-16{padding-bottom:4rem}.pb-1{padding-bottom:.25rem}.pb-2{padding-bottom:.5rem}.pt-20{padding-top:5rem}.pr-10{padding-right:2.5rem}.pl-24{padding-left:6rem}.pb-6{padding-bottom:1.5rem}.pl-10{padding-left:2.5rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-normal{font-weight:400}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175/var(--tw-text-opacity))}.text-black{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}
        </style>
    </head>
    <body>
        <div class="p-10" style="font-size: 10px;">
      <div class="flex items-start justify-end px-4">
        <div class="flex items-end flex-col">
          <div class="pb-16">
            <h1 class="font-bold text-4xl text-orange-400 pb-1">
              PACKAGE SLIP
            </h1>
            <p class="text-right text-gray-500 text-xl">
              Package# - ${options.orderId}
            </p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center px-4">
        <div class="flex-1">
         <div class="w-60 pb-2">
            <h2 class="text-xl">${options.companyName}</h2>
            <p>${options.address1}</p>
            <p>${options.address2}</p>
          </div>
        </div>
        <div class="flex">
          <div class="flex flex-col items-end">
            <p class="text-gray-500 py-1">Order Date: </p>
          </div>
          <div class="flex flex-col items-end w-[12rem] text-right">
            <p class="py-1">${options.date}</p>
          </div>
        </div>
      </div>

      <div class="table w-full pb-4">
        <div class="table-header-group bg-gray-700 text-white">
          <div class="table-row flex items-center">
            <div class="table-cell text-left py-2 px-4 border-x-2 border-white w-1/12 text-sm">
              #
            </div>
            <div class="table-cell text-left py-2 px-4 border-x-2 border-white w-1/12 text-sm">
              Image
            </div>
            <div class="table-cell text-left py-2 px-4 border-x-2 border-white w-4/12">
              Item name
            </div>
            <div class="table-cell text-left py-2 px-4 border-x-2 border-white w-3/12">
              Item code
            </div>
            <div class="table-cell text-right py-2 px-4 border-x-2 border-white w-1/12 text-sm">
              Quantity
            </div>
          </div>
        </div>
        <div class="table-row-group">
          ${getPackingSlipItemsHTML(options.items)}
        </div>
      </div>
      <div class=" pt-20 px-4 text-right">
        <p class="text-gray-400">
          Total: <span class="pl-24 text-black">${options.totalItems}</span>
        </p>
      </div>

      <div class="py-6 px-4">
        <p class="text-gray-400 pb-2">Notes:</p>
        <p>${options.notes}</p>
      </div>
      <div class="px-4">
        <p class="text-gray-400 pb-2">Terms:</p>
        <p>${options.terms}</p>
      </div>
    </div>
    </body>
    </html>
        `;
};

exports.mapOrderDaTaToPackingSlipOptions = function (orderData, user) {
  const options = {
    logo: "../assets/biotronixLogo.png",
    companyName: "Ecommerce",
    address1: "F-400, Sudershan Park, Moti Nagar, Near Gopal Ji Dairy,",
    address2: "New Delhi -110015, Delhi 110015",
    billingName: orderData?.selectedAddress?.name,
    billingAddress1: `${orderData?.selectedAddress?.street}, ${orderData.selectedAddress?.city}`,
    billingAddress2: `${orderData.selectedAddress?.state}, ${orderData.selectedAddress?.pinCode}`,
    orderId: orderData.id,
    date: new Date(orderData.createdAt).toLocaleDateString("en-GB"),
    items: orderData.items.map((item) => ({
      name: item.product.title,
      sku: item.product.sku,
      quantity: item.quantity,
      unit: "pcs", // Assuming unit is 'pcs', you can modify as needed
      pricePerUnit: item.product.discountPrice[user.user_category],
      gstPercentage: item.gstPercentage,
      gstAmount: item.product.gstAmount[user.user_category],
      amount: item.quantity * item.product.discountPrice.ordered,
      thumbnail: item.product.thumbnail,
    })),
    gstAmountWithPercentage: computeTotalGstAmounts(orderData, user),
    total: orderData.totalAmount,
    totalItems: orderData.totalItems,
    subTotal: orderData.items.reduce((subtotal, item) => {
      return subtotal + item.product.discountPrice.ordered * item.quantity;
    }, 0),
    paymentMethod: orderData.paymentMethod,
    notes: "Payment pending, traction machine already sent", // Customize notes as needed
    terms: "Payment due within 30 days", // Customize terms as needed
  };

  return options;
};

function getTexInvoiceItemsHTML(items) {
  let data = "";
  for (let item of items) {
    data += `
    <div class="table-row" key={index}>
        <div class="table-cell text-left py-2 px-4 ">${index + 1}</div>
        <div class="table-cell text-left py-2 px-4 ">${item.name}</div>
        <div class="table-cell text-left py-2 px-4 ">${item.sku}</div>
        <div class="table-cell text-center ">${item.quantity}</div>
        <div class="table-cell text-center ">${item.unit}</div>
        <div class="table-cell text-right ">₹${item.pricePerUnit}</div>
        <div class="table-cell text-right ">${item.gst}%</div>
        <div class="table-cell text-right px-4">₹${item.amount}</div>
      </div>
    `;
  }
  return data;
}

exports.getTexInvoiceHTML = function (options) {
  return `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
             /*! tailwindcss v3.0.12 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:initial;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:initial}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:after,:before{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.flex{display:flex}.table{display:table}.table-cell{display:table-cell}.table-header-group{display:table-header-group}.table-row-group{display:table-row-group}.table-row{display:table-row}.hidden{display:none}.w-60{width:15rem}.w-40{width:10rem}.w-full{width:100%}.w-\[12rem\]{width:12rem}.w-9\/12{width:75%}.w-3\/12{width:25%}.w-6\/12{width:50%}.w-2\/12{width:16.666667%}.w-\[10\%\]{width:10%}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.justify-center{justify-content:center}.rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.border-x-\[1px\]{border-left-width:1px;border-right-width:1px}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.p-10{padding:2.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pl-4{padding-left:1rem}.pb-20{padding-bottom:5rem}.pb-16{padding-bottom:4rem}.pb-1{padding-bottom:.25rem}.pb-2{padding-bottom:.5rem}.pt-20{padding-top:5rem}.pr-10{padding-right:2.5rem}.pl-24{padding-left:6rem}.pb-6{padding-bottom:1.5rem}.pl-10{padding-left:2.5rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-normal{font-weight:400}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175/var(--tw-text-opacity))}.text-black{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}
        </style>
    </head>
    <body>
        <div class="p-10" style="font-size: 10px;">
            <!-- Logo and Other info -->
            <div class="flex w-full items-center justify-center">
                <div class="flex-1">
                    <div class="w-60 pl-4 pb-2">
                        <h2 class="font-bold text-xl">${
                          options.companyName
                        }</h2>
                        <p>${options.address1}</p>
                        <p>${options.address2}</p>
                    </div>
                </div>
                <div class="flex justify-end pb-2">
                    <img class="w-40" src="${
                      process.env.LOGO_URL
                    }" alt="Logo" />
                </div>
            </div>
    
            <hr class="border-t-2 border-blue-400" />
            <h4 class="text-blue-400 text-center text-xl py-2 font-bold">
                Tax Invoice
            </h4>

            <div class="flex items-start justify-center">
                <div class="flex-1">
                    <div class="w-60 pl-4 pb-2">
                        <h4 class="text-xl py-1 font-bold">Bill To</h4>
                       <h2 class="font-bold">${options.billingName}</h2>
                        <p>${options.billingAddress1}</p>
                        <p>${options.billingAddress2}</p>
                    </div>
                </div>
                <div class="flex flex-col text-right justify-end w-60 pb-2 px-4">
                    <h4 class="text-xl py-1 font-bold">Invoice Detail</h4>
                    <p>Invoice no.: ${options.orderId}</p>
                    <p>Date : ${options.date}</p>
                </div>
            </div>
    
            <!-- Items List -->
            <div class="table w-full pb-4">
                <div class="table-header-group bg-gray-700 text-white">
                    <div class="table-row items-center">
                        <div class="table-cell text-left py-2 px-4">#</div>
                        <div class="table-cell text-left py-2 px-4">Item name</div>
                        <div class="table-cell text-left py-2 px-4">Item code</div>
                        <div class="table-cell text-center py-2 px-4">Quantity</div>  
                        <div class="table-cell text-center py-2 px-4">Unit</div>
                        <div class="table-cell text-right py-2 px-4">Price/ unit</div>
                        <div class="table-cell text-right py-2 px-4">GST</div>
                        <div class="table-cell text-right py-2 px-4">Amount</div>
                    </div>
                </div>
                <div class="table-row-group items-center">
                    ${options.items
                      .map(
                        (item, index) => `
                    <div class="table-row">
                        <div class="table-cell text-left py-2 px-4">${
                          index + 1
                        }</div>
                        <div class="table-cell text-left py-2 px-4">${
                          item.name
                        }</div>
                        <div class="table-cell text-left py-2 px-4">${
                          item.sku
                        }</div>
                        <div class="table-cell text-center py-2 px-4">${
                          item.quantity
                        }</div>
                        <div class="table-cell text-center py-2 px-4">${
                          item.unit
                        }</div>
                        <div class="table-cell text-right py-2 px-4">₹ ${item.pricePerUnit.toFixed(
                          2
                        )}</div>
                        <div class="table-cell text-right py-2 px-4">${
                          item.gstAmount
                        } (${item.gstPercentage}%)</div>
                        <div class="table-cell text-right py-2 px-4">₹ ${item.amount.toFixed(
                          2
                        )}</div>
                    </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
    
            <div class="flex justify-center gap-4 w-full">
                <div class="flex-1 w-60">
                    <div class="pl-4 pb-2">
                        <p class="font-bold py-1">Description</p>
                        <p class="py-1 text-wrap">
                            courier mark se bhejna sab, payment pending, traction machine already sent
                        </p>
                    </div>
                </div>
                <div class="flex justify-between w-60">
                    <div class="flex-1 pb-2">
                        <p class="py-1">Sub Total</p>
                        ${options.gstAmountWithPercentage
                          .map(
                            (item) => `
                          <p class="py-1">IGST@${item.gstPercent}%</p>
                          `
                          )
                          .join("")}
                    </div>
                    <div class="flex flex-col text-right items-end pb-2 px-4">
                        <p class="py-1">₹ ${options.subTotal.toFixed(2)}</p>
                        ${options.gstAmountWithPercentage
                          .map(
                            (item) => `
                            <p class="py-1">₹ ${item.gstAmount.toFixed(2)}</p>
                          `
                          )
                          .join("")}
                      
                    </div>
                </div>
            </div>


            <div class="flex justify-center gap-4 w-full">
                <div class="flex-1 w-60">
                  <div class="pl-4 pb-2">
                    <p class="font-bold py-1">Invoice Amount In Words</p>
                    <p class="py-1 text-wrap">${numberToWords(
                      options.total
                    )} Rupees only</p>
                  </div>
                </div>
                <div class="flex flex-col w-60">
                  <div class="flex justify-between w-full bg-gray-700 text-white">
                    <div class="flex-1 py-1 px-1">
                      <p class="py-1">Total</p>
                    </div>
                    <div class="flex-1 py-1 text-right px-4">
                      <p class="py-1">₹ ${options.total.toFixed(2)}</p>
                    </div>
                  </div>
                  <div class="flex justify-between w-full">
                    <div class="flex-1 pb-2">
                      <p class="py-1">Payment mode</p>
                    </div>
                    <div class="flex-1 text-right items-end pb-2 px-4">
                      <p class="py-1">${options.paymentMethod}</p>
                    </div>
                  </div>
              </div>
            </div>

    
            <!-- Notes and Other info -->
            <div class="py-6 px-4">
                <p class="text-gray-400 pb-2">Notes:</p>
                <p>${options.notes}</p>
            </div>
            <div class="px-4">
                <p class="text-gray-400 pb-2">Terms:</p>
                <p>${options.terms}</p>
            </div>
        </div>
    </body>
    </html>
        `;
};

// Function to convert number to words (for example)
function numberToWords(number) {
  return "Twenty Five Thousand One Hundred Sixty";
}

const computeTotalGstAmounts = (order, user) => {
  const gstTotals = {};
  order.items.forEach((item) => {
    const gstPercentage = item.product.gstPercentage;
    const gstAmount =
      item.product.gstAmount[user.user_category] * item.quantity;
    if (!gstTotals[gstPercentage]) {
      gstTotals[gstPercentage] = 0;
    }
    gstTotals[gstPercentage] += gstAmount;
  });

  return Object.keys(gstTotals).map((gstPercentage) => ({
    gstPercent: parseInt(gstPercentage),
    gstAmount: gstTotals[gstPercentage],
  }));
};

exports.mapOrderDataToInvoiceOptions = function (orderData, user) {
  const options = {
    logo: "../assets/biotronixLogo.png",
    companyName: "Ecommerce",
    address1: "F-400, Sudershan Park, Moti Nagar, Near Gopal Ji Dairy,",
    address2: "New Delhi -110015, Delhi 110015",
    billingName: orderData?.selectedAddress?.name,
    billingAddress1: `${orderData?.selectedAddress?.street}, ${orderData.selectedAddress?.city}`,
    billingAddress2: `${orderData.selectedAddress?.state}, ${orderData.selectedAddress?.pinCode}`,
    orderId: orderData.id,
    date: new Date(orderData.createdAt).toLocaleDateString("en-GB"),
    items: orderData.items.map((item) => {
      return {
        name: item.product.title,
        sku: item.product.sku,
        quantity: item.quantity,
        unit: "pcs", // Assuming unit is 'pcs', you can modify as needed
        pricePerUnit: item.product.discountPrice[user.user_category],
        gstPercentage: item.product.gstPercentage,
        gstAmount: item.product.gstAmount[user.user_category],
        amount: item.quantity * item.product.discountPrice.ordered,
        thumbnail: item.product.thumbnail,
      };
    }),
    gstAmountWithPercentage: computeTotalGstAmounts(orderData, user),
    total: orderData.totalAmount,
    subTotal: orderData.items.reduce((subtotal, item) => {
      return subtotal + item.product.discountPrice.ordered * item.quantity;
    }, 0),
    paymentMethod: orderData.paymentMethod,
    notes: "Payment pending, traction machine already sent", // Customize notes as needed
    terms: "Payment due within 30 days", // Customize terms as needed
  };

  return options;
};

const puppeteer = require("puppeteer");

const docHeight = () => {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
};
exports.getPdfFile = async (
  htmlText,
  user,
  type,
  fileDestinationName = `${
    PDF_CONFIG.PDF_STORAGE_PATH
  }/${"order.id"}_invoice.pdf`
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const rootDir = path.dirname(path.dirname(__dirname)) + "/backend";
      const filePath = path.join(rootDir, "ASSESTSFILES");
      // const html = getTexInvoiceHTML(mapOrderDataToInvoiceOptions(order, user));
      const browser = await puppeteer.launch({
        headless: true,
        executablePath:
          FIREFOX_PATH ||
          ` /opt/render/.cache/puppeteer/firefox/linux-nightly_130.0a1/firefox/firefox`,
        product: "firefox",
        args: ["--font-render-hinting=none"],
      });
      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
      );

      await page.setContent(htmlText, { waitUntil: "domcontentloaded" });
      await page.waitForFunction("document.fonts.ready");

      const pageHeight = await page.evaluate(docHeight);
      await page.evaluateHandle("document.fonts.ready");
      const pdf = await page.pdf({
        path: `${filePath}/${fileDestinationName}_invoice.pdf`,
        // format: 'A4',
        height: `${pageHeight + 85}px`,
        width: "1240px",
        printBackground: true,
      });

      // const pdf = await page.pdf({
      //   format: "A4",
      //   printBackground: true,
      // });

      await browser.close();
      resolve(pdf);
    } catch (err) {
      console.error("Error generating PDF:", err);
      reject(err);
    }
  });
};
