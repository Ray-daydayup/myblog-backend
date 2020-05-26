const { exec, escape } = require("../utils/mysql")

const selectList = async (params) => {
	const page = escape(params.page)
	const pagesize = escape(params.pagesize)
	const sql = `	SELECT DISTINCT
	articles.id AS article_id,
	articles.title AS title,
	articles.abstract AS abstract,
	articles.createtime AS createtime,
	articles.modifiedtime AS modifiedtime,
	categories.name AS category,
	tags.name AS tag,
	articles.categoryid AS category_id,
	articles_tags.tag_id AS tag_id,
	articles.state AS article_state 
FROM
	(((
			 (SELECT * FROM articles ORDER BY modifiedtime DESC LIMIT ${page}, ${pagesize})	articles
				JOIN categories ON ((
						articles.categoryid = categories.id 
					)))
			JOIN articles_tags ON ((
					articles.id = articles_tags.article_id 
				)))
		JOIN tags ON ((
				articles_tags.tag_id = tags.id 
      )))
WHERE 1=1`
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

const selectBYCondition = async (params) => {
	const page = escape(params.page)
	const pagesize = escape(params.pagesize)
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
WHERE 1=1 and article_id=${articleId} LIMIT ${page}, ${pagesize}`
	const result = await exec(sql)
	return result
}

module.exports = { selectList, selectOne }
