module.exports = class SQL {

	static insert(table, col, data) {
		return new Promise((resolve, reject) => {
			let sql = `insert into ${table} set data=?`;
			connection.query(sql, data, function (error, results, fields) {
			  if (error) reject(error);
			  resolve(results);
			});
		})
		
	}
}