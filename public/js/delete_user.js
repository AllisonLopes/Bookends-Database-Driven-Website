// Group members: Joe Castellano and Allison Lopes
// Date: 11/30/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a user using jquery

function deleteUser(user_id) {
    let link = '/delete-user-ajax/';
    let data = {
      user_id: user_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteUserRow(user_id);
      }
    });
  }

  // Delete the row from the table without refresh
  function deleteUserRow(user_id){
    let table = document.getElementById("user-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == user_id) {
            table.deleteRow(i);
            break;
       }
    }
}