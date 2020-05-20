const { exec, escape } = require("../utils/mysql")

const select = async (id) => {
	let sql = `select * from categories where 1=1`
	if (id) {
		sql += ` and id=${id}`
	}
	return await exec(sql)
}

const del = async (id) => {
	let sql = `delete from categories where id=${id}`
	return await exec(sql)
}

module.exports = { select, del }
