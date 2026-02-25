// Group members: Joe Castellano and Allison Lopes
// Date: 11/21/2024
// Adapted from: OSU node.js starter app Github code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
// THIS FILE IS SANITIZED PLEASE ISNERT YOUR OWN CREDENTIALS

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'your_username',
    password        : 'your_password',
    database        : 'your_database'
})

// Export it for use in our application
module.exports.pool = pool;