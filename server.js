const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
const clients = {};
app.use(express.static(__dirname));
let game = {};
let placar = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 5000, () => {
  console.log('listening on *:'+process.env.PORT);
});

player1 = null;
player2 = null;
io.on('connection', (socket) => {
  clients[socket.id] = socket;
  console.log('Usuario conectado!');
  if(player1 && !player2){
    player2 = socket.id;
  }

  if(!player1){
    player1 = socket.id;
  }

  //Envia inicio do game
  if(player1 && player2){
    placar = {player1:{"placar":0, "id": player1, "jogada": null}, player2:{"placar":0, "id": player2, "jogada": null}, status: 'online', vencedorTurno: null}
    console.log(placar)
    clients[player1].emit('game.begin', placar)
    clients[player2].emit('game.begin', placar)
  }

  //Recebe jogada
  socket.on('game', (msg) => {
    game[socket.id] = msg;
    console.log(socket.id + ' jogou --->  ' + msg);
    resultadoGame(game);
  });

  socket.on('disconnect', function(){
    console.log('jogador saiu!')
    if(player1 == socket.id){
      player1 = null;
    }
    if(player2 == socket.id){
      player2 = null;
    }
  });
});




function resultadoGame(game){
  players = 0
  for(i in game){
    players++;
  }
  if(players == 2){
    if(game[player1] == 'pedra'){
      if(game[player2] == 'pedra'){
        placar.player1.jogada = 'pedra';
        placar.player2.jogada = 'pedra';
        empate();
      }
    }

    if(game[player1] == 'pedra'){
      if(game[player2] == 'tesoura'){
        placar.player1.jogada = 'pedra';
        placar.player2.jogada = 'tesoura';
        ajustaPlacar(player1)
      }
    }

    if(game[player1] == 'pedra'){
      if(game[player2] == 'papel'){
        placar.player1.jogada = 'pedra';
        placar.player2.jogada = 'papel';
        ajustaPlacar(player2)
      }
    }

    if(game[player1] == 'papel'){
      if(game[player2] == 'papel'){
        placar.player1.jogada = 'papel';
        placar.player2.jogada = 'papel';
        empate();
      }
    }

    if(game[player1] == 'papel'){
      if(game[player2] == 'pedra'){
        placar.player1.jogada = 'papel';
        placar.player2.jogada = 'pedra';
        ajustaPlacar(player1)
      }
    }

    if(game[player1] == 'papel'){
      if(game[player2] == 'tesoura'){
        placar.player1.jogada = 'papel';
        placar.player2.jogada = 'tesoura';
        ajustaPlacar(player2)
      }
    }

    if(game[player1] == 'tesoura'){
      if(game[player2] == 'tesoura'){
        placar.player1.jogada = 'tesoura';
        placar.player2.jogada = 'tesoura';
        empate();
      }
    }

    if(game[player1] == 'tesoura'){
      if(game[player2] == 'papel'){
        placar.player1.jogada = 'tesoura';
        placar.player2.jogada = 'papel';
        ajustaPlacar(player1)
      }
    }

    if(game[player1] == 'tesoura'){
      if(game[player2] == 'pedra'){
        placar.player1.jogada = 'tesoura';
        placar.player2.jogada = 'pedra';
        ajustaPlacar(player2)
      }
    }
    resetGame();
  }
}

function resetGame(){
  delete game[player1];
  delete game[player2];
}

function ajustaPlacar(ganhador){
  if(player1 == ganhador){
    placar.player1.placar++;
    placar.vencedorTurno = ganhador;
  }
  if(player2 == ganhador){
    placar.player2.placar++;
    placar.vencedorTurno = ganhador;
  }
  console.log(placar);
  clients[player1].emit('placar', placar)
  clients[player2].emit('placar', placar)
  placar.vencedorTurno = null;
  placar.player1.jogada = null;
  placar.player2.jogada = null;
}

function empate(){
  clients[player1].emit('empate', placar)
  clients[player2].emit('empate', placar)
}