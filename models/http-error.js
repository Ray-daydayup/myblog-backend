class ErrorModel {
	constructor(code, msg, statusCode) {
		this.code = code || 500
		this.msg = msg || "未知服务器错误"
		this.statusCode = statusCode || 500
	}
	throwErr(ctx) {
		ctx.throw(this.statusCode, this.msg, {
			code: this.code,
			flag: "ErrorModel",
		})
	}
}

class ParameterError extends ErrorModel {
	constructor(code, msg = "请求错误") {
		super(code, msg, 400)
	}
}

class AuthError extends ErrorModel {
	constructor(code, msg = "token认证失败") {
		super(code, msg, 401)
	}
}

class NotFoundError extends ErrorModel {
	constructor(code, msg = "未找到该api") {
		super(code, msg, 404)
	}
}

class InternalServerError extends ErrorModel {
	constructor(code, msg = "服务器内部错误") {
		super(code, msg, 500)
	}
}

module.exports = {
	ErrorModel,
	ParameterError,
	AuthError,
	NotFoundError,
	InternalServerError,
}
