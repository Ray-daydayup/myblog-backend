const Koa = require("koa")
const app = new Koa()
const json = require("koa-json")
const bodyparser = require("koa-bodyparser")
const logger = require("koa-logger")
const jwtKoa = require("./middleWares/tokenAuth/index")
const catchError = require("./middleWares/catchError")
const { NotFound } = require("./utils/resCode")
const { secret } = require("./config")

// 全局处理错
app.use(catchError)

// middlewares
app.use(
	bodyparser({
		enableTypes: ["json", "form", "text"],
	})
)
app.use(json())
app.use(logger())
app.use(require("koa-static")(__dirname + "/public"))

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// jwt
app.use(
	jwtKoa({ debug: true, secret }).unless({
		path: [
			"/",
			"/user/login",
			"/user/register",
			/^\/category\/list/,
			/^\/tag\/list/,
			/^\/article\/list/,
		],
	})
)

// routes
const user = require("./routes/user")
const category = require("./routes/category")
const tag = require("./routes/tags")
const article = require("./routes/article")

app.use(user.routes(), user.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(tag.routes(), tag.allowedMethods())
app.use(article.routes(), article.allowedMethods())

// 404
app.use(async (ctx, next) => {
	await NotFound(ctx)
})
// error-handling
app.on("error", (err, ctx) => {
	const code = err.statusCode || err.status || 500
	if (code === 500) {
		console.error("error>>>", err, ctx)
	}
})

module.exports = app
