module.exports = function (io) {
    io.on("connection", function (socket) {
        console.log("Nuevo usuario conectado");
        socket.on("disconnect", function () {
            console.log("Usuario desconectado");
        });
    });
};