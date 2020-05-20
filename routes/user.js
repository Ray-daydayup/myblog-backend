const router = require("koa-router")()
const ParamCheck = require("../middleWares/paramCheck")
const {
	loginService,
	infoService,
	registerService,
	updateService,
	listService,
	stateService,
	delService,
} = require("../service/user")

router.prefix("/user")

router.post("/login", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		username: new ParamCheck().isString().isRequired(),
		password: new ParamCheck().isString().min(1).max(12).isRequired(),
	}
	await ParamCheck.check(params, schema, ctx)
	await loginService(params, ctx)
})

router.post("/register", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		username: new ParamCheck().isString().isRequired(),
		password: new ParamCheck().isString().min(1).max(12).isRequired(),
	}
	await ParamCheck.check(params, schema, ctx)
	await registerService(params, ctx)
})

router.post("/update", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		id: new ParamCheck().isNumber().min(1).isRequired(),
		username: new ParamCheck().isString().min(1),
		password: new ParamCheck().isString().min(1).max(12),
		state: new ParamCheck().isNumber(),
	}
	await ParamCheck.check(params, schema, ctx)
	await updateService(params, ctx)
})

router.post("/state", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		id: new ParamCheck().isNumber().min(1).isRequired(),
		flag: new ParamCheck().isBoolean().isRequired(),
	}
	await ParamCheck.check(params, schema, ctx)
	await stateService(ctx, params)
})

router.post("/del/:id", async function (ctx, next) {
	const params = {
		id: parseInt(ctx.params.id),
	}
	let schema = {
		id: new ParamCheck().isNumber().min(1).isRequired(),
	}
	await ParamCheck.check(params, schema, ctx)
	await delService(ctx, params)
})

router.get("/list", async function (ctx, next) {
	await listService(ctx)
})

router.get("/list/:id", async function (ctx, next) {
	const params = {
		id: parseInt(ctx.params.id),
	}
	let schema = {
		id: new ParamCheck().isNumber().min(1).isRequired(),
	}
	await ParamCheck.check(params, schema, ctx)
	await listService(ctx, params.id)
})

router.get("/info", async function (ctx, next) {
	await infoService(ctx)
})

module.exports = router
