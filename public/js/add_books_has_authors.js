// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// Get the objects we need to modify
let addReadForm = document.getElementById('add-write-form-ajax');

// Modify the objects we need
addReadForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let addBookWrite = document.getElementById("add-write_title");
    let addAuthorWrite = document.getElementById("add-write_author");

    // Get the values from the form fields
    let bookWrite = addBookWrite.value;
    let authorWrite = addAuthorWrite.value;



    // Put our data we want to send in a javascript object
    let data = {
        books_book_id: bookWrite,
        authors_author_id: authorWrite
    };
    console.log("Data being sent to server:", data);


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-has-author-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addBooksHasAuthorRowToTable(xhttp.response, bookWrite);


        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})



// Creates a single row from an Object representing a single record from 
// Books
addBooksHasAuthorRowToTable = (data) => {

    // Get a reference to the current table on the page
    let currentTable = document.getElementById("books_has_authors-table");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];

    // Contains our book data
    let bookInfo = parsedData.book[0];
    // Contains our Author data
    let authorInfo = parsedData.author[0];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let bookTitleCell = document.createElement("TD");
    let authorNameCell = document.createElement("TD");

   

    let deleteWriteCell = document.createElement("TD");

    // Fill the cells with correct data
    bookTitleCell.innerText = bookInfo.title;
    authorNameCell.innerText = `${authorInfo.first_name} ${authorInfo.last_name}`;


    deleteWriteCell = document.createElement("button");
    deleteWriteCell.innerHTML = "Delete";
    deleteWriteCell.onclick = function(){
        deleteUser(newRow.author_id);
    };

    // Add the cells to the row 
    row.appendChild(bookTitleCell);
    row.appendChild(authorNameCell);
    row.appendChild(deleteWriteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', `${bookInfo.book_id}-${authorInfo.name}`);
    
    // Add the row to the table
    currentTable.appendChild(row);


}