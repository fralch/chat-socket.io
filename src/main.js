//chat con socket.io
const express = require("express");
const path = require("path");

const app = express();
const server = require("http").Server(app);

//Socket.io conectado al servidor
const io = require("socket.io")(server);

//requiriendo el archivo socket.js para que se ejecute la función que contiene y se le pasa el objeto io
require("./sockets")(io);

//Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// ENV
let puerto = process.env.PORT || 3000;

server.listen(puerto, () => {
    console.log("Server is running on port", puerto);
    });