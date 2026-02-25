-- Group 33: Allison Lopes and Joseph Castellano
-- Project Title: Bookends Database Driven Website

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


-- Drop tables if they exist
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Books_has_genres;
DROP TABLE IF EXISTS Users_read_books;
DROP TABLE IF EXISTS Books_has_authors;


-- Books table: Records the details about the different books that a user can read and review
CREATE OR REPLACE TABLE Books(
    book_id int NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    isbn varchar(17) NOT NULL,
    publication_date DATE NOT NULL,
    PRIMARY KEY (book_id)
);


-- Authors table: Defines the names, date of birth and brief bio of authors of books
CREATE OR REPLACE TABLE Authors(
    author_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(50) NOT NULL,
    last_name varchar(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    bio varchar(5000),
    PRIMARY KEY (author_id)
);


-- Users table: Defines the username of users
CREATE OR REPLACE TABLE Users(
    user_id int NOT NULL AUTO_INCREMENT,
    username varchar(20) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    reading_goal int, 
    PRIMARY KEY (user_id)
);


-- Reviews table: Defines the relationship between Users and Books if a user has reviewed a book
CREATE OR REPLACE TABLE Reviews(
    review_id int NOT NULL AUTO_INCREMENT,
    review_date DATE NOT NULL,
    review_score ENUM('1', '2', '3', '4', '5'),
    review_text varchar(5000),
    users_user_id int,
    books_book_id int NOT NULL,
    PRIMARY KEY (review_id),
    FOREIGN KEY (users_user_id) REFERENCES Users(user_id)
    ON DELETE SET NULL, 
    FOREIGN KEY (books_book_id) REFERENCES Books(book_id)
    ON DELETE SET NULL
);


-- Genres table: Stores information regarding the genre of a book
CREATE OR REPLACE TABLE Genres(
    genre_id int NOT NULL AUTO_INCREMENT,
    name varchar(255) UNIQUE,
    description varchar(5000),
    PRIMARY KEY (genre_id)
);


-- Books_has_genres table: Defines the relationship between Books and Genres
CREATE OR REPLACE TABLE Books_has_genres(
    books_book_id int NOT NULL,
    genres_genre_id int,
    UNIQUE (books_book_id, genres_genre_id),
    FOREIGN KEY(books_book_id) REFERENCES Books(book_id)
    ON DELETE CASCADE,
    FOREIGN KEY (genres_genre_id) REFERENCES Genres(genre_id)
    ON DELETE SET NULL
);


-- Users_read_books table: Defines the relationship between Users and Books if a user has read a book
CREATE OR REPLACE TABLE Users_read_books(
    users_user_id int NOT NULL,
    books_book_id int NOT NULL,
    read_date DATE NOT NULL,
    PRIMARY KEY (users_user_id, books_book_id),
    FOREIGN KEY (users_user_id) REFERENCES Users(user_id)
    ON DELETE CASCADE,
    FOREIGN KEY (books_book_id) REFERENCES Books(book_id)
    ON DELETE CASCADE
);


-- Books_has_authors table: Defines the relationship between Books and Authors
CREATE OR REPLACE TABLE Books_has_authors(
    books_book_id int NOT NULL,
    authors_author_id int NOT NULL,
    PRIMARY KEY (books_book_id, authors_author_id),
    FOREIGN KEY (books_book_id) REFERENCES Books(book_id)
    ON DELETE CASCADE,
    FOREIGN KEY (authors_author_id) REFERENCES Authors(author_id)
    ON DELETE CASCADE
);


-- Insert into Books
INSERT INTO Books (title, isbn, publication_date)
VALUES 
('A Tale for the Time Being', '9780143124870', '2013-12-31'),
('The Hobbit', '9780547928227', '2012-09-18'),
('The Way of Kings', '9780765376671', '2014-03-04'),
('Villette (Penguin Classics)', '9780140434798', '2004-12-28');


-- Insert into Authors
INSERT INTO Authors (first_name, last_name, date_of_birth, bio)
VALUES 
('Ruth', 'Ozeki', '1956-03-12', 'American-Canadian author, filmmaker and Zen Buddhist priest'),
('John', 'Tolkein', '1892-01-03', 'English writer and philologist'),
('Brandon', 'Sanderson', '1975-12-19', 'American, New York Times best-selling author of high fantasy, science fiction, and young adult books'),
('Charlotte', 'Bronte', '1816-04-21', 'English novelist and poet, the eldest of the three Brontë sisters');


-- Insert into Users
INSERT INTO Users (username, email, password, reading_goal)
VALUES 
('fake_user123', 'fake_user@gmail.com', '1234!!', 30),
('second_user', 'Second@gmail.com', 'password', 10),
('third_user', 'third@gmail.com', 'anotherpassword', 15),
('fourth_user', 'fourth@gmail.com', 'lastpassword', 45);


-- Insert into Reviews
INSERT INTO Reviews (review_date, review_score, review_text, users_user_id, books_book_id)
VALUES 
('2024-09-25', 5, 'Great book', (SELECT user_id FROM Users WHERE user_id = 1), (SELECT book_id FROM Books WHERE book_id = 1)),
('2024-10-31', 5, 'Loved this one', (SELECT user_id FROM Users WHERE user_id = 2), (SELECT book_id FROM Books WHERE book_id = 2)),
('2020-01-15', 5, 'My favorite!', (SELECT user_id FROM Users WHERE user_id = 3), (SELECT book_id FROM Books WHERE book_id = 3)),
('2019-06-08', 5, 'New favorite', (SELECT user_id FROM Users WHERE user_id = 4), (SELECT book_id FROM Books WHERE book_id = 4));


-- Insert into Genres
INSERT INTO Genres (name, description)
VALUES 
('Fantasy', 'Includes fantastical elements, such as magic or supernatural forces.'),
('Mystery', 'Plot revolves around a crime or mystery to be solved.'),
('Literary Fiction', 'Character-driven and introspective.'),
('Non-Fiction', 'Events, people, and concepts based on fact and reality.');


-- Insert into Users_read_books
INSERT INTO Users_read_books (read_date, users_user_id, books_book_id)
VALUES 
('2024-09-25', (SELECT user_id FROM Users WHERE username = 'fake_user123'), (SELECT book_id FROM Books WHERE book_id = 1)),
('2024-10-31', (SELECT user_id FROM Users WHERE username = 'second_user'), (SELECT book_id FROM Books WHERE book_id = 2)),
('2020-01-15', (SELECT user_id FROM Users WHERE username = 'third_user'), (SELECT book_id FROM Books WHERE book_id = 3)),
('2019-06-08', (SELECT user_id FROM Users WHERE username = 'fourth_user'), (SELECT book_id FROM Books WHERE book_id = 4));


-- Insert into Books_has_genres
INSERT INTO Books_has_genres (books_book_id, genres_genre_id)
VALUES 
((SELECT book_id FROM Books WHERE isbn = '9780143124870'), (SELECT genre_id FROM Genres WHERE name = 'Literary Fiction')),
((SELECT book_id FROM Books WHERE isbn = '9780547928227'), (SELECT genre_id FROM Genres WHERE name = 'Fantasy')),
((SELECT book_id FROM Books WHERE isbn = '9780765376671'), (SELECT genre_id FROM Genres WHERE name = 'Fantasy')),
((SELECT book_id FROM Books WHERE isbn = '9780140434798'), (SELECT genre_id FROM Genres WHERE name = 'Literary Fiction'));


-- Insert into Books_has_authors
INSERT INTO Books_has_authors (books_book_id, authors_author_id)
VALUES 
((SELECT book_id FROM Books WHERE isbn = '9780143124870'), (SELECT author_id FROM Authors WHERE first_name = 'Ruth')),
((SELECT book_id FROM Books WHERE isbn = '9780547928227'), (SELECT author_id FROM Authors WHERE first_name = 'John')),
((SELECT book_id FROM Books WHERE isbn = '9780765376671'), (SELECT author_id FROM Authors WHERE first_name = 'Brandon')),
((SELECT book_id FROM Books WHERE isbn = '9780140434798'), (SELECT author_id FROM Authors WHERE first_name = 'Charlotte'));



-- Test that tables were created
DESCRIBE Books;
DESCRIBE Authors;
DESCRIBE Users;
DESCRIBE Reviews;
DESCRIBE Genres;
DESCRIBE Books_has_genres;
DESCRIBE Users_read_books;
DESCRIBE Books_has_authors;


SET FOREIGN_KEY_CHECKS=1;
COMMIT;