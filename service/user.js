const { insert, update, select, softDel, del } = require("../controllers/user")
const { tokenSign } = require("../utils/token")
const { generatePassword } = require("../utils/cryp")
const {
	SUCCESS,
	USER_NO_PERMISSION,
	USER_ACCOUNT_DISABLE,
	USER_ACCOUNT_NOT_EXIST,
	USER_ACCOUNT_ALREADY_EXIST,
	USER_PWD_ERROR,
} = require("../utils/resCode")
// 登录
const loginService = async (params, ctx) => {
	const password = generatePassword(params.password)
	const condition = { username: params.username }
	const result = await select(condition)
	if (!result[0]) {
		await USER_ACCOUNT_NOT_EXIST(ctx)
		return
	}
	if (result[0].state === 0) {
		await USER_ACCOUNT_DISABLE(ctx)
		return
	}
	if (result[0].password !== password) {
		await USER_PWD_ERROR(ctx)
		return
	}
	await SUCCESS(
		ctx,
		{
			token: tokenSign({
				id: result[0].id,
				username: params.username,
				permission: result[0].permission,
			}),
		},
		"登录成功"
	)
}
// 获取用户信息
const infoService = async (ctx) => {
	await SUCCESS(ctx, ctx.state.user)
}
// 注册
const registerService = async (params, ctx) => {
	const password = generatePassword(params.password)
	const condition = { username: params.username }
	const result = await select(condition)
	if (result[0]) {
		await USER_ACCOUNT_ALREADY_EXIST(ctx)
		return
	}
	const insertRes = await insert(params.username, password)
	await SUCCESS(
		ctx,
		{
			id: insertRes.insertId,
			username: params.username,
		},
		"注册成功"
	)
}
// 更新
const updateService = async (params, ctx) => {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1 || userInfo.id !== params.id) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	if (params.hasOwnProperty("username")) {
		const condition = { username: params.username }
		const result = await select(condition)
		if (result[0]) {
			await USER_ACCOUNT_ALREADY_EXIST(ctx)
			return
		}
	}
	if (params.hasOwnProperty("password")) {
		params.password = generatePassword(params.password)
	}

	const updateRes = await update(params)
	console.log(updateRes)
	await SUCCESS(ctx, {
		line: updateRes.affectedRows,
	})
}
// 获取用户列表
const listService = async (ctx, id) => {
	if (id) {
		const condition = { id: id }
		const result = await select(condition)
		if (!result[0]) {
			await USER_ACCOUNT_NOT_EXIST(ctx)
			return
		}
		await SUCCESS(ctx, result[0])
		return
	}
	const result = await select()
	await SUCCESS(ctx, result)
}
// 控制账号状态
const stateService = async (ctx, params) => {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	const result = await softDel(params.id, params.flag)
	await SUCCESS(ctx, { line: result.affectedRows })
}
// 删除账号
const delService = async (ctx, params) => {
	const userInfo = ctx.state.user
	if (userInfo.permission !== 1) {
		await USER_NO_PERMISSION(ctx)
		return
	}
	const result = await del(params.id)
	await SUCCESS(ctx, result)
}

module.exports = {
	loginService,
	infoService,
	registerService,
	updateService,
	listService,
	stateService,
	delService,
}
