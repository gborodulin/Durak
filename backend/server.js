import WebSocket from 'ws';
import { messageParser, players, table, Player } from './message-parser-be.js';
import { getCleanTable } from './backEndFunctions.js';

const wss = new WebSocket.Server({ port: 8080 });

function CreateGuid() {
  function _p8(s) {
    var p = (Math.random().toString(16) + '000000000').substr(2, 8);
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

function sendToAll(payload) {
  //update method:
  payload.method = 'fullUpdate';
  //iterate through all players
  Object.values(payload.players).forEach((value, curIndex) => {
    const personalPayload = { ...payload };

    //isolate personal player info
    personalPayload.playerInfo = { ...value };

    //create opponenets arr
    personalPayload.playerInfo.opponents = [];

    for (let i = 1; i < Object.values(payload.players).length; i++) {
      const currentPlayer = Object.values(payload.players)[
        (curIndex + i) % Object.values(payload.players).length
      ];

      let enemy = {
        name: currentPlayer.name,
        handLength: currentPlayer.hand.length,
        role: currentPlayer.role,
      };

      personalPayload.playerInfo.opponents.push(enemy);
    }

    //delete global players info
    delete personalPayload.players;
    //remove websocket info to avoid circular reference error
    delete personalPayload.playerInfo.connection;

    //send to the player
    value.connection.send(JSON.stringify(personalPayload));
  });
}

wss.on('connection', (ws) => {
  if (Object.keys(players).length < 4) {
    const playerId = CreateGuid();
    players[playerId] = new Player(ws);

    ws.send(
      JSON.stringify({ method: 'initialConnection', playerId: playerId })
    );

    ws.onclose = (e) => {
      let idToDelete = null;

      for (const [key, value] of Object.entries(players)) {
        if (value.connection === e.target) {
          idToDelete = key;
          break;
        }
      }

      //End game if that player was in the game
      if (players[idToDelete].inGame === true) {
        Object.values(players).forEach((player) => {
          player.role = null;
        });
        table.gameOver = [true, players[idToDelete].name];
      }

      delete players[idToDelete];

      if (Object.entries(players).length > 0) {
        sendToAll({ players: players, table: table });
      }

      if (Object.entries(players).length === 0) {
        table.gameDeck = [];
        table.cardsToBeBeat = [];
        table.cardsOnTable = [];
        table.attackingCards = [];
        table.defendingCards = [];
        table.trumpCard = { face: 0, suit: '' };
        table.gameOver = [null, ''];
      }
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const payload = messageParser(data);
      if (payload) {
        sendToAll(payload);
      }
    };
  } else {
    const rejectionPayload = { method: 'rejection' };
    ws.send(JSON.stringify(rejectionPayload));
  }
});

export default players;
