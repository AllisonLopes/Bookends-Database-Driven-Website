-- CRUD operations for Bookends web interface

-- Books
    -- Dropdown functionality (get all book ids and titles to populate book dropdown)
    SELECT book_id, title FROM Books

    -- Create a book
    INSERT INTO Books (title, isbn, publication_date)
    VALUES(
        :title_input,
        :isbn_input,
        :publication_date_input
    )

    -- View all books
    SELECT * FROM Books

    -- Update a book
    UPDATE Books
    SET
    isbn = :isbn_input,
    publication_date = :publication_date_input
    WHERE title = :title_input_from_dropdown

    -- Delete a book
    DELETE FROM Books WHERE title = :title_input



-- Authors
    -- Create an Author
    INSERT INTO Authors (first_name, last_name, date_of_birth, bio)
    VALUES(
        :first_name_input,
        :last_name_input,
        :date_of_birth_input,
        :bio_input
    )
    -- View all author info
    SELECT * FROM Authors

    -- Delete an author
    DELETE FROM Authors WHERE first_name = :first_name_input AND last_name = :last_name_input

-- Users
    -- Create a User
    INSERT INTO Users (user_name, email, password, reading_goal)
    VALUES(
        :user_name_input,
        :email_input,
        :password_input,
        :reading_goal_input
    )
    -- view all users
    SELECT * FROM Users 

    -- Delete a user
    DELETE FROM Users WHERE email = :email_input

-- Genres
    -- Create a Genre
    INSERT INTO Genres (name, description)
    VALUES(
        :name_input,
        :description_input
    )

    -- view all Genres
    SELECT * from Genres

    -- Delete a Genre
    DELETE FROM Genres WHERE name = :name_input;

-- Reviews
    -- get users_user_id for dropdown
    SELECT user_id FROM Users

    -- get books_book_id for dropdown
    SELECT book_id FROM Books

    -- get reviews_id for dropdown
    SELECT review_id FROM Reviews

    -- Creates a Review + a user-book relationship via reviewing
    INSERT INTO Reviews (review_date, review_score, review_text, users_user_id, books_book_id)
    VALUES(
        :review_date_input,
        :review_score_input,
        :review_text_input,
        :users_user_id_input_from_dropdown,
        :books_book_id_input_from_dropdown
    )

    -- view all Reviews
    SELECT 
    Reviews.review_id,
    Reviews.review_date,
    Reviews.review_score,
    Reviews.review_text,
    Users.username, 
    Books.title AS book_title
    FROM Reviews
    LEFT JOIN Users on Reviews.users_user_id = Users.user_id
    LEFT JOIN Books on Reviews.books_book_id = Books.book_id;

    -- update a review
    UPDATE Reviews
    SET
    review_date = :review_date_input,
    review_score = :review_score_input,
    review_text = :review_text_input,
    users_user_id = :users_user_id_input_from_dropdown,
    books_book_id = :books_book_id_input_from_dropdown
    WHERE review_id = :reviews_id_input_from_dropdown





-- Books_has_authors
    -- Create an author-book relationship
    INSERT INTO Books_has_authors (books_book_id, authors_author_id)
    VALUES(
        :books_book_id_input,
        :authors_author_id_input
    )

    -- View all author-book relationships
    SELECT
    Books.title AS Title,
    CONCAT(Authors.first_name, ' ', Authors.last_name) AS 'Name'
    Books_has_authors.books_books_id,
    Books_has_authors.authors_author_id
    FROM Books_has_authors
    JOIN Books ON Books_has_authors.books_book_id = Books.book_id
    JOIN Authors ON Books_has_authors.authors_author_id = Authors.author_id;

-- Users_read_books
    -- Create a user-books relationship via reading
    INSERT INTO Users_read_books (users_user_id, books_book_id, read_date)
    VALUES(
        :users_user_id_input,
        :books_book_id_input,
        :read_date_input
    )

    -- View all user-books relationships via reading
    SELECT
    Users.username AS Username,
    Books.title AS 'Book Title',
    Users_read_books.read_date AS 'Read Date'
    Users_read_books.users_user_id,
    Users_read_books.books_books_id
    FROM Users_read_books
    JOIN Users ON Users_read_books.users_user_id = Users.user_id
    JOIN Books ON Users_read_books.books_book_id = Books.book_id;

-- Books_has_genres
    -- Creates a book-genre relationship
    INSERT INTO Books_has_genres (books_book_id, genres_genre_id)
    VALUES(
        :books_book_id_input,
        :genres_genre_id_input
    )

    -- View all book-genre relationships
    SELECT
    Books.title AS Title,
    Genres.name AS Genre,
    Books_has_genres.books_books_id,
    Books_has_genres.genres_genre_id
    FROM Books_has_genres
    JOIN Books ON Books_has_genres.books_book_id = Books.book_id
    LEFT JOIN Genres ON Books_has_genres.genres_genre_id = Genres.genre_id;

    -- Delete a book-genre relationship
    DELETE FROM Books_has_genres WHERE books_book_id = :book_title_from_dropdown AND genres_genre_id = :genres_name_from_dropdown