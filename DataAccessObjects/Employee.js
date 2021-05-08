// -----------------------------------------------------------------------------
// Class:    Employee
// Purpose:  Define an employee object and provide methods for actions
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 7, 2021
// -----------------------------------------------------------------------------
class Employee {
	constructor(id, first_name, last_name, role_id, manager_id) {
		this.id = id;
		this.first_name = first_name;
		this.last_name = last_name;
		this.role_id = role_id;
		this.manager_id = manager_id;
	};


	// -----------------------------------------------------------------------------
	// Function: getId
	// Purpose:  Getter  
	// Input:    <none> 
	// Returns:  <integer> instance variable  
	// -----------------------------------------------------------------------------
	getId() {
		return this.id;
	};


	// -----------------------------------------------------------------------------
	// Function: getFirst_Name
	// Purpose:  Getter  
	// Input:    <none>
	// Returns:  <string> instance variable  
	// -----------------------------------------------------------------------------
	getFirst_Name() {
		return this.first_name;
	};


	// -----------------------------------------------------------------------------
	// Function: getLast_Name
	// Purpose:  Getter  
	// Input:    <none>
	// Returns:  <string> instance variable  
	// -----------------------------------------------------------------------------
	getLast_Name() {
		return this.last_name;
	};


	// -----------------------------------------------------------------------------
	// Function: getRole_Id
	// Purpose:  Getter  
	// Input:    <none> 
	// Returns:  <integer> instance variable  
	// -----------------------------------------------------------------------------
	getRole_Id() {
		return this.role_id;
	};


	// -----------------------------------------------------------------------------
	// Function: getManager_Id
	// Purpose:  Getter  
	// Input:    <none> 
	// Returns:  <integer> instance variable  
	// -----------------------------------------------------------------------------
	getManager_Id() {
		return this.manager_id;
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
	// Function: setFirst_Name
	// Purpose:  Setter  
	// Input:    <string> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setFirst_Name(first_name) {
		this.first_name = first_name;
	};


	// -----------------------------------------------------------------------------
	// Function: setLast_Name
	// Purpose:  Setter  
	// Input:    <string> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setLast_Name(last_name) {
		this.last_name = last_name;
	};


	// -----------------------------------------------------------------------------
	// Function: setManager_Id
	// Purpose:  Setter  
	// Input:    <integer> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setMgr_Id(manager_id) {
		this.manager_id = manager_id;
	};


	// -----------------------------------------------------------------------------
	// Function: setRole_Id
	// Purpose:  Setter  
	// Input:    <integer> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setRole_Id(role_id) {
		this.role_id = role_id;
	};


	// -----------------------------------------------------------------------------
	// Function: add
	// Purpose:  Add a new record with values from instance variables  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	add(connection, callback) {
		const queryStmt =  `INSERT INTO
							  employee (
								first_name,
								last_name,
								role_id,
								manager_id
							  ) VALUES (
								  "${this.first_name}",
								  "${this.last_name}",
								  ${this.role_id},
								  ${this.manager_id}
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
		const queryStmt =  `UPDATE
							  employee
							SET
							  first_name = "${this.first_name}",
							  last_name = "${this.last_name}",
							  role_id = ${this.role_id},
							  manager_id = ${this.manager_id}
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
		const queryStmt =  `DELETE FROM
							  employee
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
							 first_name,
							 last_name,
							 title,
							 CONCAT('$', FORMAT(salary,2)) salary,
							 department_name,
							 manager_name
						   FROM
						   	 empInfo
						   WHERE
						     manager_id = ${this.manager_id}  OR
							 ${this.manager_id} IS NULL
						   ORDER BY
						     last_name,
							 first_name`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				callback(null, resultSet);
		});
	};


	// -----------------------------------------------------------------------------
	// Function: getAllManagers
	// Purpose:  Get All data records in table for a manager (group by)  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	getAllManagers(connection, callback) {
		const queryStmt = `SELECT
						 manager_id,
						 manager_name
					   FROM
						 empInfo
					   WHERE
						 manager_id IS NOT NULL
					   GROUP BY
					     manager_id
					   ORDER BY
						 manager_name`;
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
						 first_name,
						 last_name,
						 role_id,
						 manager_id
					   FROM
						 employee
					   WHERE
						 id = ${this.id}`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				this.first_name = resultSet[0].first_name;
				this.last_name  = resultSet[0].last_name;
				this.role_id    = resultSet[0].role_id;
				this.manager_id = resultSet[0].manager_id;
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
							 manager_id = ${this.id}`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				callback(null, resultSet);
		});
	};
};

module.exports = Employee;