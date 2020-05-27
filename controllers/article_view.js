const { exec, escape } = require("../utils/mysql")

const selectList = async (params) => {
	const page = escape(params.page)
	const pagesize = escape(params.pagesize)
	const strArr = []
	params.hasOwnProperty("categoryId") &&
		strArr.push(`and categoryid=${escape(params.categoryId)}`)
	let str = ""
	if (params.moreDetail) {
		str = `,articles.abstract AS abstract,articles.content AS content,articles.state AS article_state`
	}
	const sql = `	SELECT DISTINCT
	articles.id AS article_id,
	articles.title AS title,
  articles.createtime AS createtime,
  articles.modifiedtime AS modifiedtime,
  categories.name AS category,tags.name AS tag,articles.categoryid AS category_id,articles_tags.tag_id AS tag_id${str} 
FROM
	(((
			 (SELECT * FROM articles WHERE 1=1 ${strArr.join(
					" "
				)} ORDER BY modifiedtime DESC LIMIT ${page}, ${pagesize})	articles
				JOIN categories ON ((
						articles.categoryid = categories.id 
					)))
			JOIN articles_tags ON ((
					articles.id = articles_tags.article_id 
				)))
		JOIN tags ON ((
				articles_tags.tag_id = tags.id 
      )))
WHERE 1=1 ORDER BY modifiedtime DESC`
	const result = await exec(sql)
	return result
}

const selectOne = async (params) => {
	const articleId = escape(params.articleId)
	const sql = `	SELECT DISTINCT
	articles.id AS article_id,
	articles.title AS title,
	articles.abstract AS abstract,
  articles.content AS content,
	articles.createtime AS createtime,
	articles.modifiedtime AS modifiedtime,
	categories.name AS category,
	tags.name AS tag,
	articles.categoryid AS category_id,
	articles_tags.tag_id AS tag_id,
	articles.state AS article_state 
FROM
	(((
			 (SELECT * FROM articles ORDER BY modifiedtime DESC )	articles
				JOIN categories ON ((
						articles.categoryid = categories.id 
					)))
			JOIN articles_tags ON ((
					articles.id = articles_tags.article_id 
				)))
		JOIN tags ON ((
				articles_tags.tag_id = tags.id 
      )))
WHERE 1=1 and article_id=${articleId}`
	const result = await exec(sql)
	return result
}

const selectBYTagId = async (params) => {
	const page = escape(params.page)
	const pagesize = escape(params.pagesize)
	const strArr = []
	params.hasOwnProperty("tagId") &&
		strArr.push(`and tag_id=${escape(params.tagId)}`)
	let str = ""
	if (params.moreDetail) {
		str = `,articles.abstract AS abstract,articles.content AS content,articles.state AS article_state`
	}
	const sql = `	SELECT DISTINCT
	articles.id AS article_id,
	articles.title AS title,
  articles.createtime AS createtime,
  articles.modifiedtime AS modifiedtime,
  categories.name AS category,tags.name AS tag,articles.categoryid AS category_id,articles_tags.tag_id AS tag_id${str} 
FROM
	(((
			 (SELECT * FROM articles )	articles
				JOIN categories ON ((
						articles.categoryid = categories.id 
					)))
			JOIN articles_tags ON ((
					articles.id = articles_tags.article_id 
				)))
		JOIN tags ON ((
				articles_tags.tag_id = tags.id 
      )))
WHERE 1=1 ${strArr.join(
		" "
	)} ORDER BY modifiedtime DESC LIMIT ${page}, ${pagesize}`
	const result = await exec(sql)
	return result
}

module.exports = { selectList, selectOne, selectBYTagId }
