
// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a book using jquery

function deleteBook(book_id) {
    let link = '/delete-book-ajax/';
    let data = {
      book_id: book_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(book_id);
      }
    });
  }

  // Delete the row from the table without refresh
  function deleteRow(book_id){
    let table = document.getElementById("book-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == book_id) {
            table.deleteRow(i);
            break;
       }
    }
}