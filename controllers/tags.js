const { exec, escape } = require("../utils/mysql")

const select = async (params = {}) => {
	const strArr = []
	params.hasOwnProperty("id") && strArr.push(`and id=${escape(params.id)}`)
	params.hasOwnProperty("name") &&
		strArr.push(`and name=${escape(params.name)}`)
	params.hasOwnProperty("state") &&
		strArr.push(`and state=${escape(params.state)}`)
	const sql = `select * from tags where 1=1 ${strArr.join(" ")}`
	return await exec(sql)
}

const insert = async (params) => {
	const name = escape(params.name)
	const description = escape(params.description)
	const sql = `insert into tags (name,description,state) values(${name},${description},1)`
	const result = await exec(sql)
	return result
}
const update = async (params) => {
	const strArr = []
	id = escape(params.id)
	params.hasOwnProperty("name") && strArr.push(`name=${escape(params.name)}`)
	params.hasOwnProperty("description") &&
		strArr.push(`description=${escape(params.description)}`)
	// console.log(strArr)
	const sql = `update tags set ${strArr.join(",")} where id=${id}`
	const result = await exec(sql)
	return result
}

const del = async (id) => {
	let sql = `delete from tags where id=${id}`
	return await exec(sql)
}

module.exports = { select, del, insert, update }
