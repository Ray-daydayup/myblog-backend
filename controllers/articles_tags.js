const { exec, escape } = require("../utils/mysql")

const insert = async (params) => {
	const articleId = escape(params.articleId)
	const strArr = params.tagsId.map((item) => `(${articleId},${escape(item)})`)
	const sql = `insert into articles_tags (article_id,tag_id) values ${strArr.join(
		","
	)};`
	const result = await exec(sql)
	return result
}

const del = async (params) => {
	const articleId = escape(params.articleId)
	let sql = `delete from articles_tags where article_id=${articleId}`
	return await exec(sql)
}

module.exports = { del, insert }
