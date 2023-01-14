$(function(){
    const socket = io();

    //Obteniendo elementos del DOM desde el cliente
    const chatForm = $("#chat-form");
    const chatMessages = $("#chat-message");
    const chatBody = $("#chat-body");
    const nickForm = $("#nick-form");
    const nickError = $("#nick-error");
    const nickName = $("#nick-name");
    const usersBody = $("#users-body");
    let nick = "";

    //Evemtos
    //Enviando un mensaje
    chatForm.submit(function(e){
        e.preventDefault();

        //Obteniendo el mensaje del formulario
        const msg = chatMessages.val();

        //Emitiendo un mensaje al servidor
        socket.emit("chatMessage", msg);

        //Limpiando el input
        chatMessages.val("").focus();
    });

    //Obteniendo el mensaje del servidor
    socket.on("chatMessage", function(respuesta){
        chatBody.append(
            `<div class="card card-body mb-3">  
                <p class="${respuesta.nick == nick ? 'text-success': 'text-primary'}"> <b class="${respuesta.nick == nick ? 'text-success': 'text-primary'}">${respuesta.nick}</b> ${respuesta.msg}</p>
            </div>`
            
            );
    });

    //Enviando un nombre de usuario
    nickForm.submit(function(e){
        e.preventDefault();

        //Obteniendo el nombre de usuario
         nick = nickName.val();

        //Emitiendo el nombre de usuario al servidor
        socket.emit("newUser", nick, function(data){
            if(data){
                $("#nick-wrap").hide();
                $("#content-wrap").show();
            }else{
                nickError.html(`
                    <div class="alert alert-danger">
                        Ese nombre de usuario ya existe
                    </div>
                `);
            }

            nickName.val("");
        });

    });

    //Obteniendo los usuarios del servidor
    socket.on("NameNewusers", function(data){
        let html = "";
        let color = "";
        let salir = "";

        for(let i = 0; i < data.length; i++){
           if (data[i] == nick) {
               color = "text-success";
               salir = "<a href='/' >Salir</a>";
              }else{
                color = "text-primary";
                salir = "";
              }
            html += `<p class="${color}">${data[i]} ${salir}</p>`;

        }

        usersBody.html(html);
    });

})