const crypto = require("crypto")

// 密匙
const { PWD_SECRET_KEY } = require("../config")

// md5 加密
function md5(content) {
	let md5 = crypto.createHash("md5")
	return md5.update(content).digest("hex")
}

// 加密函数
function generatePassword(password) {
	const str = `password=${password}&key=${PWD_SECRET_KEY}`
	return md5(str)
}

module.exports = {
	generatePassword,
}
