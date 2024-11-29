const { existsSync, mkdirSync } = require("fs");
const multer = require("multer");
const path = require("path");

const {
  FILE_DIR,
  PHOTO_DIR,
  THUMBNAIL_DIR,
  BLOGS_THUMBNAIL_DIR,
  BLOGS_PHOTO_DIR,
  BANNERS,
} = process.env;

const photoDir = PHOTO_DIR;
const fileDir = FILE_DIR;
const thumbnailDir = THUMBNAIL_DIR;
const blogsPhotoDir = BLOGS_PHOTO_DIR;
const BlogsThumbnailDir = BLOGS_THUMBNAIL_DIR;
const bannersDir = BANNERS || "BANNERS";

const rootDir = path.dirname(path.dirname(__dirname)) + "/backend";

if (!existsSync(rootDir)) {
  mkdirSync(rootDir);
}

// Ensure the photo directory exists
const photoPath = path.join(rootDir, "PRODUCT_PHOTOS");
if (!existsSync(photoPath)) {
  mkdirSync(photoPath);
}

// Ensure the file directory exists
const filePath = path.join(rootDir, "ASSESTSFILES");
if (!existsSync(filePath)) {
  mkdirSync(filePath);
}

const thumbnailPath = path.join(rootDir, "THUMBNAIL");
if (!existsSync(thumbnailPath)) {
  mkdirSync(thumbnailPath);
}

const blogsThumbnailPath = path.join(rootDir, "BLOGS_THUMBNAIL");

if (!existsSync(blogsThumbnailPath)) {
  mkdirSync(blogsThumbnailPath);
}
const blogsPhotoPath = path.join(rootDir, "BLOGS_PHOTOS");
if (!existsSync(blogsPhotoPath)) {
  mkdirSync(blogsPhotoPath);
}
const bannersPath = path.join(rootDir, "BANNERS");
if (!existsSync(bannersPath)) {
  mkdirSync(bannersPath);
}

// if (!existsSync(photoDir)) {
//   mkdirSync(path.join(rootDir, "PRODUCT_PHOTOS"));
// }
// if (!existsSync(fileDir)) {
//   mkdirSync(path.join(rootDir, "ASSESTSFILES"));
// }
// if (!existsSync(thumbnailDir)) {
//   mkdirSync(path.join(rootDir, "THUMBNAIL"));
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (file.fieldname === "productPhotos") {
//       cb(null, path.join(__dirname, "./../", photoDir));
//     } else if (file.fieldname === "assetsPhoto") {
//       cb(null, path.join(__dirname, "./../", fileDir));
//     } else if (file.fieldname === "thumbnail") {
//       cb(null, path.join(__dirname, "./../", thumbnailDir));
//     }
//   },

//   filename: (req, file, cb) => {
//     cb(null, file.originalname.split(" ").join("_"));
//   },
// });

const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "productPhotos") {
      cb(null, path.join(__dirname, "./../", photoDir));
    } else if (file.fieldname === "assetsPhoto") {
      cb(null, path.join(__dirname, "./../", fileDir));
    } else if (file.fieldname === "thumbnail") {
      cb(null, path.join(__dirname, "./../", thumbnailDir));
    } else if (file.fieldname === "otherDescriptionImage") {
      cb(null, path.join(__dirname, "./../", photoDir));
    } else if (file.fieldname === "blogsThumbnail") {
      cb(null, path.join(__dirname, "./../", BlogsThumbnailDir));
    } else if (file.fieldname === "blogsPhotos") {
      cb(null, path.join(__dirname, "./../", blogsPhotoDir));
    } else if (file.fieldname === "bannerImg") {
      cb(null, path.join(__dirname, "./../", bannersDir));
    }
  },

  filename: (req, file, cb) => {
    // Generate a unique filename
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = {
  upload,
  rootDir,
  uniqueSuffix,
  photoPath,
  thumbnailPath,
  blogsPhotoPath,
  blogsThumbnailPath,
  bannersPath,
};
