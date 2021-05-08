// -----------------------------------------------------------------------------
// Class:    Department
// Purpose:  Define a department object and provide methods for actions
// -----------------------------------------------------------------------------
// Author:   Mark Harrison
// Date:     May 7, 2021
// -----------------------------------------------------------------------------
class Department {
	constructor(id, name) {
		this.id = id;
		this.name = name;
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
	// Function: getName
	// Purpose:  Getter  
	// Input:    <none>
	// Returns:  <string> instance variable  
	// -----------------------------------------------------------------------------
	getName() {
		return this.name;
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
	// Function: setName
	// Purpose:  Setter  
	// Input:    <string> set instance variable
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	setName(name) {
		this.name = name;
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


	// -----------------------------------------------------------------------------
	// Function: update
	// Purpose:  Update current record with values from instance variables 
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------	
	update(connection, callback) {
		const queryStmt = `UPDATE
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


	// -----------------------------------------------------------------------------
	// Function: delete
	// Purpose:  Delete current record  
	// Input:    <connection> connection - database connection object
	//           <function> callback - function to call upon completion
	// Returns:  <none>  
	// -----------------------------------------------------------------------------
	delete(connection, callback) {
		const queryStmt = `DELETE FROM
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
							 name
						   FROM
						     department
						   WHERE
						     id = ${this.id}`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				this.name = resultSet[0].name;
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
							 title
	  					   FROM
							 role
	  					   WHERE
							 department_id = ${this.id}`;
		connection.query(queryStmt, (err, resultSet) => {
			if (err)
				callback(err, null);
			else
				callback(null, resultSet);
		});
	};

};

module.exports = Department;