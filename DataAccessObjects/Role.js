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