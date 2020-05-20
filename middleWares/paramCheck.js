const {
	PARAM_NOT_VALID,
	PARAM_IS_BLANK,
	PARAM_TYPE_ERROR,
	PARAM_NOT_COMPLETE,
	FAIL,
} = require("../utils/resCode")
/**
 * 请求参数检验
 *
 * @class paramCheck
 */
class paramCheck {
	constructor() {
		this.rules = {}
	}
	static async check(params, schema, ctx) {
		const keys = Object.keys(schema)
		// console.log(keys)
		try {
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i]
				let rules = schema[key].rules
				// console.log(rules)
				rulesCheck(params, key, rules)
			}
			return
			// return keys.every(async (key) => {

			// })
		} catch (error) {
			switch (error.name) {
				case "paramNotComplete":
					await PARAM_NOT_COMPLETE(ctx, error.message)
					break
				case "paramTypeError":
					// console.error(error)
					// ctx.throw(500, "u9ud9")
					await PARAM_TYPE_ERROR(ctx, error.message)
					break
				case "paramNotValid":
					await PARAM_NOT_VALID(ctx, error.message)
					break
				default:
					await FAIL(ctx, error.message)
					break
			}
		}
	}
	// 类型规则
	isString() {
		this.rules.type = "string"
		return this
	}
	isNumber() {
		this.rules.type = "number"
		return this
	}
	isBoolean() {
		this.rules.type = "boolean"
		return this
	}
	isObject() {
		this.rules.type = Object
		return this
	}
	isArray() {
		this.rules.type = Array
		return this
	}
	// 长度规则
	min(min) {
		this.rules.min = min
		return this
	}
	max(max) {
		this.rules.max = max
		return this
	}
	// 是否必须
	isRequired() {
		this.rules.isRequired = true
		return this
	}
	// // 是否拥有某值
	// has(...args) {
	//   this.rules.has = args
	//   return this
	// }
	// regCheckRule(reg) {
	//   this.rules.reg = reg
	//   return this
	// }
}

class ParamError extends Error {
	constructor(msg, name) {
		super(msg)
		this.name = name
	}
}

function rulesCheck(params, key, rules) {
	if (!requiredCheck()) {
		return false
	}
	typeCheck()
	lengthCheck()
	return true
	function requiredCheck() {
		if (rules.isRequired && !params.hasOwnProperty(key)) {
			throw new ParamError(`请求参数${key}缺失`, "paramNotComplete")
		}
		if (!rules.isRequired && !params.hasOwnProperty(key)) {
			return false
		}
		return true
	}
	function typeCheck() {
		if (rules.type) {
			const type = rules.type
			if (
				typeof params[key] === type ||
				(typeof type !== "string" && params[key] instanceof type)
			) {
				return
			}
			throw new ParamError(`请求参数${key}类型错误`, "paramTypeError")
		}
	}
	function lengthCheck() {
		const min = rules.min ? rules.min : 0
		const max = rules.max ? rules.max : Infinity
		const type = rules.type
		let length = 0
		if (type === "string") {
			length = params[key].length
		}
		if (type === "number") {
			length = params[key]
		}
		if (length < min || length > max) {
			throw new ParamError(`请求参数${key}长度无效`, "paramNotValid")
		}
	}
}

module.exports = paramCheck
