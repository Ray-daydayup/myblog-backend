const articles = require("../controllers/articles")
const articlesTags = require("../controllers/articles_tags")
const {
	SUCCESS,
	USER_NO_PERMISSION,
	USER_ACCOUNT_ALREADY_EXIST,
} = require("../utils/resCode")

async function delService(ctx, params) {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	const articlesResult = await articles.del(params)
	await SUCCESS(ctx, {
		articlesLine: articlesResult.affectedRows,
	})
}

async function updateService(ctx, params) {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	if (params.hasOwnProperty("title")) {
		const selectRes = await articles.select(params.title)
		if (selectRes[0]) {
			await USER_ACCOUNT_ALREADY_EXIST(ctx, "文章标题已存在")
			return
		}
	}
	const articlesResult = await articles.update(params)
	await SUCCESS(ctx, {
		line: articlesResult.affectedRows || articlesResult[0].affectedRows,
	})
}
async function insertService(ctx, params) {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	const selectRes = await articles.select(params.title)
	if (selectRes[0]) {
		await USER_ACCOUNT_ALREADY_EXIST(ctx, "文章标题已存在")
		return
	}
	const articlesRes = await articles.insert(params)
	const articlesTagsParams = {
		articleId: articlesRes.insertId,
		tagsId: params.tagsId,
	}
	const articlesTagsRes = await articlesTags.insert(articlesTagsParams)
	await SUCCESS(ctx, { articleId: articlesRes.insertId })
}
module.exports = { delService, updateService, insertService }
