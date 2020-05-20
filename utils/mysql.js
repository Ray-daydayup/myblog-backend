const mysql = require("mysql")
const { MYSQL_CONFIG } = require("../config")
const pool = mysql.createPool(MYSQL_CONFIG)
// connect.connect((err) => console.log("connectErr :>> ", err));
const exec = (sql) => {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, conn) {
			if (err) {
				reject(err)
			} else {
				conn.query(sql, (err, res) => {
					//事件驱动回调
					if (err) {
						reject(err)
						return
					}
					resolve(res)
				})
				//释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
				conn.release()
			}
		})
	})
}

module.exports = {
	exec,
	escape: mysql.escape,
}
