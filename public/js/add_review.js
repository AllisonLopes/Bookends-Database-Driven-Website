// Group members: Joe Castellano and Allison Lopes
// Date: 12/8/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let addReviewForm = document.getElementById('add-review-form-ajax');

// Modify the objects we need
addReviewForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputReviewDate = document.getElementById("input-review-date");
    let inputReviewScore = document.getElementById("input-score");
    let inputReviewText = document.getElementById("input-review-text");
    let inputReviewUsername = document.getElementById("add-review-user");
    let inputReviewTitle = document.getElementById("add-review_book");
    

    // Get the values from the form fields
    let reviewDateValue = inputReviewDate.value;
    let scoreValue = inputReviewScore.value;
    let reviewTextValue = inputReviewText.value;
    let reviewUsernameValue = inputReviewUsername.value;
    let reviewBookValue = inputReviewTitle.value;

    // debugging help
    console.log("review_date:", reviewDateValue);
    console.log("review_score:", scoreValue);
    console.log("review_text:", reviewTextValue);
    console.log("users_user_id:", reviewUsernameValue);
    console.log("books_book_id:", reviewBookValue);


    // Put our data we want to send in a javascript object
    let reviews = {
        review_date: reviewDateValue,
        review_score: scoreValue,
        review_text: reviewTextValue,
        users_user_id: reviewUsernameValue,
        books_book_id: reviewBookValue,
    }



    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-review-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addReviewsRowToTable(xhttp.response);


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(reviews));

})


// Creates a single row from an Object representing a single record from 
// Reviews
addReviewsRowToTable = (reviews) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("review-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(reviews);
    let newRow = parsedData[parsedData.length - 1]
    let userInfo = parsedData.user[0]
    let bookInfo = parsedData.book[0]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let scoreCell = document.createElement("TD");
    let textCell = document.createElement("TD");
    let usernameCell = document.createElement("TD");
    let titleCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = parsedData.review_id
    dateCell.innerText = parsedData.review_date;
    scoreCell.innerText = parsedData.review_score;
    textCell.innerText = parsedData.review_text;
    usernameCell.innerText = userInfo.username;
    titleCell.innerText = bookInfo.title;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteReview(newRow.review_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(dateCell);
    row.appendChild(scoreCell);
    row.appendChild(textCell);
    row.appendChild(usernameCell);
    row.appendChild(titleCell);
    row.appendChild(deleteCell)

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('reviews-value', parsedData.review_id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}