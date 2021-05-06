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

	add() {

	};
	
	update() {

	};

	delete() {

	};

	getRecord() {

	};

	getAllRecords(connection, callback) {
		const queryStmt =  `SELECT
							  *
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