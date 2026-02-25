// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));
PORT = 64413;

// Database
var db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        res.render('index');
    });

    app.get('/books', function(req, res)
    {
        // Get all books
        let query1 = "SELECT * FROM Books;";
        db.pool.query(query1, function(error, rows, fields){

            res.render('books', {data: rows});
        })
    });

    
    app.get('/users', function(req, res)
    {   
        // Get all users
        let query1 = "SELECT * FROM Users;";
        // Get all books
        let query2 = "SELECT * FROM Books;";
        // -- View all user-books relationships via reading
        let query3 = `
            SELECT
                Users.username AS Username,
                Books.title AS 'Book Title',
                Users_read_books.read_date AS 'Read Date',
                Users_read_books.users_user_id,
                Users_read_books.books_book_id
            FROM Users_read_books
            JOIN Users ON Users_read_books.users_user_id = Users.user_id
            JOIN Books ON Users_read_books.books_book_id = Books.book_id;`;

        db.pool.query(query1, function(error1, rows1, fields1){
            db.pool.query(query2, function(error2, rows2, fields2){
                db.pool.query(query3, function(error3, rows3, fields3){
                    res.render('users', {users: rows1, books: rows2, users_read_books: rows3});
                });
            });
        });
    });

    app.get('/reviews', function(req, res)
    {
        // Get user_id and username columns from Users
        let query1 = "SELECT user_id, username FROM Users;";
        // Get book_id and title columns from Books
        let query2 = "SELECT book_id, title FROM Books;";
        // View all reviews
        let query3 = 
            `SELECT 
                Reviews.review_id,
                Reviews.review_date,
                Reviews.review_score,
                Reviews.review_text,
                Users.username, 
                Books.title AS book_title,
                Users.user_id,
                Books.book_id
            FROM Reviews
            LEFT JOIN Users ON Reviews.users_user_id = Users.user_id
            LEFT JOIN Books ON Reviews.books_book_id = Books.book_id;`;

            db.pool.query(query1, function(error1, rowsUsers, fields1) {
                if (error1) {
                    console.error("Error fetching reviews:", error1);
                    res.sendStatus(500);
                    return;
                }
        
                db.pool.query(query2, function(error2, rowsBooks, fields2) {
                    if (error2) {
                        console.error("Error fetching users:", error2);
                        res.sendStatus(500);
                        return;
                    }
        
                    db.pool.query(query3, function(error3, rowsReviews, fields3) {
                        if (error3) {
                            console.error("Error fetching books:", error3);
                            res.sendStatus(500);
                            return;
                        }
        
                        // Render the page with reviews, users, and books
                        res.render('reviews', {
                            reviews: rowsReviews,
                            users: rowsUsers,
                            books: rowsBooks
                        });
                    });
                });
            });
        });

    app.get('/authors', function(req, res)
    {
        // Get all authors
        let query1 = "SELECT * FROM Authors;";
        // Get all books
        let query2 = "SELECT * FROM Books"

        // View all author-book relationships
        let query3 = 
            `
            SELECT
            Books.title AS Title,
            CONCAT(Authors.first_name, ' ', Authors.last_name) AS 'Name',
            Books_has_authors.books_book_id,
            Books_has_authors.authors_author_id
            FROM Books_has_authors
            JOIN Books ON Books_has_authors.books_book_id = Books.book_id
            JOIN Authors ON Books_has_authors.authors_author_id = Authors.author_id;`;

            db.pool.query(query1, function(error1, rows1, fields1) {
                if (error1) {
                    console.error("Error fetching authors:", error1);
                    res.sendStatus(500);
                    return;
                }
        
                db.pool.query(query2, function(error2, rows2, fields2) {
                    if (error2) {
                        console.error("Error fetching books:", error2);
                        res.sendStatus(500);
                        return;
                    }
        
                    db.pool.query(query3, function(error3, rows3, fields3) {
                        if (error3) {
                            console.error("Error fetching books_has_authors data:", error3);
                            res.sendStatus(500);
                            return;
                        }
        
                        // Render the page with authors, books, and books_has_authors data
                        res.render('authors', {
                            authors: rows1,
                            books: rows2,
                            books_has_authors: rows3
                        });
                    });
                });
            });
        });

    app.get('/genres', function(req, res)
    {
        // Get all genres
        let query1 = "SELECT * FROM Genres;";
        // Get all books
        let query2 = "SELECT * FROM Books;";
        // View all genre-book relationships
        let query3 = `
        SELECT
        Books.title AS Title,
        Genres.name AS Genre,
        Books_has_genres.books_book_id,
        Books_has_genres.genres_genre_id
        FROM Books_has_genres
        JOIN Books ON Books_has_genres.books_book_id = Books.book_id
        JOIN Genres ON Books_has_genres.genres_genre_id = Genres.genre_id;`;

        db.pool.query(query1, function(error1, rows1, fields1){
            db.pool.query(query2, function(error2, rows2, fields2){
                db.pool.query(query3, function(error3, rows3, fields3){
                    res.render('genres',{genres: rows1, books: rows2, books_has_genres: rows3})
                })
            });
        });
    });




// Book Page - Add function:
app.post('/add-book-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Books (title, isbn, publication_date) VALUES ('${data.title}', '${data.isbn}', '${data.publication_date}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Books
            query2 = `SELECT * FROM Books;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// Book Page - Delete function:
app.delete('/delete-book-ajax/', function(req,res,next){
    let data = req.body;
    let book_id = parseInt(data.book_id);
    let deleteBook = `DELETE FROM Books WHERE book_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteBook, [book_id], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });


// Book Page - Update Function:
app.put('/put-book-ajax', function(req,res,next){
    let data = req.body;
  
    let book_id = data.book_id;
    let isbn = data.isbn;
    let publication_date = data.publication_date;
  
    let queryUpdateBook = `
    UPDATE Books
    SET
    isbn = ?,
    publication_date = ?
    WHERE book_id = ?`;

    let selectBook= `SELECT * FROM Books WHERE book_id = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateBook, [isbn, publication_date, book_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectBook, [book_id], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.json(rows);
                      }
                  })
              }
  })});


  // Author Page - Add function:
app.post('/add-author-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Authors (first_name, last_name, date_of_birth, bio) VALUES ('${data.first_name}', '${data.last_name}', '${data.date_of_birth}', '${data.bio}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
        }
        else
        {
            // If there was no error, perform a SELECT * on Authors
            query2 = `SELECT * FROM Authors;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// Author Page - Delete function:
app.delete('/delete-author-ajax/', function(req,res,next){
    let data = req.body;
    let author_id = parseInt(data.author_id);
    let deleteAuthor = `DELETE FROM Authors WHERE author_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteAuthor, [author_id], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

// Author Page - Add Book has author Function:
app.post('/add-books-has-author-ajax', function(req, res, next) {
    let data = req.body;
    // for debugging
    console.log("Data received:", data);

    let book_id = data.books_book_id;
    let author_id = data.authors_author_id;

    let selectBook = `SELECT * FROM Books WHERE book_id = ?`;
    let selectAuthor = `SELECT * FROM Authors WHERE author_id = ?`;

    let queryAddBookAuthor = `
    INSERT INTO Books_has_authors (books_book_id, authors_author_id) 
    VALUES (?, ?)`;

    // Run the 1st query
    db.pool.query(queryAddBookAuthor, [book_id, author_id], function(error, rows, fields) {
        if (error) {
            // Log the error and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the second query
            db.pool.query(selectBook, [book_id], function(error, bookRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Run the third query
                    db.pool.query(selectAuthor, [author_id], function(error, authorRows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Combine both book and user data into a single response
                            res.json({
                                book: bookRows,
                                author: authorRows
                            });
                        }
                    });
                }
            });
        }
    });
});

  // Author Page - Delete author Book relationship:
  app.delete('/delete-book-authors-ajax/', function(req,res,next){
    let {books_book_id, authors_author_id} = req.body;

    let deleteBookAuthors = `DELETE FROM Books_has_authors WHERE books_book_id = '${books_book_id}' AND authors_author_id = '${authors_author_id}'`;
  
          // Run the 1st query
          db.pool.query(deleteBookAuthors, function(error){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

  // User Page - Add function:
  app.post('/add-user-ajax', function(req, res) 
  {

      // Capture the incoming data and parse it back to a JS object
      let data = req.body;
  
      // Create the query and run it on the database
      query1 = `INSERT INTO Users (username, email, password, reading_goal) VALUES ('${data.username}', '${data.email}', '${data.password}', '${data.reading_goal}')`;
      db.pool.query(query1, function(error, rows, fields){
  
          // Check to see if there was an error
          if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error)
              res.status(500).send("Error inserting user into the database.");
          }
          else
          {
              // If there was no error, perform a SELECT * on Authors
              query2 = `SELECT * FROM Users;`;
              db.pool.query(query2, function(error, rows, fields){
  
                  // If there was an error on the second query, send a 400
                  if (error) {
                      
                      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                      console.log(error);
                      res.sendStatus(400);
                  }
                  // If all went well, send the results of the query back.
                  else
                  {
                      res.send(rows);
                  }
              })
          }
      })
  });


  // User Page - Delete function:
app.delete('/delete-user-ajax/', function(req,res,next){
    let data = req.body;
    let user_id = parseInt(data.user_id);
    let deleteUser = `DELETE FROM Users WHERE user_id = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteUser, [user_id], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

// User Page - Add Read Book  Function:
app.post('/add-read-ajax', function(req, res, next) {
    let data = req.body;

    let user_id = data.users_user_id;
    let book_id = data.books_book_id;
    let read_date = data.read_date;

    let selectBook = `SELECT * FROM Books WHERE book_id = ?`;
    let selectUser = `SELECT * FROM Users WHERE user_id = ?`;

    let queryAddRead = `
    INSERT INTO Users_read_books (users_user_id, books_book_id, read_date) 
    VALUES (?, ?, ?)`;

    // Add read relationship
    db.pool.query(queryAddRead, [user_id, book_id, read_date], function(error, rows, fields) {
        if (error) {
            // Log the error and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Get books
            db.pool.query(selectBook, [book_id], function(error, bookRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Get users
                    db.pool.query(selectUser, [user_id], function(error, userRows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Combine both book and user data into a single response, throw in read_date for table display
                            res.json({
                                book: bookRows,
                                user: userRows,
                                read_date
                            });
                        }
                    });
                }
            });
        }
    });
});



  // User Page - Delete Read Book relationship:
  app.delete('/delete-read-books-ajax/', function(req,res,next){
    let {users_user_id, books_book_id} = req.body;

    let deleteReadBook = `DELETE FROM Users_read_books WHERE users_user_id = '${users_user_id}' AND books_book_id = '${books_book_id}'`;
  
          db.pool.query(deleteReadBook, function(error){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });




// Review Page - Add function:
app.post('/add-review-ajax', function(req, res) 
{
    // Capture data
    let data = req.body;

    let review_date = data.review_date;
    let review_score = data.review_score;
    let review_text = data.review_text;
    let user_id = data.users_user_id;
    let book_id = data.books_book_id;

    let selectUser = `SELECT * FROM Users WHERE user_id = ?`;
    let selectBook = `SELECT * FROM Books WHERE book_id = ?`;


    let queryAddReview = `
    INSERT INTO Reviews (review_date, review_score, review_text, users_user_id, books_book_id) 
    VALUES (?, ?, ?, ?, ?)`;

    // Run add review query
    db.pool.query(queryAddReview, [review_date, review_score, review_text, user_id, book_id], function(error, rows, fields) {
        if (error) {
            // Log the error and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Get the new review_id generated by DB
            let review_id = rows.insertId;
            // Get all books
            db.pool.query(selectBook, [book_id], function(error, bookRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Get all users
                    db.pool.query(selectUser, [user_id], function(error, userRows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Combine all into a response for table display and dropdowns
                            res.json({
                                review_date,
                                review_score,
                                review_text,
                                review_id,
                                book: bookRows,
                                user: userRows,
                            });
                        }
                    });
                }
            });
        }
    });
});


// Review Page - Delete function:
app.delete('/delete-review-ajax/', function(req,res,next){
    let data = req.body;
    let review_id = parseInt(data.review_id);
    let deleteReview = `DELETE FROM Reviews WHERE review_id = ?`;
  
          db.pool.query(deleteReview, [review_id], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

// Review Page - Update Function:
app.put('/put-review-ajax', function(req, res, next) {
    let data = req.body;

    // Capture data from the request body
    let review_id = data.review_id;
    let review_date = data.review_date;
    let review_score = data.review_score;
    let review_text = data.review_text;
    let user_id = data.users_user_id === "NULL" ? null : data.users_user_id;
    let book_id = data.books_book_id;

    // Update query for the Reviews table
    let queryUpdateReview = `
        UPDATE Reviews
        SET
            review_date = ?,
            review_score = ?,
            review_text = ?,
            users_user_id = ?,
            books_book_id = ?
        WHERE review_id = ?`;

    // Query to select the updated review
    let selectReview = `
        SELECT
            Reviews.review_id,
            Reviews.review_date,
            Reviews.review_score,
            Reviews.review_text,
            Users.username,
            Books.title AS book_title
        FROM Reviews
        LEFT JOIN Users ON Reviews.users_user_id = Users.user_id
        LEFT JOIN Books ON Reviews.books_book_id = Books.book_id
        WHERE Reviews.review_id = ?`;

    // Run the update query
    db.pool.query(queryUpdateReview, [review_date, review_score, review_text, user_id, book_id, review_id], function(error, rows1) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(selectReview, [review_id], function(error, rows2) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Send back the updated row data
                    res.json(rows2);
                }
            });
        }
    });
});



// Genre Page - Add function:
app.post('/add-genre-ajax', function(req, res) 
{
    // Capture the data
    let data = req.body;

    // Add new genre
    query1 = `INSERT INTO Genres (name, description) VALUES ('${data.name}', '${data.description}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Genres
            query2 = `SELECT * FROM Genres;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});


// Genre Page - Delete function:
app.delete('/delete-genre-ajax/', function(req,res,next){
    let data = req.body;
    let genre_id = parseInt(data.genre_id);
    let deleteGenre = `DELETE FROM Genres WHERE genre_id = ?`;
  
  
          // Delete genre 
          db.pool.query(deleteGenre, [genre_id], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

// Genre Page - Add Book has genre Function:
app.post('/add-books-has-genre-ajax', function(req, res, next) {
    let data = req.body;

    // Capture data
    let book_id = data.books_book_id;
    let genre_id = data.genres_genre_id;

    // Get all books
    let selectBook = `SELECT * FROM Books WHERE book_id = ?`;
    // Get all genres
    let selectGenre = `SELECT * FROM Genres WHERE genre_id = ?`;

    // Add book has genre relationship
    let queryAddBookGenre = `
    INSERT INTO Books_has_genres (books_book_id, genres_genre_id) 
    VALUES (?, ?)`;

    // Run add book has genre query
    db.pool.query(queryAddBookGenre, [book_id, genre_id], function(error, rows, fields) {
        if (error) {
            // Log the error and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Get all books
            db.pool.query(selectBook, [book_id], function(error, bookRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Get all genres
                    db.pool.query(selectGenre, [genre_id], function(error, genreRows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Combine both book and genre data into a single response for display in table
                            res.json({
                                book: bookRows,
                                genre: genreRows
                            });
                        }
                    });
                }
            });
        }
    });
});


  // Genre Page - Delete Book Genre:
  app.delete('/delete-book-genres-ajax/', function(req,res,next){
    let {books_book_id, genres_genre_id} = req.body;

    let deleteBookGenres = `DELETE FROM Books_has_genres WHERE books_book_id = '${books_book_id}' AND genres_genre_id = '${genres_genre_id}'`;
  
          db.pool.query(deleteBookGenres, function(error){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

/*
    LISTENER
*/
app.listen(PORT, function(){ // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});