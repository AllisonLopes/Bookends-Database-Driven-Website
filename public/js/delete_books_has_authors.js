
// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a book using jquery

function deleteBookAuthors(books_book_id, authors_author_id) {
    let link = '/delete-book-authors-ajax/';
    let data = {
      books_book_id: books_book_id,
      authors_author_id: authors_author_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(books_book_id, authors_author_id);
      }
    });
  }

  // Delete the row from the table without refresh
  // deleteRow function differs from starter code in how it iterates through the table rows.
  function deleteRow(books_book_id, authors_author_id){
    let table = document.getElementById("books_has_authors-table");
    for (let row of table.rows) {
        if (
            row.getAttribute("data-value-book") == books_book_id &&
            row.getAttribute("data-value-author") == authors_author_id
        ) {
            table.deleteRow(row.rowIndex);
            console.log(`Row with books_book_id ${books_book_id} and authors_author_id ${authors_author_id} deleted.`);
            break;
        }
    }
  }