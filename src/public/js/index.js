$(function(){
    // Establece una conexión con el servidor a través de socket.io
    const socket = io();

    // Obtiene elementos del DOM utilizando selectores de jQuery
    const chatForm = $("#chat-form");
    const chatMessages = $("#chat-message");
    const chatBody = $("#chat-body");
    const nickForm = $("#nick-form");
    const nickError = $("#nick-error");
    const nickName = $("#nick-name");
    const usersBody = $("#users-body");
    let nick = "";

    // Evento para enviar un mensaje al hacer submit en el formulario
    chatForm.submit(function(e){
        e.preventDefault();

        // Obtiene el mensaje del formulario
        const msg = chatMessages.val();

        // Emite un evento "chatMessage" al servidor con el mensaje
        socket.emit("chatMessage", msg);

        // Limpia el campo de entrada
        chatMessages.val("").focus();
    });

    // Escucha el evento "chatMessage" del servidor y agrega el mensaje al DOM
    socket.on("chatMessage", function(respuesta){
        chatBody.append(
            `<div class="card card-body mb-3">  
                <p class="${respuesta.nick == nick ? 'text-success': 'text-primary'}"> <b class="${respuesta.nick == nick ? 'text-success': 'text-primary'}">${respuesta.nick}</b> ${respuesta.msg}</p>
            </div>`
            
            );
    });

    // Evento para enviar un nombre de usuario al hacer submit en el formulario
    nickForm.submit(function(e){
        e.preventDefault();

        // Obtiene el nombre de usuario del formulario
         nick = nickName.val();

        // Emite un evento "newUser" al servidor con el nombre de usuario
        socket.emit("newUser", nick, function(data){
            if(data){
                // Oculta el formulario de ingreso de nombre de usuario y muestra el contenido del chat
                $("#nick-wrap").hide();
                $("#content-wrap").show();
            }else{
                // Muestra un mensaje de error si el nombre de usuario ya existe
                nickError.html(`
                    <div class="alert alert-danger">
                        Ese nombre de usuario ya existe
                    </div>
                `);
            }

            nickName.val("");
        });

    });

    // Escucha el evento "NameNewusers" del servidor y actualiza la lista de usuarios en el DOM
    socket.on("NameNewusers", function(data){
        let html = "";
        let color = "";
        let salir = "";

        // Recorre la lista de usuarios
        for(let i = 0; i < data.length; i++){
           // Si el usuario actual es el mismo que el que está conectado
           if (data[i] == nick) {
               // Establece un color de texto diferente para destacarlo
               color = "text-success";
               // Agrega un enlace para salir
               salir = "<a href='/' >Salir</a>";
              }else{
                color = "text-primary";
                salir = "";
              }
            // Agrega el usuario a la cadena de HTML
            html += `<p class="${color}">${data[i]} ${salir}</p>`;

        }

        // Agrega la cadena de HTML a la lista de usuarios en el DOM
        usersBody.html(html);
    });

})
