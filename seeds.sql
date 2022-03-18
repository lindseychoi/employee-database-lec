INSERT INTO department (id, name)
VALUES (1, "Administration"), 
       (2, "Teaching Staff"),
       (3, "Support Staff");

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Classroom Teacher", 42000, 2), 
       (2, "Paraprofessional", 20000, 3),
       (3, "Secretary", 30000, 3),
       (4, "Principal", 115000, 1),
       (5, "Assistant Principal", 100000, 1),
       (6, "Librarian", 42000, 3),
       (7, "Custodian", 35000, 3),
       (8, "IT Specialist", 50000, 3),
       (9, "Nurse", 75000, 3)
       (10, "Specialist Teacher", 42000, 2);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES (1, "Debbie", "Smith", 1),
       (2, "John", "Bodwell", 2),
       (3, "Jessica", "Glenn", 3),
       (4, "Lindsey", "Choi", 4),
       (5, "Dan", "Laviers", 5),
       (6, "Ken", "Bowen", 6),
       (7, "Ryan", "Magar", 7),
       (8, "Dianne", "Miller", 8),
       (9, "Kathy", "Robinson", 9),
       (10, "Ruby", "Winkler", 10),
       (11, "Christina", "Chen", 1),
       (12, "Zachary", "Nguyen", 1),
       (13, "Lena", "Johnson", 1),
       (14, "Kristy", "Dunn", 1),
       (15, "Mickey", "Shriver", 2),
       (16, "Harleigh", "Ecklund", 2),
       (17, "Twila", "Pattinson", 8),
       (18, "Erin", "Wilson", 10),
       (19, "Hannah", "Henning", 2),
       (20, "Andy", "Fitzgibbons", 7);


