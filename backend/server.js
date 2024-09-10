const express = require('express');
const app = express();
const { createServer } = require('http')
const server = createServer(app);

const { Server } = require("socket.io");
const port = 3001;

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",  // İzin vermek istediğiniz frontend URL'sini buraya yazın
        methods: ["GET", "POST"],
        credentials: true  // Gerekirse kimlik bilgilerine izin verin
    }
});

io.on('connection', socket => {

    console.log(`a user conected: ${socket.id}`);

    socket.on('join_room', ({ user, room }) => {
        socket.join(room)
    })

    socket.on('send_msg', ({ room, user, message }) => {
        const d = { user: user, message: message };
        socket.to(room).emit("receive_msg", d)
    })
})

server.listen(port, () => {
    console.log(`listening on ${port}`)
})