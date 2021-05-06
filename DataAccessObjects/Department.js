//* Constructor for department
class Department {
	constructor(id, name) {
		this.id = id;
		this.name = name;
	};

	getId() {
		return this.id;
	};

	getName() {
		return this.name;
	};

	setId(id) {
		this.id = id;
	};

	setName(name) {
		this.name = name;
	};

	add(connection, callback) {
		const queryStmt =  `INSERT INTO
							  department (
								  name
							  ) VALUES (
								  "${this.name}"
							  )`;
		connection.query(queryStmt, (err, result) => {
			if (err)
				callback(err, null);
			else
				callback(null, result);
		});
	};
	
	update(connection, callback) {
		const queryStmt =  `UPDATE
							  department
							SET
							  name = "${this.name}"
							WHERE
							  id = ${this.id}`;
		connection.query(queryStmt, (err, result) => {
			if (err)
				callback(err, null);
			else
				callback(null, result);
		});
	};

	delete(connection, callback) {
		const queryStmt =  `DELETE FROM
							  department
							WHERE
							  id = ${this.id}`;
		connection.query(queryStmt, (err, result) => {
			if (err)
				callback(err, null);
			else
				callback(null, result);
		});
	};

	getRecord() {

	};

	getAllRecords(connection, callback) {
		const queryStmt =  `SELECT
							  id,
							  name,
							  CONCAT('$', FORMAT(budget_used,2)) budget_used
							FROM 
							  deptInfo 
							ORDER BY 
							  name`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				callback(null, resultSet);
		});
	};
};

module.exports = Department;