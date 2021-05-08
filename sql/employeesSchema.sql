-- -----------------------------------------------------------------------------
-- Script:   employeesSchema.sql
-- Purpose:  This script will create a schema for the employee manager application
-- -----------------------------------------------------------------------------
-- Author:   Mark Harrison
-- Date:     May 7, 2021
-- -----------------------------------------------------------------------------

DROP DATABASE IF EXISTS employeesDB;

CREATE DATABASE employeesDB;

USE employeesDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_departmentRole FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE RESTRICT
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id int NOT NULL,
  manager_id int NULL,
  PRIMARY KEY (id),
  CONSTRAINT FK_roleEmployee FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE RESTRICT,
  CONSTRAINT FK_managerEmployee FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE RESTRICT
);

-- View used to list role information by joining to department table
CREATE OR REPLACE VIEW roleInfo (
  id,
  title,
  salary,
  department_id,
  department_name
)
AS 
  SELECT
    r.id,
    r.title,
    r.salary,
    r.department_id,
    d.name
  FROM
    role AS r
      LEFT OUTER JOIN department AS d
        ON r.department_id = d.id
;

-- View used to list employee information by joining to roleInfo view
CREATE OR REPLACE VIEW empInfo (
  id,
  first_name,
  last_name,
  role_id,
  title,
  salary,
  department_id,
  department_name,
  manager_id,
  manager_name
)
AS 
  SELECT
    e.id,
    e.first_name,
    e.last_name,
    e.role_id,
    r.title,
    r.salary,
    r.department_id,
    r.department_name,
    e.manager_id,
    CONCAT_WS(', ', m.last_name, m.first_name)
  FROM
    employee AS e
      LEFT OUTER JOIN roleInfo AS r
        ON e.role_id = r.id
      LEFT OUTER JOIN employee as m
        ON e.manager_id = m.id
;

-- View used to list department info with salary summary based upon employees within dept
CREATE OR REPLACE VIEW deptInfo (
  id,
  name,
  budget_used
)
AS 
  SELECT
    d.id,
    d.name,
    COALESCE(sum(e.salary), 0)
  FROM
    department AS d
      LEFT OUTER JOIN empInfo AS e
        ON d.id = e.department_id
  GROUP BY
    d.id
;
