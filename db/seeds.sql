INSERT INTO department (id, title)
VALUES (1, "Administration"), 
       (2, "Teaching Staff"),
       (3, "Support Staff");

INSERT INTO roles (title, salary, department_id)
VALUES ("Classroom Teacher", 42000, 2), 
       ("Paraprofessional", 20000, 3),
       ("Secretary", 30000, 3),
       ("Principal", 115000, 1),
       ("Assistant Principal", 100000, 1),
       ("Librarian", 42000, 3),
       ("Custodian", 35000, 3),
       ("IT Specialist", 50000, 3),
       ("Nurse", 75000, 3);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Debbie", "Smith", 1, NULL),
       ("John", "Bodwell", 2, NULL),
       ("Jessica", "Glenn", 3, NULL),
       ("Lindsey", "Choi", 4, 1),
       ("Dan", "Laviers", 5, NULL),
       ("Ken", "Bowen", 6, 1),
       ("Ryan", "Magar", 7, 1),
       ("Dianne", "Miller", 8, 1),
       ("Kathy", "Robinson", 9, 1),
       ("Ruby", "Winkler", 9, 1),
       ("Christina", "Chen", 1, NULL),
       ("Zachary", "Nguyen", 1, NULL),
       ("Lena", "Johnson", 1, NULL),
       ("Kristy", "Dunn", 1, NULL),
       ("Mickey", "Shriver", 2, 1),
       ("Harleigh", "Ecklund", 2, 1),
       ("Twila", "Pattinson", 8, 1),
       ("Erin", "Wilson", 3, 1),
       ("Hannah", "Henning", 2, 1),
       ("Andy", "Fitzgibbons", 7, 1);


