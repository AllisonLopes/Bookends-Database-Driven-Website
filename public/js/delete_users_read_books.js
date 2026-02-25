
// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a book using jquery

function deleteReadBook(users_user_id, books_book_id) {
    let link = '/delete-read-books-ajax/';
    let data = {
      users_user_id: users_user_id,
      books_book_id: books_book_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(users_user_id, books_book_id);
      }
    });
  }

  // Delete the row from the table without refresh
  function deleteRow(users_user_id, books_book_id){
    let table = document.getElementById("users_read_books-table");
    for (let row of table.rows) {
        if (
            row.getAttribute("data-user-id") == users_user_id &&
            row.getAttribute("data-book-id") == books_book_id
        ) {
            table.deleteRow(row.rowIndex);
            console.log(`Row with users_user_id ${users_user_id} and books_book_id ${books_book_id} deleted.`);
            break;
        }
    }
  }