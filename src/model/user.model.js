const db = require("../config/db");

const userModel = {
	getAllUser: () => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users`)
				.then((results) => {
					resolve(results);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	getDetailUser: (id_user) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users WHERE id_user = '${id_user}'`)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	registerAccount: (data) => {
		return new Promise((resolve, reject) => {
			db.query(
				`INSERT INTO users (id_user, name, email, password, phone)
      VALUES
      ($1, $2, $3, $4, $5)`,
				[data.id_user, data.name, data.email, data.password, data.phone]
			)
				.then((results) => {
					resolve(results);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	accountCheck: (email) => {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM users WHERE email = '${email}'`)
				.then((results) => {
					resolve(results);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	updateAccount: (data) => {
		return new Promise((resolve, reject) => {
			db.query(
				`UPDATE users SET
			name = COALESCE ($1, name),
			phone = COALESCE ($2, phone)
			WHERE id_user = $3`,
				[data.name, data.phone, data.id_user]
			)
				.then((results) => {
					resolve(results);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
};

module.exports = userModel;
