const { exec, escape } = require("../utils/mysql")

const select = async (params = {}) => {
	const strArr = []
	params.hasOwnProperty("id") && strArr.push(`and id=${escape(params.id)}`)
	params.hasOwnProperty("username") &&
		strArr.push(`and username=${escape(params.username)}`)
	params.hasOwnProperty("password") &&
		strArr.push(`and password=${escape(params.password)}`)
	params.hasOwnProperty("state") &&
		strArr.push(`and state=${escape(params.state)}`)
	const sql = `select * from user where 1=1 ${strArr.join(" ")}`
	return await exec(sql)
}

const insert = async (username, password) => {
	username = escape(username)
	password = escape(password)
	const sql = `insert into user (username,password,state,permission) values(${username},${password},1,2)`
	const result = await exec(sql)
	return result
}

const update = async (params) => {
	const strArr = []
	id = escape(params.id)
	params.hasOwnProperty("username") &&
		strArr.push(`username=${escape(params.username)}`)
	params.hasOwnProperty("password") &&
		strArr.push(`password=${escape(params.password)}`)
	// console.log(strArr)
	const sql = `update user set ${strArr.join(",")} where id=${id}`
	const result = await exec(sql)
	return result
}

const softDel = async (id, flag) => {
	const state = flag ? 1 : 0
	id = escape(id)
	const sql = `update user set state=${state} where id=${id}`
	const result = await exec(sql)
	return result
}

const del = async (id) => {
	id = escape(id)
	const sql = `delete from user where id=${id}`
	const result = await exec(sql)
	return result
}

module.exports = { insert, update, select, softDel, del }
