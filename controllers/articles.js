const { exec, escape } = require("../utils/mysql")

const select = async (title) => {
	title = escape(title)
	const sql = `select title from articles where title=${title};`
	const result = await exec(sql)
	return result
}

const insert = async (params) => {
	const sql = `insert into articles (title,abstract,content,createtime,modifiedtime,categoryid,state) values(${escape(
		params.title
	)},${escape(params.abstract)},${escape(params.content)},${escape(
		params.createtime
	)},${escape(params.createtime)},${escape(params.categoryid)},${escape(
		params.state
	)});`
	const result = await exec(sql)
	return result
}
const update = async (params) => {
	const strArr = []
	const articleId = escape(params.articleId)
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
	let sql = `update articles set ${strArr.join(",")} where id=${articleId};`
	if (params.hasOwnProperty("tagsId")) {
		sql += `delete from articles_tags where article_id=${articleId};`
		let strArr = params.tagsId.map((item) => `(${articleId},${escape(item)})`)
		sql += `insert into articles_tags (article_id,tag_id) values ${strArr.join(
			","
		)};`
	}
	const result = await exec(sql)
	return result
}

const del = async (params) => {
	const articleId = escape(params.articleId)
	let sql = `delete from articles where id=${articleId}`
	return await exec(sql)
}

module.exports = { del, insert, update, select }
