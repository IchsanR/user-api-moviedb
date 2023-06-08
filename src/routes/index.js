const express = require("express");
const jwtAuth = require("../middleware/auth.token");
const {
	registerUser,
	getAllUser,
	userLogin,
	updateAccount,
	getDetailUser,
} = require("../controller/user.controller");

const userRouter = express.Router();

userRouter
	.get("/users", getAllUser)
	.get("/users/:id_user", getDetailUser)
	.post("/users", registerUser)
	.post("/login", userLogin)
	.patch("/users", jwtAuth, updateAccount);

module.exports = userRouter;
