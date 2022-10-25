var socket = io.connect(window.location.origin);

let me = 0;
let player2 = 0;
let placar = {}

socket.on('game.begin', function(data){
    if(data.player1.id == socket.id){
        me = data.player1.placar;
    }else{
        me = data.player2.placar;
    }
    alteraPlacar();
    $('.notif').text('Jogo Iniciado!')
});

socket.on('placar', function(data){
    reformulaPlacar(data)
    alteraPlacar();
});

socket.on('proximo', function(data){
    $('.buttonspedra').css("pointer-events", "");
    $('.buttonspapel').css("pointer-events", "");
    $('.buttonstesoura').css("pointer-events", "");
    $('.buttonspedra').css("content", "url('pedra.png')");
    $('.buttonspapel').css("content", "url('papel.png')");
    $('.buttonstesoura').css("content", "url('tesoura.png')");
});

socket.on('empate', function(data){
    $('.buttonspedra').css("pointer-events", "");
    $('.buttonspapel').css("pointer-events", "");
    $('.buttonstesoura').css("pointer-events", "");
    $('.buttonspedra').css("content", "url('pedra.png')");
    $('.buttonspapel').css("content", "url('papel.png')");
    $('.buttonstesoura').css("content", "url('tesoura.png')");
    $('.notif').text('Empatou!')
});


function opcao(opt){
    $('.buttons'+ opt).css("content", "url('"+opt+"hover.png')")
    $('.buttonspedra').css("pointer-events", "none");
    $('.buttonspapel').css("pointer-events", "none");
    $('.buttonstesoura').css("pointer-events", "none");
    $('.notif').text('Aguardando jogador!')
    socket.emit('game', opt)
}

function alteraPlacar(){
    $('#player1').text(me)
    $('#player2').text(player2)
    $('#id1').text('ID 1: '+socket.id)
}

function reformulaPlacar(data){
    placar[data.player1.id] = data.player1.placar;
    placar[data.player2.id] = data.player2.placar;

    me = placar[socket.id];
    if(data.player1.id != socket.id){
        player2 = placar[data.player1.id]
    }
    if(data.player2.id != socket.id){
        player2 = placar[data.player2.id]
    }
}