const { select, del } = require("../controllers/category")
const { tokenSign } = require("../utils/token")
const { generatePassword } = require("../utils/cryp")
const {
	SUCCESS,
	USER_NO_PERMISSION,
	USER_NOT_LOGIN,
	USER_ACCOUNT_EXPIRED,
	USER_ACCOUNT_DISABLE,
	USER_ACCOUNT_NOT_EXIST,
	USER_ACCOUNT_ALREADY_EXIST,
	USER_ACCOUNT_USE_BY_OTHERS,
	USER_PWD_ERROR,
} = require("../utils/resCode")

async function selectService(ctx, id) {
	const result = await select(id)
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
module.exports = { selectService, delService }
