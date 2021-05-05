//* Constructor for employee
class Employee {
	constructor(id, first_name, last_name, role_id, manager_id) {
		this.id = id;
		this.first_name = first_name;
		this.last_name = last_name;
		this.role_id = role_id;
		this.manager_id = manager_id;
	};

	getId() {
		return this.id;
	};
	
	getFirst_Name() {
		return this.first_name;
	};

	getLast_Name() {
		return this.last_name;
	};

	getRole_Id() {
		return this.role_id;
	};

	getManager_Id() {
		return this.manager_id;
	};

	setId(id) {
		this.id = id;
	};
	
	setFirst_Name(first_name) {
		this.first_name = first_name;
	};

	setLast_Name(last_name) {
		this.last_name = last_name;
	};

	setRole_Id(role_id) {
		this.role_id = role_id;
	};

	setManager_Id(manager_id) {
		this.manager_id = manager_id;
	};

	getAllRecords(connection, callback) {
		const queryStmt = `SELECT
		                     e.id,
							 e.first_name,
							 e.last_name,
							 e.role_id,
							 COALESCE(e.manager_id, 'SELF') as manager
						   FROM
						   	 employee as e
						   ORDER BY
						     e.last_name,
							 e.first_name`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				callback(null, resultSet);
		});
	};	
};

module.exports = Employee;