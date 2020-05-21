const router = require("koa-router")()
const ParamCheck = require("../middleWares/paramCheck")
const {
	selectService,
	delService,
	updateService,
	insertService,
} = require("../service/category")

router.prefix("/category")

router.get("/list", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		id: new ParamCheck().isNumber(),
	}
	await ParamCheck.check(params, schema, ctx)
	await selectService(ctx)
})

router.get("/list/:id", async function (ctx, next) {
	const params = {
		id: parseInt(ctx.params.id),
	}
	let schema = {
		id: new ParamCheck().isNumber().min(1),
	}
	await ParamCheck.check(params, schema, ctx)
	await selectService(ctx, params)
})
router.post("/add", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		name: new ParamCheck().isString().min(1).isRequired(),
		description: new ParamCheck().isString(),
	}
	await ParamCheck.check(params, schema, ctx)
	await insertService(ctx, params)
})
router.post("/update", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		id: new ParamCheck().isNumber().min(1).isRequired(),
		name: new ParamCheck().isString().min(1),
		description: new ParamCheck().isString(),
	}
	await ParamCheck.check(params, schema, ctx)
	await updateService(ctx, params)
})
router.post("/del/:id", async function (ctx, next) {
	const params = {
		id: parseInt(ctx.params.id),
	}
	let schema = {
		id: new ParamCheck().isNumber().min(1),
	}
	await ParamCheck.check(params, schema, ctx)
	await delService(ctx, params.id)
})

module.exports = router
