const { select, del, insert, update } = require("../controllers/tags")
const {
	SUCCESS,
	USER_NO_PERMISSION,
	USER_ACCOUNT_ALREADY_EXIST,
} = require("../utils/resCode")

async function selectService(ctx, params) {
	const result = await select(params)
	await SUCCESS(ctx, result)
}
async function delService(ctx, id) {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	const result = await del(id)
	await SUCCESS(ctx, { line: result.affectedRows })
}

async function updateService(ctx, params) {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	const selectRes = await select({ name: params.name })
	if (selectRes[0]) {
		await USER_ACCOUNT_ALREADY_EXIST(ctx, "标签已存在")
		return
	}
	const result = await update(params)
	await SUCCESS(ctx, { line: result.affectedRows })
}
async function insertService(ctx, params) {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	const selectRes = await select({ name: params.name })
	if (selectRes[0]) {
		await USER_ACCOUNT_ALREADY_EXIST(ctx, "标签已存在")
		return
	}
	const result = await insert(params)
	await SUCCESS(ctx, { id: result.insertId })
}
module.exports = { selectService, delService, updateService, insertService }
