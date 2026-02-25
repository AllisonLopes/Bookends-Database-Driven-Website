// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// Get the objects we need to modify
let addReadForm = document.getElementById('add_book_genre-form-ajax');

// Modify the objects we need
addReadForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let addBookGenre = document.getElementById("add_genre_book_title");
    let addBookGenreName = document.getElementById("add_genre_name");

    // Get the values from the form fields
    let book = addBookGenre.value;
    let genreName = addBookGenreName.value;



    // Put our data we want to send in a javascript object
    let data = {
        books_book_id: book,
        genres_genre_id: genreName
    };
    console.log("Data being sent to server:", data);


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-books-has-genre-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addBooksHasGenreRowToTable(xhttp.response, book);


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
addBooksHasGenreRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books_has_genres-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];
    // Contains our book data
    let bookInfo = parsedData.book[0];
    // Contains our genre data
    let genreInfo = parsedData.genre[0];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let bookTitleCell = document.createElement("TD");
    let genreNameCell = document.createElement("TD");

   

    let deleteReadCell = document.createElement("TD");

    // Fill the cells with correct data
    bookTitleCell.innerText = bookInfo.title;
    genreNameCell.innerText = genreInfo.name;


    deleteReadCell = document.createElement("button");
    deleteReadCell.innerHTML = "Delete";
    deleteReadCell.onclick = function(){
        deleteUser(newRow.genre_id);
    };

    // Add the cells to the row 
    row.appendChild(bookTitleCell);
    row.appendChild(genreNameCell);
    row.appendChild(deleteReadCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', `${bookInfo.book_id}-${genreInfo.name}`);
    
    // Add the row to the table
    currentTable.appendChild(row);


}