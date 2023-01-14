module.exports = function (io) {
    // Crea un arreglo para almacenar los apodos de usuario
    let nicknames = [];
    
    // Establece un manejador de eventos para la conexión de socket
    io.on("connection", function (socket) {
        console.log("Nuevo usuario conectado");
       
        // Escucha el evento "newUser"
        socket.on("newUser", function (nick, callback) {
            // Verifica si el apodo de usuario ya existe en la lista de apodos
            if (nicknames.indexOf(nick) != -1) {
                // Si existe, llama al callback con un valor falso
                callback(false);
            } else {
                // Si no existe, llama al callback con un valor verdadero
                callback(true);
                // Asigna el apodo de usuario al socket
                socket.nickname = nick; 
                /* ⬆️ para entender como se guarda la sesión del usuario 
                   el codigo se ejecuta cada vez que se conecta un usuario
                    y se guarda en el objeto socket el apodo del usuario
                    y tambien se guarda en el arreglo nicknames, en otras palabras
                    no se ejecuta una sola vez, sino cada vez que se conecta un usuario               
                 */
                // Agrega el apodo de usuario a la lista de apodos
                nicknames.push(socket.nickname);
                
                // Emite un evento "NameNewusers" al cliente con la lista actualizada de apodos de usuarios
                io.emit("NameNewusers", nicknames);
            }
        });

        // Establece un manejador de eventos para el evento de desconexión del socket
        socket.on("disconnect", function (data) {
            // Verifica si el socket tiene un apodo de usuario asignado
            if (!socket.nickname) return;
            // Elimina el apodo de usuario de la lista de apodos
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            // Emite un evento "NameNewusers" al cliente con la lista actualizada de apodos de usuarios
            io.emit("NameNewusers", nicknames);
        });

        // Establece un manejador de eventos para el evento "chatMessage"
         socket.on("chatMessage", function (msg) {
            // Emite un evento "chatMessage" al cliente con el mensaje y el apodo de usuario del socket
            io.emit("chatMessage", {
                msg,
                nick: socket.nickname
            });
        });
    });
};
