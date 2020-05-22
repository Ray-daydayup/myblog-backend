class ErrorModel {
	constructor(code = 500, msg = "未知服务器错误", statusCode = 500) {
		this.code = code
		this.msg = msg
		this.statusCode = statusCode
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
