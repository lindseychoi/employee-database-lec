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

INSERT INTO employee (first_name, last_name, roles_id)
VALUES ("Debbie", "Smith", 1),
       ("John", "Bodwell", 2),
       ("Jessica", "Glenn", 3),
       ("Lindsey", "Choi", 4),
       ("Dan", "Laviers", 5),
       ("Ken", "Bowen", 6),
       ("Ryan", "Magar", 7),
       ("Dianne", "Miller", 8),
       ("Kathy", "Robinson", 9),
       ("Ruby", "Winkler", 9),
       ("Christina", "Chen", 1),
       ("Zachary", "Nguyen", 1),
       ("Lena", "Johnson", 1),
       ("Kristy", "Dunn", 1),
       ("Mickey", "Shriver", 2),
       ("Harleigh", "Ecklund", 2),
       ("Twila", "Pattinson", 8),
       ("Erin", "Wilson", 3),
       ("Hannah", "Henning", 2),
       ("Andy", "Fitzgibbons", 7);


