// Group members: Joe Castellano and Allison Lopes
// Date: 12/1/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// delete a review using jquery

function deleteReview(review_id) {
    let link = '/delete-review-ajax/';
    let data = {
      review_id: review_id
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(review_id);
      }
    });
  }

  // Delete the row from the table without refresh
  function deleteRow(review_id){
    let table = document.getElementById("review-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == review_id) {
            table.deleteRow(i);
            break;
       }
    }
}