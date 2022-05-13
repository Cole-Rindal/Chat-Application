// required dependencies
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let messageArr = Array();
let namesInChat = Array();

// html file to serve
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// old message array json sent to client
app.get('/messages', (req, res) => {
    res.json(JSON.stringify(messageArr));
});

// send names of people in the chat room to json
app.get('/names', (req, res) => {
    res.json(JSON.stringify(namesInChat));
});

// folder for other files to server
app.use(express.static("public"));


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

io.on('connection', (socket) => {    
    socket.on("sendMessage", (msg, sender, time) => {
        messageArr.push(time + " " + sender + ": " + msg);
        if( !namesInChat.includes(sender) ){
            namesInChat.push(sender);            
        }
        socket.broadcast.emit("sendMessage", msg, sender, time);
    });
});

// host on port 3000 of localhost
server.listen(3000, () => {
    console.log('http://localhost:3000/');
});