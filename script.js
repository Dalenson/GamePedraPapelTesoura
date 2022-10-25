var socket = io.connect(window.location.origin);

let me = 0;
let player2 = 0;
let placar = {}
let ganhadorTurno = null;

socket.on('game.begin', function(data){
    placar = data;
    if(data.player1.id == socket.id){
        me = data.player1.placar;
    }else{
        me = data.player2.placar;
    }
    alteraPlacar();
    $('.notif').text('Jogo Iniciado!')
});

socket.on('placar', function(data){
    jogadaAdv(data);
    reformulaPlacar(data)
    alteraPlacar();
    $('.notif').text(retornaVencedor(data))
    
    setTimeout(() => {  
        $('.buttonspedra').css("pointer-events", "");
        $('.buttonspapel').css("pointer-events", "");
        $('.buttonstesoura').css("pointer-events", "");
        $('.buttonspedra').css("content", "url('images/pedra.png')");
        $('.buttonspapel').css("content", "url('images/papel.png')");
        $('.buttonstesoura').css("content", "url('images/tesoura.png')");
        $('.notif').text("Sua vez !!!")
     }, 3000);
});

socket.on('empate', function(data){
    $('.buttons'+data.player1.jogada).css("content","url('images/"+data.player1.jogada+"hoverempate.png')")
    $('.notif').text('Empatou!')
    setTimeout(() => {  
        $('.buttonspedra').css("pointer-events", "");
        $('.buttonspapel').css("pointer-events", "");
        $('.buttonstesoura').css("pointer-events", "");
        $('.buttonspedra').css("content", "url('images/pedra.png')");
        $('.buttonspapel').css("content", "url('images/papel.png')");
        $('.buttonstesoura').css("content", "url('images/tesoura.png')");
     }, 3000);
    
    
});


function opcao(opt){
    $('.buttons'+ opt).css("content", "url('images/"+opt+"hover.png')")
    $('.buttonspedra').css("pointer-events", "none");
    $('.buttonspapel').css("pointer-events", "none");
    $('.buttonstesoura').css("pointer-events", "none");
    $('.notif').text('Aguardando jogador!')
    socket.emit('game', opt)
}

function alteraPlacar(){
    $('#player1').text(me)
    $('#player2').text(player2)
}

function reformulaPlacar(data){
    const aux = {}
    aux[data.player1.id] = data.player1.placar;
    aux[data.player2.id] = data.player2.placar;

    me = aux[socket.id];
    if(data.player1.id != socket.id){
        player2 = aux[data.player1.id]
    }
    if(data.player2.id != socket.id){
        player2 = aux[data.player2.id]
    }
}

function retornaVencedor(data){
    if(socket.id == data.vencedorTurno){
        ganhadorTurno = "Você ganhou !!!";
    }else{
        ganhadorTurno = "Você perdeu -.-";
    }
    return ganhadorTurno;
}

function jogadaAdv(data){
    if(data.player1.id == socket.id){
        $(".buttons"+data.player2.jogada).css("content", "url(images/"+data.player2.jogada+"hoverred.png)");
    }else{
        $(".buttons"+data.player1.jogada).css("content", "url(images/"+data.player1.jogada+"hoverred.png)");
    }
}