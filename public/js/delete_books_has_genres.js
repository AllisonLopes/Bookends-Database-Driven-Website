
// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a book using jquery

function deleteBookGenres(books_book_id, genres_genre_id) {
    let link = '/delete-book-genres-ajax/';
    let data = {
      books_book_id: books_book_id,
      genres_genre_id: genres_genre_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(books_book_id, genres_genre_id);
      }
    });
  }

  // Delete the row from the table without refresh
  // deleteRow function differs from starter code in how it iterates through the table rows.
  function deleteRow(books_book_id, genres_genre_id){
    let table = document.getElementById("books_has_genres-table");
    for (let row of table.rows) {
        if (
            row.getAttribute("data-book-id") == books_book_id &&
            row.getAttribute("data-genre-id") == genres_genre_id
        ) {
            table.deleteRow(row.rowIndex);
            console.log(`Row with books_book_id ${books_book_id} and genres_genre_id ${genres_genre_id} deleted.`);
            break;
        }
    }
  }