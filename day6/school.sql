-- Day 6 Assignment: School Database
-- web-foundations-days

-- 1. CREATE TABLE statements

PRAGMA foreign_keys = ON;

CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL UNIQUE
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade REAL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

-- 2. INSERT sample data

INSERT INTO students (student_id, name, email) VALUES
(1, 'Amina Dlamini', 'amina@example.com'),
(2, 'Thabo Mokoena', 'thabo@example.com'),
(3, 'Lerato Nkosi', 'lerato@example.com'),
(4, 'Sipho Khumalo', 'sipho@example.com');

INSERT INTO courses (course_id, course_name) VALUES
(1, 'Web Development'),
(2, 'Database Design'),
(3, 'Python Programming');

INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
(1, 1, 1, 85),
(2, 1, 2, 78),
(3, 2, 1, 72),
(4, 2, 3, 90),
(5, 3, 2, 88);

-- 3. QUERY 1: All courses for one student, by name

SELECT s.name, c.course_name, e.grade
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.name = 'Amina Dlamini';

-- 4. QUERY 2: All students enrolled on one course

SELECT s.name, s.email, c.course_name
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE c.course_name = 'Web Development';

-- 5. QUERY 3: Number of students per course

SELECT c.course_name, COUNT(e.student_id) AS number_of_students
FROM courses AS c
LEFT JOIN enrolments AS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

-- 6. QUERY 4: Students who have no enrolments

SELECT s.student_id, s.name, s.email
FROM students AS s
LEFT JOIN enrolments AS e ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-- 7. QUERY 5: Update one enrolment's grade

UPDATE enrolments
SET grade = 92
WHERE student_id = 1 AND course_id = 1;