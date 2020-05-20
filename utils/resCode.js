const SuccessModel = require("../models/http-success")
const {
	ParameterError,
	AuthError,
	NotFoundError,
	InternalServerError,
} = require("../models/http-error")
// 200 请求成功
const SUCCESS = async (ctx, data, msg) =>
	new SuccessModel(200, msg, data).success(ctx)

// 权限限制
const USER_NO_PERMISSION = async (ctx, msg = "没有权限") =>
	new SuccessModel(2100, msg).success(ctx)
// 用户错误
const USER_NOT_LOGIN = async (ctx) =>
	new SuccessModel(2001, "用户未登录").success(ctx)
const USER_ACCOUNT_EXPIRED = async (ctx) =>
	new SuccessModel(2002, "账号已过期").success(ctx)
const USER_ACCOUNT_DISABLE = async (ctx) =>
	new SuccessModel(2003, "账号不可用").success(ctx)
const USER_ACCOUNT_NOT_EXIST = async (ctx) =>
	new SuccessModel(2004, "账号不存在").success(ctx)
const USER_ACCOUNT_ALREADY_EXIST = async (ctx) =>
	new SuccessModel(2005, "账号已存在").success(ctx)
const USER_ACCOUNT_USE_BY_OTHERS = async (ctx) =>
	new SuccessModel(2006, "账号下线").success(ctx)
const USER_PWD_ERROR = async (ctx) =>
	new SuccessModel(2007, "密码错误").success(ctx)

// 400
const PARAM_NOT_VALID = async (ctx, msg = "请求参数无效") =>
	new ParameterError(1001, msg).throwErr(ctx)
const PARAM_IS_BLANK = async (ctx, msg = "请求参数为空") =>
	new ParameterError(1002, msg).throwErr(ctx)
const PARAM_TYPE_ERROR = async (ctx, msg = "请求参数类型错误") =>
	new ParameterError(1003, msg).throwErr(ctx)
const PARAM_NOT_COMPLETE = async (ctx, msg = "请求参数缺失") =>
	new ParameterError(1004, msg).throwErr(ctx)

// 401
// const generateErr = async (CLASS) => {
//   return (ctx,code,msg) => {
//     new CLASS(code, msg).throwErr(ctx)
//   }

// }
// const TOKEN_IS_BLANK = generateErr(AuthError)(ctx,401,'token为空')
const TOKEN_IS_BLANK = async (ctx) =>
	new AuthError(401, "token为空").throwErr(ctx)
const TOKEN_EXPIRED = async (ctx) =>
	new AuthError(4001, "token过期").throwErr(ctx)
const TOKEN_INVALID = async (ctx) =>
	new AuthError(4002, "token无效").throwErr(ctx)
const AUTHENTICATION_FAIL = async (ctx, msg = "认证失败") =>
	new AuthError(4003, msg).throwErr(ctx)

// 404
const NotFound = async (ctx) =>
	new NotFoundError(
		404,
		"未找到api，请检查请求路径以及请求方法是否出错"
	).throwErr(ctx)

// 500
const FAIL = async (ctx, msg) => new InternalServerError(500, msg).throwErr(ctx)
const FILE_UPLOAD_FAIL = async (ctx) =>
	new InternalServerError(5001, "文件上传失败").throwErr(ctx)

module.exports = {
	SUCCESS,
	USER_NO_PERMISSION,
	USER_NOT_LOGIN,
	USER_ACCOUNT_EXPIRED,
	USER_ACCOUNT_DISABLE,
	USER_ACCOUNT_NOT_EXIST,
	USER_ACCOUNT_ALREADY_EXIST,
	USER_ACCOUNT_USE_BY_OTHERS,
	USER_PWD_ERROR,
	PARAM_NOT_VALID,
	PARAM_IS_BLANK,
	PARAM_TYPE_ERROR,
	PARAM_NOT_COMPLETE,
	TOKEN_IS_BLANK,
	TOKEN_EXPIRED,
	TOKEN_INVALID,
	AUTHENTICATION_FAIL,
	NotFound,
	FAIL,
	FILE_UPLOAD_FAIL,
}

// /* 接口异常 */
// FILE_UPLOAD_FAIL(3001, "文件上传失败")
// HTTP_CONTENT_TYPE_ERROR(3002, "HTTP请求content-type错误")
// HTTP_REQUEST_METHOD_NOT_SUPPORTED(3003, "不支持的HTTP请求方法")
// RRQUEST_PARAMETER_MISSING(3004, "请求参数缺失")
// PATH_VARIABLE_MISSING(3005, "路径参数缺失")
// JSON_PARSE_ERROR(3006, "JSON解析异常")
