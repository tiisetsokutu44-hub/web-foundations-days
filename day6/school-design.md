# School Database Design

## Tables

**Students:** The students table stores each student's ID, name and email address. The student ID is the primary key, and each email address must be unique and cannot be empty.

**Courses:** The courses table stores the available courses. Each course has a unique ID and a required course name.

**Enrolments:** The enrolments table records which student is taking which course, along with their grade. It has its own primary key and foreign keys referencing the students and courses tables. A UNIQUE constraint on student_id and course_id prevents the same student from enrolling on the same course more than once.

## Relationships

The relationship between students and enrolments is one-to-many because one student can have several enrolment records, while each enrolment belongs to one student. The relationship between courses and enrolments is also one-to-many because one course can have several enrolment records, while each enrolment refers to one course.

Students and courses therefore have a many-to-many relationship: a student can take several courses, and a course can have several students. The enrolments table is needed as a join table to connect these two entities and store information about each enrolment, including the grade.

## Index

I would add an index on `enrolments(course_id)` to help the database find enrolments for a particular course more efficiently. This is useful when listing all students on a course or counting students per course. The UNIQUE constraint on `(student_id, course_id)` already creates an index for that column combination in SQLite.

## SQL or NoSQL?

I would choose SQL for this school database because students, courses and enrolments have clear relationships and structured data. Primary keys, foreign keys, UNIQUE constraints and NOT NULL constraints help maintain data accuracy and consistency. SQL joins also make it straightforward to retrieve course lists, student lists and enrolment counts. A relational database such as SQLite is suitable for this assignment because the data is structured and the relationships are important.
