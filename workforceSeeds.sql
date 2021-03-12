DROP DATABASE IF EXISTS workforceDB;

CREATE DATABASE workforceDB;

USE workforceDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

alter table employee add foreign key (manager_id) references employee(id);
alter table employee add foreign key (role_id) references role(id);
alter table role add foreign key (department_id) references department(id);

INSERT INTO department (name)
VALUES ("CTE");

INSERT INTO department (name)
VALUES ("English");

INSERT INTO department (name)
VALUES ("Administration");

INSERT INTO role (title, salary,department_id )
VALUES ("CTE Teacher", 70000, 1);

INSERT INTO role (title, salary,department_id)
VALUES ("Principal", 100000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Vice Principal", 85000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("English Teacher", 70000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Lindsay", "Hooker", 2, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Chris", "Humbert", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Roger", "Arlington", 2, null);
