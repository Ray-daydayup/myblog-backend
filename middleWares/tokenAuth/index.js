"use strict"

const pAny = require("p-any")
const unless = require("koa-unless")
const verify = require("./verify")
const getSecret = require("./get-secret")
const resolveAuthHeader = require("./resolvers/auth-header")
const resolveCookies = require("./resolvers/cookie")
const {
	TOKEN_IS_BLANK,
	TOKEN_EXPIRED,
	TOKEN_INVALID,
	AUTHENTICATION_FAIL,
} = require("../../utils/resCode")

module.exports = (opts = {}) => {
	const {
		debug,
		getToken,
		isRevoked,
		key = "user",
		passthrough,
		tokenKey,
	} = opts
	const tokenResolvers = [resolveCookies, resolveAuthHeader]

	if (getToken && typeof getToken === "function") {
		tokenResolvers.unshift(getToken)
	}

	const middleware = async function jwt(ctx, next) {
		let token
		tokenResolvers.find((resolver) => (token = resolver(ctx, opts)))

		if (!token && !passthrough) {
			if (debug) {
				await TOKEN_IS_BLANK(ctx)
			} else {
				await AUTHENTICATION_FAIL(ctx)
			}
			// ctx.throw(401, debug ? 'Token not found' : 'Authentication Error',{
			//   code: 4003,
			//   flag: "ErrorModel",
			// });
		}

		let {
			state: { secret = opts.secret },
		} = ctx

		try {
			if (typeof secret === "function") {
				secret = await getSecret(secret, token)
			}

			if (!secret) {
				throw new Error("Secret not provided")
			}

			let secrets = Array.isArray(secret) ? secret : [secret]
			const decodedTokens = secrets.map(async (s) => {
				return await verify(token, s, opts)
			})

			const decodedToken = await pAny(decodedTokens).catch(function (err) {
				if (err instanceof pAny.AggregateError) {
					for (const e of err) {
						throw e
					}
				} else {
					throw err
				}
			})

			if (isRevoked) {
				const tokenRevoked = await isRevoked(ctx, decodedToken, token)
				if (tokenRevoked) {
					throw new Error("Token revoked")
				}
			}

			ctx.state[key] = decodedToken
			if (tokenKey) {
				ctx.state[tokenKey] = token
			}
		} catch (e) {
			if (!passthrough) {
				if (debug) {
					if (e.name === "TokenExpiredError") {
						await TOKEN_EXPIRED(ctx)
					} else {
						if (
							e.name === "JsonWebTokenError" &&
							e.message === "invalid signature"
						) {
							await TOKEN_INVALID(ctx)
						} else {
							const msg = e.message
							ctx.throw(401, msg, { code: 4003, flag: "ErrorModel" })
						}
					}
				} else {
					await AUTHENTICATION_FAIL(ctx)
				}
			} else {
				//lets downstream middlewares handle JWT exceptions
				ctx.state.jwtOriginalError = e
			}
		}

		return next()
	}

	middleware.unless = unless
	return middleware
}
