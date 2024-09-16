// Database page
const mongoose = require('mongoose')

// Connect database
mongoose.connect('mongodb://127.0.0.1:27017/loginpage') // Your MongoDB database url
const conn = mongoose.connection;

// Check connect
let error = conn.on('error', () => console.log("error in connecting database"));
let open = conn.once('open', () => console.log("Connected to Database"));

module.exports = {
    conn,
    error,
    open
}