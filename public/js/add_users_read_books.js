// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// Get the objects we need to modify
let addReadForm = document.getElementById('add-read-form-ajax');

// Modify the objects we need
addReadForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let addReadUser = document.getElementById("add-read_user");
    let addReadTitle = document.getElementById("add-read_title");
    let addReadDate = document.getElementById("add-read_date");

    // debugging help
    console.log("read_user:", addReadUser.value);
    console.log("read_title:", addReadTitle.value);
    console.log("read_date:", addReadDate.value);


    // Get the values from the form fields
    let userReadValue = addReadUser.value;
    let titleReadValue = addReadTitle.value;
    let readDateValue = addReadDate.value;



    // Put our data we want to send in a javascript object
    let data = {
        users_user_id: userReadValue,
        books_book_id: titleReadValue,
        read_date: readDateValue
    };
    console.log("Data being sent to server:", data);


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-read-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addUsersReadBooksRowToTable(xhttp.response, userReadValue);


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
addUsersReadBooksRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("users_read_books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1];
    // Contains our user data
    let userInfo = parsedData.user[0];
    // Contains are book data
    let bookInfo = parsedData.book[0];

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let userReadCell = document.createElement("TD");
    let bookReadCell = document.createElement("TD");
    let dateReadCell = document.createElement("TD");
   

    let deleteReadCell = document.createElement("TD");

    // Fill the cells with correct data
    userReadCell.innerText = userInfo.username;
    bookReadCell.innerText = bookInfo.title;
    dateReadCell.innerText = parsedData.read_date;


    deleteReadCell = document.createElement("button");
    deleteReadCell.innerHTML = "Delete";
    deleteReadCell.onclick = function(){
        deleteUser(newRow.user_id);
    };

    // Add the cells to the row 
    row.appendChild(userReadCell);
    row.appendChild(bookReadCell);
    row.appendChild(dateReadCell);
    row.appendChild(deleteReadCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', `${userInfo.user_id}-${bookInfo.book_id}`);
    
    // Add the row to the table
    currentTable.appendChild(row);


}