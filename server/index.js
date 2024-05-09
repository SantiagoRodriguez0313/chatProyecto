import { time } from 'console'
import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server)

io.on('connection', (socket) => {
    console.log(socket.id)

    socket.on('message', (body) => {
        console.log(body);
        socket.broadcast.emit('message', {
            body,
            from: socket.id.slice(6),
        })
    })
})

server.listen(4000)
console.log('escuchando el puerto 4000')