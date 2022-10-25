const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)
const clients = {};
app.use(express.static(__dirname));
let game = {};
let placar = {}
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
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

  console.log(player1)
  console.log(player2)

  //Envia inicio do game
  if(player1 && player2){
    console.log('iniciando')
    placar = {player1:{"placar":0, "id": player1}, player2:{"placar":0, "id": player2}}
    clients[player1].emit('game.begin', placar)
    clients[player2].emit('game.begin', placar)
  }

  //Recebe jogada
  socket.on('game', (msg) => {
    game[socket.id] = msg;
    console.log(game);
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

server.listen(3000, () => {
  console.log('listening on *:3000');
});


function resultadoGame(game){
  players = 0
  for(i in game){
    players++;
  }
  if(players == 2){
    if(game[player1] == 'pedra'){
      if(game[player2] == 'pedra'){
        empate();
      }
    }

    if(game[player1] == 'pedra'){
      if(game[player2] == 'tesoura'){
        ajustaPlacar(player1)
      }
    }

    if(game[player1] == 'pedra'){
      if(game[player2] == 'papel'){
        ajustaPlacar(player2)
      }
    }

    if(game[player1] == 'papel'){
      if(game[player2] == 'papel'){
        empate();
      }
    }

    if(game[player1] == 'papel'){
      if(game[player2] == 'pedra'){
        ajustaPlacar(player1)
      }
    }

    if(game[player1] == 'papel'){
      if(game[player2] == 'tesoura'){
        ajustaPlacar(player2)
      }
    }

    if(game[player1] == 'tesoura'){
      if(game[player2] == 'tesoura'){
        empate();
      }
    }

    if(game[player1] == 'tesoura'){
      if(game[player2] == 'papel'){
        ajustaPlacar(player1)
      }
    }

    if(game[player1] == 'tesoura'){
      if(game[player2] == 'pedra'){
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
  console.log(ganhador)
  if(player1 == ganhador){
    placar.player1.placar++;
  }
  if(player2 == ganhador){
    placar.player2.placar++;
  }
  clients[player1].emit('proximo', true)
  clients[player2].emit('proximo', true)
  clients[player1].emit('placar', placar)
  clients[player2].emit('placar', placar)
}

function empate(){
  clients[player1].emit('empate', true)
  clients[player2].emit('empate', true)
}