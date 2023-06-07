const userModel = require("../model/user.model");
const { response } = require("../helper/response.helper");
const { v4: uuidv4 } = require("uuid");
const { hash, compare } = require("bcrypt");
const { generateToken, expiredToken } = require("../helper/auth.helper");

const userController = {
	getAllUser: (req, res) => {
		try {
			userModel
				.getAllUser()
				.then((result) => {
					result.rows.map((item) => delete item.password);
					response(
						res,
						200,
						result.rows,
						"Success",
						"User Berhasil Didapatkan"
					);
				})
				.catch((error) => {
					response(res, 404, error, "Failed", "User Gagal Didapatkan");
				});
		} catch (error) {
			response(res, 500, error, "Error", "Internal Server Error");
		}
	},

	getDetailUser: async (req, res) => {
		try {
			const { userId } = req.params;

			await userModel
				.getDetailUser(userId)
				.then((result) => {
					delete result.rows[0].password;
					response(
						res,
						200,
						result.rows,
						"Success",
						"User Berhasil Didapatkan"
					);
				})
				.catch((error) => {
					response(res, 404, error, "Failed", "User Gagal Didapatkan");
				});
		} catch (error) {
			response(res, 500, error, "Error", "Internal Server Error");
		}
	},

	registerUser: async (req, res) => {
		try {
			const body = req.body;
			const hashedPassword = await hash(body.password, 10);
			const userId = uuidv4();
			const data = {
				id_user: userId,
				name: body.name,
				email: body.email,
				password: hashedPassword,
				phone: body.phone,
			};

			await userModel.accountCheck(data.email).then((result) => {
				if (result.rowCount === 0) {
					userModel
						.registerAccount(data)
						.then((result) => {
							response(
								res,
								200,
								result.rows,
								"Success",
								"Akun Berhasil Didaftarkan"
							);
						})
						.catch((error) => {
							response(res, 422, error, "Failed", "Gagal Registrasi Akun");
						});
				} else {
					response(res, 409, null, "Failed", "Email Telah Terdaftar");
				}
			});
		} catch (error) {
			response(res, 500, error, "Error", "Internal Server Error");
		}
	},

	userLogin: async (req, res) => {
		try {
			const { email, password } = req.body;

			await userModel.accountCheck(email).then((result) => {
				if (result.rowCount === 1) {
					const user = result.rows[0];
					compare(password, user.password).then((result) => {
						if (result) {
							const token = generateToken({
								id_user: user.id_user,
								email: user.email,
								name: user.name,
							});
							delete user.password;
							response(
								res,
								200,
								{
									token,
									user,
								},
								"Success",
								"Login Berhasil"
							);
						} else {
							response(res, 404, null, "Failed", "Email dan Password Salah");
						}
					});
				} else {
					response(res, 404, null, "Failed", "Email dan Password Salah");
				}
			});
		} catch (error) {
			response(res, 500, error, "Error", "Internal Server Error");
		}
	},

	updateAccount: async (req, res) => {
		try {
			const body = req.body;
			const { id_user } = req.decoded;
			const data = {
				name: body.name,
				phone: body.phone,
				id_user,
			};
			await userModel
				.updateAccount(data)
				.then((result) => {
					response(res, 200, result, "Success", "Update Data Berhasil");
				})
				.catch((error) => {
					response(res, 409, error, "Failed", "Data Gagal Diupdate");
				});
		} catch (error) {
			response(res, 500, error, "Error", "Internal Server Error");
		}
	},
};

module.exports = userController;
