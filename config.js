// const env = process.env.NODE_ENV;
const env = "dev"

let MYSQL_CONFIG = {}
let secret = ""

if (env === "dev") {
	// mysql
	MYSQL_CONFIG = {
		host: "localhost",
		user: "root",
		password: "root",
		port: "3306",
		database: "myblog",
		charset: "utf8mb4",
		multipleStatements: true,
	}
	// jwt 密钥
	secret = "zw121_#jf55"
	// md5密钥
	PWD_SECRET_KEY = "zw1021*#1314"
}
if (env === "production") {
	MYSQL_CONFIG = {
		host: "localhost",
		user: "root",
		password: "root",
		port: "3306",
		database: "myblog",
		charset: "utf8mb4",
		multipleStatements: true,
	}
	secret = "zw121_#jf55"
	PWD_SECRET_KEY = "zw1021*#1314"
}

module.exports = {
	MYSQL_CONFIG,
	secret,
	PWD_SECRET_KEY,
}
