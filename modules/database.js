const Connection = {
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	server: process.env.DB_HOST,
	database: process.env.DB_NAME
}

const Statement = {
	SP: function(procedure){
		return procedure
	}	
}

exports.Connection = Connection
exports.Statement = Statement