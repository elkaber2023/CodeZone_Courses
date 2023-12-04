const httpStatusText = require("../utils/utils");
const usersModel = require("../module/userModel");
const asyncWrapper = require("../module/asyncWrapper");
const appError = require("../utils/appError");
const bcrypt = require("bcrypt");
const userModel = require("../module/userModel");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = async (req, res) => {
  console.log("MY HEADER +> ", req.headers);

  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await usersModel
    .find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
};

const register = async (req, res, next) => {
  console.log("FileName=> ", req.file.filename);
  const emUser = await usersModel.findOne({ email: req.body.email });
  if (emUser) {
    const error = appError.create(
      "This email already exists",
      406,
      httpStatusText.FAIL
    );
    return next(error);
    // return res.status(406).json({status:httpStatusText.ERROR,message:'This email already exists'})
  }
  const { firstName, lastName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new usersModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  // ! generate JWT Json Web Token
  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();
  res.status(201).json({ status: httpStatusText.SUCCESS, user: { newUser } });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create(
      "This email Or Password Not Found X=>X",
      406,
      httpStatusText.FAIL
    );
    return next(error);
  }
  /*
  const findEmail = await usersModel.find({ email: email });

  if (!findEmail) {
    const error = appError.create(
      "This email Or Password Not Found X=>X",
      406,
      httpStatusText.FAIL
    );
    return next(error);
  }
*/
  const searchUser = await usersModel.findOne({ email: email });

  if (searchUser) {
    async function checkUser(searchUser, password) {
      //... fetch user from a db etc.
      searchUser = await usersModel.findOne({ email: email });
      const match = await bcrypt.compare(password, searchUser.password);

      if (match) {
        const token = await generateJWT({
          email: searchUser.email,
          id: searchUser._id,
          role: searchUser.role,
        });
        return res.status(200).json({
          status: httpStatusText.SUCCESS,
          token,
        });
      } else {
        const error = appError.create(
          "Something Wrong => The Password Not Correct",
          406,
          httpStatusText.ERROR
        );
        return next(error);
      }
    }
    checkUser(searchUser, password);
  } else {
    return res.json({ email: "This Is Email Not Found X => x" });
  }
  /*
  // const pwd = await userModel.findOne({ password: password });
  const matchedPassword =await bcrypt.compare(password, userModel.password);

  if (findEmail && matchedPassword) {
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, user: "Login Success Done !" });
  } else {
    const error = appError.create("Something Wrong", 406, httpStatusText.ERROR);
    return next(error);
  }
*/
};

module.exports = { getAllUsers, register, login };
