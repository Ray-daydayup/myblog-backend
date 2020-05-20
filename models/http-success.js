class SuccessModel {
	constructor(code, msg, data) {
		this.code = code || 200
		this.msg = msg || "操作成功"
		if (data) {
			this.data = data
		}
	}
	success(ctx) {
		// ctx.set("Content-Type", "application/json;charset=utf8mb4")
		ctx.body = this
	}
}

module.exports = SuccessModel
