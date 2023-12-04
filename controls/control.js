const { validationResult } = require("express-validator");
// let { courses } = require("../data/courses");
// ! Utils
const httpStatusText = require("../utils/utils");

const myModel = require("../module/course.module");
const asyncWrapper = require("../module/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourses = async (req, res) => {
  // console.log(req.url);
  const query = req.query;
  // console.log("My Query => ", query);
  const limit = query.limit || 10;
  const pages = query.page || 1;
  const skip = (pages - 1) * limit;
  const courses = await myModel
    .find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  // console.log("courses => ", courses);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
};

const getCourse = asyncWrapper(async (req, res, next) => {
  const MyCourses = await myModel.findById(req.params.courseId);
  // console.log(MyCourses);
  if (!MyCourses) {
    const error = appError.create(
      "I chang Error Msg X",
      404,
      httpStatusText.FAIL
    );
    return next(error);

    // return res.status(404).json({
    //   status: httpStatusText.FAIL,
    //   data: { course: "This Course Not Found" },
    // });
  } else {
    return res.json({ status: httpStatusText.SUCCESS, corse: MyCourses });
  }

  // try {
  // } catch (err) {
  //   return res.status(400).json({
  //     status: httpStatusText.ERROR,
  //     data: null,
  //     code: 400,
  //     message: err.message,
  //   });
  // }
});

const addCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, error: errors.array() });
  }
  const newCourse = new myModel(req.body);

  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
};

const updateCourse = async (req, res) => {
  try {
    const myId = req.params.courseId;
    console.log("MY ID => ", myId);
    const updateCourse = await myModel.updateOne(
      { _id: myId },
      {
        $set: { ...req.body },
      }
    );
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: updateCourse });
  } catch (e) {
    return res
      .status(400)
      .json({ status: httpStatusText.ERROR, error: e.message });
  }
};

const deleteCourse = async (req, res) => {
  await myModel.deleteOne({ _id: req.params.courseId });
  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
};

module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
