// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main


// Get the objects we need to modify
let updateBookForm = document.getElementById('update-book-form-ajax');

// Modify the objects we need
updateBookForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateTitle = document.getElementById("update-title");
    let updateISBN = document.getElementById("update-isbn");
    let updatePublicationDate = document.getElementById("update-publication_date");

    console.log("book_id:", updateTitle.value);
    console.log("isbn:", updateISBN.value);
    console.log("publication_date:", updatePublicationDate.value);


    // Get the values from the form fields
    let titleValue = updateTitle.value;
    let isbnValue = updateISBN.value;
    let publicationDateValue = updatePublicationDate.value;



    // Put our data we want to send in a javascript object
    let data = {
        book_id: titleValue,
        isbn: isbnValue,
        publication_date: publicationDateValue
    };
    console.log("Data being sent to server:", data);


    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, titleValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})



function updateRow(data, book_id){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("book-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == book_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of isbn value
            let isbnCell = updateRowIndex.getElementsByTagName("td")[2];

            // Reassign isbn to our value we updated to
            isbnCell.innerHTML = parsedData[0].isbn; 

            // Fix date formatting to match DB format
            let publicationDate = new Date(parsedData[0].publication_date);
            let formattedDate = publicationDate.toDateString() + ' ' + publicationDate.toTimeString();

            // Get td of publication_date value
            let publicationDateCell = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign publication_date to our value we updated to
            publicationDateCell.innerHTML = formattedDate;



       }
    }
}