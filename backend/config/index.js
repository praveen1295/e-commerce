const { config } = require("dotenv");
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

exports.CREDENTIALS = process.env.CREDENTIALS === "true";
exports.LOG_LEVEL = process.env.NODE_ENV !== "development" ? "error" : "debug";
exports.SMTP_CONFIG = {
  HOST: process.env.SMTP_HOST,
  PORT: Number(process.env.SMTP_PORT) || 587,
  USERNAME: process.env.SMTP_USERNAME,
  PASSWORD: process.env.SMTP_PASSWORD,
  SENDER: process.env.SMTP_SENDER,
  TLS: process.env.SMTP_TLS,
};

exports.PDF_CONFIG = {
  PDF_STORAGE_PATH: process.env.PDF_STORAGE_PATH || "./assets",
};

exports.TX_RECEIPT_CONFIG = {
  TX_RECEIPT_PATH: process.env.TX_RECEIPT_PATH || "./assets",
};

exports.FIREFOX_PATH = process.env.FIREFOX_PATH;
exports.NODE_ENV = process.env.NODE_ENV;
exports.PORT = process.env.PORT;
exports.DB_HOST = process.env.DB_HOST;
exports.DB_PORT = process.env.DB_PORT;
exports.DB_USER = process.env.DB_USER;
exports.DB_PASSWORD = process.env.DB_PASSWORD;
exports.DB_DATABASE = process.env.DB_DATABASE;
exports.SECRET_KEY = process.env.SECRET_KEY;
exports.LOG_FORMAT = process.env.LOG_FORMAT;
exports.LOG_DIR = process.env.LOG_DIR;
exports.ORIGIN = process.env.ORIGIN;
exports.DB_ENGINE = process.env.DB_ENGINE;
exports.ABI_DIR = process.env.ABI_DIR;
