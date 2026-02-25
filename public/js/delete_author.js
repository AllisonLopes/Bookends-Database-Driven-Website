// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a book using jquery

function deleteAuthor(author_id) {
    let link = '/delete-author-ajax/';
    let data = {
      author_id: author_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteAuthorRow(author_id);
      }
    });
  }

  // Delete the row from the table without refresh
  function deleteAuthorRow(author_id){
    let table = document.getElementById("author-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == author_id) {
            table.deleteRow(i);
            break;
       }
    }
}