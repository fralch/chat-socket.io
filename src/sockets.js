module.exports = function (io) {
    let nicknames = [];
    
    io.on("connection", function (socket) {
        console.log("Nuevo usuario conectado");
        // Escuchando el evento chatMessage
        socket.on("chatMessage", function (msg) {
            // console.log(msg);
            // io.sockets.emit("chatMessage", msg);
            io.emit("chatMessage", {
                 msg,
                nick: socket.nickname
            });
        });

        // Escuchando el evento newUser
        socket.on("newUser", function (nick, callback) {
            if (nicknames.indexOf(nick) != -1) {
                callback(false);
            } else {
                callback(true);
                socket.nickname = nick;
                nicknames.push(socket.nickname);
                
                io.emit("NameNewusers", nicknames);
            }
        });

        // Escuchando el evento disconnect
        socket.on("disconnect", function (data) {
            if (!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            io.emit("NameNewusers", nicknames);
        });
    });
};