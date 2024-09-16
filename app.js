const express = require('express')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const socketIO = require('socket.io')

const db = require('./db')
const PORT = 3000

const app = express()
const server = http.createServer(app)

const io = socketIO(server)

app.use(bodyParser.json())
// app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static(path.join(__dirname, '/')))

// route login page
app.get("/", (req, res) => {

    res.set({
        "Allow-access-Allow-Origin": '*'
    });

    return res.redirect('login.html');

});

app.get("/signup", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    
    return res.redirect('signup.html')
});
/*
app.get('/', (req,res) => {
    // res.sendFile(path.join(__dirname, 'views', 'index.html'))
    res.sendFile(__dirname + '/chat.html')
});
*/

// post user login information
app.post("/chat", async (request, response) => {
    try {
        const username = request.body.username;
        const password = request.body.password;

        const login = await db.conn.collection('users').findOne({ username: username }, (err, res) => {
            if (res === null) {
                console.log("Information not match. Please create account first")
            }
            else if (err) throw err

            if (res.password === password) {
                return response.redirect('chat.html');
            } else {
                response.send("Invalid Password!❌❌❌");
            }
        });

    }
    catch (error) {
        response.status(400).send("Invalid information❌");
    }

});

// post user signup information
app.post("/signup", async (request, response) => {
    try {
        const name_real = request.body.name;
        const phone_num = request.body.phno;
        const user = request.body.username;
        const pass = request.body.password;

        const User = mongoose.model('User', Schema({
            name: String,
            phno: String,
            password: String,
            username: String
        }));

        const user_signup = new User({
            name: name_real,
            phno: phone_num,
            password: pass,
            username: user
        });
        await user_signup.save()
    }
    catch (error) {
        response.status(400).send("Error to database")
    }
});

// Handle Socket Connection
io.on('connection', (socket) => {
    console.log('A new user connected')

    // handle incoming message
    socket.on('message', (message) => {
        console.log('Message received: ', message)

        // Broadcast this message to all connected users
        io.emit('message', message)
    });
})

// Server Listen
server.listen(PORT, (err) => {
    if(err) {
        console.log('Server bağlantısı kurulamadı.')
    } else {
        console.log(`Server listening on port ${PORT}`)
    }
});