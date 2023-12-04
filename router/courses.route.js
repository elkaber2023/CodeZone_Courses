const express = require("express");

const router = express.Router();
const AppControllers = require("../controls/control");
const { validationSchema } = require("../validationSchema/validation");
const verifyToken = require("../module/verifyToken");
const allowedTo = require("../module/allowedTo");
const userRoles = require("../utils/userRoles");


router
  .route("/")
  .get(AppControllers.getAllCourses)
  .post(verifyToken,allowedTo(userRoles.MANAGER),validationSchema(), AppControllers.addCourse);

router
  .route("/:courseId")
  .get(AppControllers.getCourse)
  .patch(AppControllers.updateCourse)
  .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),AppControllers.deleteCourse);

module.exports = router;
