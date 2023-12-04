const express = require("express");
const router = express.Router();
const userController = require("../controls/users.controller");
const verifyToken = require("../module/verifyToken");
const multer = require("multer");
const appError = require("../utils/appError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("MyFile=> ", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix =
      "User " + Date.now() + "-" + Math.round(Math.random() * 1e9) + `.${ext}`;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("File Must Be An Image", 400));
  }
};
const upload = multer({ storage: storage, fileFilter });

router.route("/").get(verifyToken, userController.getAllUsers);
router
  .route("/register")
  .post(upload.single("avatar"), userController.register);
router.route("/login").post(userController.login);

module.exports = router;
