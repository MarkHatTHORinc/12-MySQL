// -----------------------------------------------------------------------------
// Class:    Role
// Purpose:  Define a role object and provide methods for actions
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 7, 2021
// -----------------------------------------------------------------------------
class Role {
	constructor(title, salary, department_id) {
		this.title = title;
		this.salary = salary;
		this.department_id = department_id;
	};


	// -----------------------------------------------------------------------------
	// Function: getId
	// Purpose:  Getter  
	// Input:    <none> 
	// Returns:  <integer> instance variable  
	// -----------------------------------------------------------------------------
	getId(id) {
		return this.id;
	};


	// -----------------------------------------------------------------------------
	// Function: getTitle
	// Purpose:  Getter  
	// Input:    <none> 
	// Returns:  <string> instance variable  
	// -----------------------------------------------------------------------------
	getTitle() {
		return this.title;
	};


	// -----------------------------------------------------------------------------
	// Function: getSalary
	// Purpose:  Getter  
	// Input:    <none> 
	// Returns:  <integer> instance variable  
	// -----------------------------------------------------------------------------
	getSalary() {
		return this.salary;
	};


	// -----------------------------------------------------------------------------
	// Function: getDepartment_Id
	// Purpose:  Getter  
	// Input:    <none> 
	// Returns:  <integer> instance variable  
	// -----------------------------------------------------------------------------
	getDepartment_Id() {
		return this.department_id;
	};


	// -----------------------------------------------------------------------------
	// Function: setId
	// Purpose:  Setter  
	// Input:    <integer> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setId(id) {
		this.id = id;
	};


	// -----------------------------------------------------------------------------
	// Function: setTitle
	// Purpose:  Setter  
	// Input:    <string> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setTitle(title) {
		this.title = title;
	};


	// -----------------------------------------------------------------------------
	// Function: setSalary
	// Purpose:  Setter  
	// Input:    <integer> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setSalary(salary) {
		this.salary = salary;
	};


	// -----------------------------------------------------------------------------
	// Function: setDepartment_Id
	// Purpose:  Setter  
	// Input:    <integer> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setDepartment_Id(department_id) {
		this.department_id = department_id;
	};


	// -----------------------------------------------------------------------------
	// Function: add
	// Purpose:  Add a new record with values from instance variables  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	add(connection, callback) {
		const queryStmt = `INSERT INTO
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


	// -----------------------------------------------------------------------------
	// Function: update
	// Purpose:  Update current record with values from instance variables 
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------		
	update(connection, callback) {
		const queryStmt = `UPDATE
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


	// -----------------------------------------------------------------------------
	// Function: delete
	// Purpose:  Delete current record  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	delete(connection, callback) {
		const queryStmt = `DELETE FROM
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


	// -----------------------------------------------------------------------------
	// Function: getAllRecords
	// Purpose:  Get All data records in table  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
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


	// -----------------------------------------------------------------------------
	// Function: getRecord
	// Purpose:  Get current record and load instance fields  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------	
	getRecord(connection, callback) {
		const queryStmt = `SELECT
		                     id,
							 title,
							 salary,
							 department_id
						   FROM
						     role
						   WHERE
						     id = ${this.id}`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				this.title = resultSet[0].title;
			this.salary = resultSet[0].salary;
			this.department_id = resultSet[0].department_id;
			callback(null, resultSet);
		});
	};


	// -----------------------------------------------------------------------------
	// Function: getDependentRecords
	// Purpose:  Get Child Records. This can be used to prevent deletes with dependencies  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------	
	getDependentRecords(connection, callback) {
		const queryStmt = `SELECT
							 id,
							 concat(last_name, ', ', first_name) as name
	  					   FROM
							 employee
	  					   WHERE
							 role_id = ${this.id}`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				callback(null, resultSet);
		});
	};
};

module.exports = Role;