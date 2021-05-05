
USE employeesDB;

-- Populate initial values for the department table
INSERT INTO
  department 
    (name)
VALUES 
  ('Accounting'),
  ('Administration'), 
  ('Engineering'),
  ('Human Resources'),
  ('Information Services'), 
  ('Marketing');

-- Populate initial values for the role table
INSERT INTO 
  role 
    (title, salary, department_id)
VALUES 
  ('Accountant I', 60000.00, (SELECT
                                min(id)
							                FROM
                                department
							                WHERE
                                lower(name) = 'accounting' LIMIT 1)),
  ('Accountant II', 65000.00, (SELECT
                                 min(id)
					   		               FROM
                                 department
							                 WHERE
                                 lower(name) = 'accounting' LIMIT 1)),
  ('Finance Manager', 80000.00, (SELECT
                                   min(id)
							                   FROM
                                   department
							                   WHERE
                                   lower(name) = 'accounting' LIMIT 1)),
  ('CEO', 1000000.00, (SELECT
                         min(id)
					             FROM
                         department
					             WHERE
                         lower(name) = 'administration' LIMIT 1)),
  ('Executive Assistant', 40000.00, (SELECT
                         min(id)
					             FROM
                         department
					             WHERE
                         lower(name) = 'administration' LIMIT 1)),
  ('Engineer I', 70000.00, (SELECT
                              min(id) 
							              FROM
                              department
							              WHERE
                              lower(name) = 'engineering' LIMIT 1)),
  ('Engineer II', 75000.00, (SELECT
                               min(id)
							               FROM
                               department
							               WHERE
                               lower(name) = 'engineering' LIMIT 1)),
  ('Lead Engineer', 95000.00, (SELECT
                                 min(id)
						   	               FROM
                                 department
							                 WHERE
                                 lower(name) = 'engineering' LIMIT 1)),
  ('Vice-President of HR', 1500000.00, (SELECT
                                          min(id)
							                          FROM
                                          department
							                          WHERE
                                          lower(name) = 'human resources' LIMIT 1)),
  ('Recruiter', 80000.00, (SELECT
                             min(id)
							             FROM
                             department
							             WHERE
                             lower(name) = 'human resources' LIMIT 1)),
  ('Systems Architect', 1200000.00, (SELECT
                                               min(id)
					                                   FROM
                                               department
					                                   WHERE
                                               lower(name) = 'information services' LIMIT 1)),
  ('Programmer/Analyst', 85000.00, (SELECT
                                      min(id)
					                          FROM
                                      department
					                          WHERE
                                      lower(name) = 'information services' LIMIT 1)),
  ('Programmer', 65000.00, (SELECT
                              min(id)
					                  FROM
                              department
					                  WHERE
                              lower(name) = 'administration' LIMIT 1));

-- Populate initial values for the employee table
INSERT INTO 
  employee
    (first_name, last_name, role_id, manager_id)
VALUES
  ('Stanley', 'Lewis', (SELECT
                          id
						            FROM
                          role
						            WHERE
                          lower(title) = 'ceo'), NULL),
  ('Jane', 'Hathaway', (SELECT
                          id
						            FROM
                          role
						            WHERE
                          lower(title) = 'executive assistant'), (WITH newMgr (id) AS
													                                         (SELECT 
                                                                      id 
													                                          FROM 
                                                                      employee 
													                                          WHERE 
                                                                      role_id = (SELECT 
																                                                   min(id) 
																                                                 FROM 
                                                                                   role as r 
																                                                 WHERE 
                                                                                   lower(r.title) = 'ceo' LIMIT 1))
												                                          SELECT 
                                                                    id 
												                                          FROM 
                                                                    newMgr)),                          
  ('Norm', 'Peterson', (SELECT
                          id
						            FROM
                          role
						            WHERE
                          lower(title) = 'finance manager'), (WITH newMgr (id) AS
													                                     (SELECT 
                                                                  id 
													                                      FROM 
                                                                  employee 
													                                      WHERE 
                                                                  role_id = (SELECT 
																                                               min(id) 
																                                             FROM 
                                                                               role as r 
																                                             WHERE 
                                                                               lower(r.title) = 'ceo' LIMIT 1))
												                                      SELECT 
                                                                id 
												                                      FROM 
                                                                newMgr)),
  ('Hermes', 'Conrad', (SELECT
                          id
						            FROM
                          role
						            WHERE
                          lower(title) = 'Accountant I'), (WITH newMgr (id) AS
													                                   (SELECT 
                                                                id 
													                                    FROM 
                                                                employee 
													                                    WHERE 
                                                                role_id = (SELECT 
																                                             min(id) 
																                                           FROM 
                                                                             role as r 
																                                           WHERE 
                                                                             lower(r.title) = 'finance manager' LIMIT 1))
												                                   SELECT 
                                                             id 
												                                   FROM 
                                                             newMgr)),
  ('Petyr', 'Baelish', (SELECT
                          id
						            FROM
                          role
						            WHERE
                          lower(title) = 'Accountant II'), (WITH newMgr (id) AS
													                                   (SELECT 
                                                                id 
													                                    FROM 
                                                                employee 
													                                    WHERE 
                                                                role_id = (SELECT 
																                                             min(id) 
																                                           FROM 
                                                                             role as r 
																                                           WHERE 
                                                                             lower(r.title) = 'finance manager' LIMIT 1))
												                                     SELECT 
                                                               id 
												                                     FROM 
                                                               newMgr)),
  ('Montgomery', 'Scott', (SELECT
                            id
					 	               FROM
                             role
						               WHERE
                             lower(title) = 'lead engineer'), (WITH newMgr (id) AS
													                                      (SELECT 
                                                                   id 
													                                       FROM 
                                                                   employee 
													                                       WHERE 
                                                                   role_id = (SELECT 
																                                                min(id) 
																                                              FROM 
                                                                                role as r 
																                                              WHERE 
                                                                                lower(r.title) = 'ceo' LIMIT 1))
												                                       SELECT 
                                                                 id 
												                                       FROM 
                                                                 newMgr)),
  ('Howard', 'Wolowitz', (SELECT
                            id
						              FROM
                            role
						              WHERE
                            lower(title) = 'Engineer I'), (WITH newMgr (id) AS
												                                    (SELECT 
                                                               id 
													                                   FROM 
                                                               employee 
													                                   WHERE 
                                                               role_id = (SELECT 
															                                              min(id) 
																                                          FROM 
                                                                            role as r 
																                                          WHERE 
                                                                            lower(r.title) = 'lead engineer' LIMIT 1))
												                                   SELECT 
                                                             id 
												                                   FROM 
                                                             newMgr)),
  ('Angus', 'MacGyver', (SELECT
                           id
						             FROM
                           role
						             WHERE
                           lower(title) = 'Engineer I'), (WITH newMgr (id) AS
											                                      (SELECT 
                                                               id 
												                                     FROM 
                                                               employee 
													                                   WHERE 
                                                               role_id = (SELECT 
															                                              min(id) 
																                                          FROM 
                                                                            role as r 
																                                          WHERE 
                                                                            lower(r.title) = 'lead engineer' LIMIT 1))
												                                  SELECT 
                                                            id 
												                                  FROM 
                                                            newMgr)),
  ('Matt', 'Carpenter', (SELECT
                            id
					 	               FROM
                             role
						               WHERE
                             lower(title) = 'systems architect'), (WITH newMgr (id) AS
													                                          (SELECT 
                                                                       id 
													                                           FROM 
                                                                       employee 
													                                           WHERE 
                                                                       role_id = (SELECT 
																                                                    min(id) 
																                                                  FROM 
                                                                                    role as r 
																                                                  WHERE 
                                                                                    lower(r.title) = 'ceo' LIMIT 1))
												                                             SELECT 
                                                                       id 
												                                             FROM 
                                                                       newMgr)),
  ('Crystal', 'Kelley', (SELECT
                            id
					 	               FROM
                             role
						               WHERE
                             lower(title) = 'programmer/analyst'), (WITH newMgr (id) AS
													                                            (SELECT 
                                                                         id 
													                                             FROM 
                                                                         employee 
													                                             WHERE 
                                                                         role_id = (SELECT 
																                                                      min(id) 
																                                                    FROM 
                                                                                      role as r 
																                                                    WHERE 
                                                                                      lower(r.title) = 'systems architect' LIMIT 1))
												                                            SELECT 
                                                                      id 
												                                            FROM 
                                                                      newMgr)),
  ('Margarita', 'Munoz', (SELECT
                            id
					 	               FROM
                             role
						               WHERE
                             lower(title) = 'programmer'), (WITH newMgr (id) AS
													                                    (SELECT 
                                                                 id 
													                                     FROM 
                                                                 employee 
													                                     WHERE 
                                                                 role_id = (SELECT 
																                                              min(id) 
																                                            FROM 
                                                                              role as r 
																                                            WHERE 
                                                                              lower(r.title) = 'ceo' LIMIT 1))
												                                    SELECT 
                                                              id 
												                                    FROM 
                                                              newMgr)):