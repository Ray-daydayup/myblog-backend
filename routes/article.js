const router = require("koa-router")()
const ParamCheck = require("../middleWares/paramCheck")
const {
	insertService,
	delService,
	updateService,
} = require("../service/article")

router.prefix("/article")

router.get("/list", async function (ctx, next) {})

router.get("/list/:id", async function (ctx, next) {})
router.post("/add", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		title: new ParamCheck().isString().min(1).isRequired(),
		abstract: new ParamCheck().isString().min(1).isRequired(),
		content: new ParamCheck().isString().min(1).isRequired(),
		createtime: new ParamCheck().isNumber().min(1).isRequired(),
		categoryid: new ParamCheck().isNumber().min(1).isRequired(),
		state: new ParamCheck().isNumber().isRequired(),
		tagsId: new ParamCheck().isArray().min(1).isRequired(),
	}
	await ParamCheck.check(params, schema, ctx)
	await insertService(ctx, params)
})
router.post("/update", async function (ctx, next) {
	const params = ctx.request.body
	let schema = {
		articleId: new ParamCheck().isNumber().min(1).isRequired(),
		title: new ParamCheck().isString().min(1),
		abstract: new ParamCheck().isString().min(1),
		content: new ParamCheck().isString().min(1),
		modifiedtime: new ParamCheck().isNumber().min(1),
		categoryid: new ParamCheck().isNumber().min(1),
		state: new ParamCheck().isNumber(),
		tagsId: new ParamCheck().isArray().min(1),
	}
	await ParamCheck.check(params, schema, ctx)
	await updateService(ctx, params)
})
router.post("/del/:id", async function (ctx, next) {
	const params = {
		articleId: parseInt(ctx.params.id),
	}
	let schema = {
		articleId: new ParamCheck().isNumber().min(1).isRequired(),
	}
	await ParamCheck.check(params, schema, ctx)
	await delService(ctx, params)
})

module.exports = router
