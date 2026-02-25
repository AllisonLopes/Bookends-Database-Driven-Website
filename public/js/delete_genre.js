// Group members: Joe Castellano and Allison Lopes
// Date: 12/1/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a book using jquery

function deleteGenre(genre_id) {
    let link = '/delete-genre-ajax/';
    let data = {
      genre_id: genre_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteGenreRow(genre_id);
      }
    });
  }

  // Delete the row from the table without refresh
  function deleteGenreRow(genre_id){
    let table = document.getElementById("genre-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == genre_id) {
            table.deleteRow(i);
            break;
       }
    }
}