// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Function to show and pre-fill update form
function showUpdateForm(review_id, review_date, review_score, review_text, user_id, book_id) {

    // This function to format date to YYYY-MM-DD is taken from a stack overflow thread
    // Source URL: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
    let formattedDate = new Date(review_date).toISOString().split('T')[0];

    // Show form
    let formContainer = document.getElementById('update-review-form');
    formContainer.style.display = 'block';

    // Pre-fill form
    document.getElementById('update-review-id').value = review_id;
    document.getElementById('update-review-date').value = formattedDate;
    document.getElementById('update-score').value = review_score;
    document.getElementById('update-review-text').value = review_text;
    document.getElementById('update-review-user').value = user_id || "NULL";
    document.getElementById('update-review-book').value = book_id;
}



// Get the objects we need to modify
let updateReviewForm = document.getElementById('update-review-form-ajax');

// Modify the objects we need
updateReviewForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateReviewID = document.getElementById("update-review-id");
    let updateReviewDate = document.getElementById("update-review-date");
    let updateScore = document.getElementById("update-score");
    let updateReviewText = document.getElementById("update-review-text");
    let updateReviewUser = document.getElementById("update-review-user");
    let updateReviewBook = document.getElementById("update-review-book");


    console.log("review_id:", updateReviewID.value);
    console.log("reviewDate:", updateReviewDate.value);
    console.log("score:", updateScore.value);
    console.log("reviewText:", updateReviewText.value);
    console.log("reviewUser:", updateReviewUser.value);
    console.log("reviewBook:", updateReviewBook.value);


    // Get the values from the form fields
    let reviewID = updateReviewID.value;
    let reviewDateValue = updateReviewDate.value;
    let scoreValue = updateScore.value;
    let reviewTextValue = updateReviewText.value;
    let reviewUserValue = updateReviewUser.value;
    let reviewBookValue = updateReviewBook.value;




    // Put our data we want to send in a javascript object
    let data = {
        review_id: reviewID,
        review_date: reviewDateValue,
        review_score: scoreValue,
        review_text: reviewTextValue,
        users_user_id: reviewUserValue,
        books_book_id: reviewBookValue
    };
    console.log("Data being sent to server:", data);


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-review-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, data.review_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// An inelegant adaption of addRow and deleteRow functions seen in other JS files.
function updateRow(data, review_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("review-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == review_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of each cell to be updated
            let reviewDateCell = updateRowIndex.getElementsByTagName("td")[1];
            let reviewScoreCell = updateRowIndex.getElementsByTagName("td")[2];
            let reviewTextCell = updateRowIndex.getElementsByTagName("td")[3];
            let reviewUserCell = updateRowIndex.getElementsByTagName("td")[4];
            let reviewBookCell = updateRowIndex.getElementsByTagName("td")[5];



            // Reassign each cell to our new value
            reviewDateCell.innerHTML = parsedData[0].review_date;
            reviewScoreCell.innerHTML = parsedData[0].review_score; 
            reviewTextCell.innerHTML = parsedData[0].review_text; 
            reviewUserCell.innerHTML = parsedData[0].username; 
            reviewBookCell.innerHTML = parsedData[0].book_title; 



       }
    }
}
