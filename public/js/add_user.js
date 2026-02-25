// Group members: Joe Castellano and Allison Lopes
// Date: 11/30/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let addUserForm = document.getElementById('add-user-form-ajax');

// Modify the objects we need
addUserForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputUsername = document.getElementById("input-username");
    let inputEmail = document.getElementById("input-email");
    let inputPassword = document.getElementById("input-password");
    let inputReadingGoal = document.getElementById("input-reading_goal");

    // Get the values from the form fields
    let usernameValue = inputUsername.value;
    let emailValue = inputEmail.value;
    let passwordValue = inputPassword.value;
    let readingGoalValue = inputReadingGoal.value;


    // Put our data we want to send in a javascript object
    let data = {
        username: usernameValue,
        email: emailValue,
        password: passwordValue,
        reading_goal: readingGoalValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-user-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addUserRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputUsername.value = '';
            inputEmail.value = '';
            inputPassword.value = '';
            inputReadingGoal.value = '';
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
addUserRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("user-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let usernameCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let passwordCell = document.createElement("TD");
    let readingGoalCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.user_id;
    usernameCell.innerText = newRow.username;
    emailCell.innerText = newRow.email;
    passwordCell.innerText = newRow.password;
    readingGoalCell.innerText = newRow.reading_goal;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteUser(newRow.user_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(usernameCell);
    row.appendChild(emailCell);
    row.appendChild(passwordCell);
    row.appendChild(readingGoalCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.user_id);
    
    // Add the row to the table
    currentTable.appendChild(row);


}