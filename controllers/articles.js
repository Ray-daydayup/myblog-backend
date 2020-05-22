const { exec, escape } = require("../utils/mysql")

const insert = async (params) => {
	const sql = `insert into articles (title,abstract,content,createtime,categoryid,state) values(${escape(
		params.title
	)},${escape(params.abstract)},${escape(params.content)},${escape(
		params.createtime
	)},${escape(params.categoryid)},1)`
	const result = await exec(sql)
	return result
}
const update = async (params) => {
	const strArr = []
	id = escape(params.id)
	params.hasOwnProperty("title") && strArr.push(`title=${escape(params.title)}`)
	params.hasOwnProperty("abstract") &&
		strArr.push(`abstract=${escape(params.abstract)}`)
	params.hasOwnProperty("content") &&
		strArr.push(`content=${escape(params.content)}`)
	params.hasOwnProperty("modifiedtime") &&
		strArr.push(`modifiedtime=${escape(params.modifiedtime)}`)
	params.hasOwnProperty("categoryid") &&
		strArr.push(`categoryid=${escape(params.categoryid)}`)
	params.hasOwnProperty("state") && strArr.push(`state=${escape(params.state)}`)
	const sql = `update articles set ${strArr.join(",")} where id=${id}`
	const result = await exec(sql)
	return result
}

const del = async (id) => {
	let sql = `delete from articles where id=${id}`
	return await exec(sql)
}

module.exports = { del, insert, update }
