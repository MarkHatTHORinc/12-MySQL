//* Constructor for role
class Role {
	constructor(title, salary, department_id) {
		this.title = title;
		this.salary = salary;
		this.department_id = department_id;
	};

	getTitle() {
		return this.title;
	};

	getSalary() {
		return this.salary;
	};

	getDepartment_Id() {
		return this.department_id;
	};

	setTitle(title) {
		this.title = title;
	};
	
	setSalary(salary) {
		this.salary = salary;
	};

	setDepartment_Id(department_id) {
		this.department_id = department_id;
	};

	add(connection, callback) {
		const queryStmt =  `INSERT INTO
							  role (
								title,
								salary,
								department_id
							  ) VALUES (
								  "${this.title}",
								  ${this.salary},
								  ${this.department_id}
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
							  role
							SET
							  title = "${this.title}",
							  salary = ${this.salary},
							  department_id = ${this.department_id}
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
							  role
							WHERE
							  id = ${this.id}`;
		connection.query(queryStmt, (err, result) => {
			if (err)
				callback(err, null);
			else
				callback(null, result);
		});
	};

	getAllRecords(connection, callback) {
		const queryStmt = `SELECT
		                     id,
							 title,
							 CONCAT('$', FORMAT(salary,2)) salary,
							 department_name as department
						   FROM
						     roleInfo
						   ORDER BY
						     title`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				callback(null, resultSet);
		});
	};
};

module.exports = Role;