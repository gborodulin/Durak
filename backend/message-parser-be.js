import {
  faceOnTable,
  defendCard,
  attackWithCard,
  shiftAttackerDefender,
  refillHands,
  checkWhichPlayerIsOut,
  endGameIfOver,
  whoGoesFirst,
  shuffle,
  getCleanTable,
} from './backEndFunctions.js';

const fullDeck = [
  { face: 6, suit: 'S' },
  { face: 7, suit: 'S' },
  { face: 8, suit: 'S' },
  { face: 9, suit: 'S' },
  { face: 10, suit: 'S' },
  { face: 11, suit: 'S' },
  { face: 12, suit: 'S' },
  { face: 13, suit: 'S' },
  { face: 14, suit: 'S' },
  { face: 6, suit: 'C' },
  { face: 7, suit: 'C' },
  { face: 8, suit: 'C' },
  { face: 9, suit: 'C' },
  { face: 10, suit: 'C' },
  { face: 11, suit: 'C' },
  { face: 12, suit: 'C' },
  { face: 13, suit: 'C' },
  { face: 14, suit: 'C' },
  { face: 6, suit: 'D' },
  { face: 7, suit: 'D' },
  { face: 8, suit: 'D' },
  { face: 9, suit: 'D' },
  { face: 10, suit: 'D' },
  { face: 11, suit: 'D' },
  { face: 12, suit: 'D' },
  { face: 13, suit: 'D' },
  { face: 14, suit: 'D' },
  { face: 6, suit: 'H' },
  { face: 7, suit: 'H' },
  { face: 8, suit: 'H' },
  { face: 9, suit: 'H' },
  { face: 10, suit: 'H' },
  { face: 11, suit: 'H' },
  { face: 12, suit: 'H' },
  { face: 13, suit: 'H' },
  { face: 14, suit: 'H' },
];

class Player {
  constructor(ws) {
    this.connection = ws;
    this.name = 'Anonymous';
    this.inGame = false;
    this.hand = [];
    this.role = null;
    this.opponents = [];
    this.selectedCard = null;
    
    this.pass = false;
  }
}

const players = {};

//only referenced here (and front end App.js)
let table = {
  gameDeck: [],
  cardsToBeBeat: [],
  cardsOnTable: [],
  attackingCards: [],
  defendingCards: [],
  trumpCard: { face: 0, suit: '' },
  gameOver: [null, ''],
};

let privateTable = {
  passCounter: 0,
  attackerInitialPass: false,
};

const messageParser = (data) => {
  //---------------------------------------------------------------------------------------START NEW GAME
  if (data.method === 'startNewGame') {
    //erase the whole table
    table = getCleanTable();

    //shuffle the deck
    table.gameDeck = fullDeck.map((x) => x);
    shuffle(table.gameDeck);

    //iterate through all players
    for (const [player, value] of Object.entries(players)) {
      //default all players
      value.inGame = true;
      value.hand = [];
      value.role = null;
      value.opponents = [];
      value.selectedCard = null;
      value.pass = false;

      //deal out cards to each player
      for (var i = 0; value.hand.length < 6; i++) {
        const dealtCard = table.gameDeck.shift();
        value.hand.push(dealtCard);
      }
    }
    //determine the trump suit
    table.trumpCard.face = table.gameDeck[table.gameDeck.length - 1].face;
    table.trumpCard.suit = table.gameDeck[table.gameDeck.length - 1].suit;

    whoGoesFirst(players, table);

    //send payload
    return { players: players, table: table };
    //---------------------------------------------------------------------------------------SELECT CARD FROM HAND
  } else if (data.method === 'selectCardFromHand') {

    const defenderId = Object.keys(players).find((id) => {
      return players[id].role === 'defender';
    });

    if (
      (players[data.playerId].role === 'attacker' ||
        players[data.playerId].role === 'neutral') &&
      faceOnTable(data.card.face, table) === true &&
      players[defenderId].hand.length > table.cardsToBeBeat.length
    ) {
      attackWithCard(players, table, data);
      privateTable.passCounter = 0;
      checkWhichPlayerIsOut(players, table);
      endGameIfOver(players, table);

      return { players: players, table: table };
    } else if (players[data.playerId].role === 'defender') {
      players[data.playerId].selectedCard = data.card;

      return { players: players, table: table };
    }
    //----------------------------------------------------------------------------------------------DEFEND CARD ON TABLE
  } else if (data.method === 'defendCardOnTable') {
    //check if player is defender, has a selected card, and if attack card on table needs to be beat
    if (
      players[data.playerId].role === 'defender' &&
      players[data.playerId].selectedCard !== null &&
      table.cardsToBeBeat.findIndex(
        (cur) => cur.face === data.card.face && cur.suit === data.card.suit
      ) !== -1
    ) {
      //check if selected card is higher face value than attack card || selected card is trump and attack card is not
      if (
        (players[data.playerId].selectedCard.face > data.card.face &&
          players[data.playerId].selectedCard.suit === data.card.suit) ||
        (players[data.playerId].selectedCard.suit === table.trumpCard.suit &&
          data.card.suit !== table.trumpCard.suit)
      ) {
        defendCard(players, table, data);
        checkWhichPlayerIsOut(players, table);
        endGameIfOver(players, table);

        //if defender hand empty, end round as if it was passed
        if (
          players[data.playerId].hand.length === 0 &&
          table.gameOver[0] !== true
        ) {
          data.method = 'pass';
          table.cardsToBeBeat = [];
          table.cardsOnTable = [];
          table.attackingCards = [];
          table.defendingCards = [];

          refillHands(players, table);
          shiftAttackerDefender(players, data);
        }

        return { players: players, table: table };
      }
    }
    //----------------------------------------------------------------------------------------------PICK UP
  } else if (data.method === 'pickUp') {
    players[data.playerId].hand = players[data.playerId].hand.concat(
      table.cardsOnTable
    );

    table.cardsToBeBeat = [];
    table.cardsOnTable = [];
    table.attackingCards = [];
    table.defendingCards = [];

    for (const [player, value] of Object.entries(players)) {
      value.pass = false
    }

    refillHands(players, table);
    shiftAttackerDefender(players, data);

    return { players: players, table: table };
    //----------------------------------------------------------------------------------------------PASS
  } else if (data.method === 'pass') {
    if (
      (players[data.playerId].role === 'attacker' ||
        players[data.playerId].role === 'neutral') &&
      (players[data.playerId].hand.length > 0 || table.gameDeck.length > 0)
    ) {
      privateTable.passCounter += 1;
      players[data.playerId].pass = true
    }

    if (players[data.playerId].role === 'attacker') {
      privateTable.attackerInitialPass = true;
    }

    if (privateTable.attackerInitialPass === true) {
      Object.values(players).forEach((cur) => {
        if (cur.role === null && cur.inGame === true) {
          cur.role = 'neutral';
        }
      });
    }

    const activePlayers = Object.values(players).filter(
      (player) => player.inGame === true
    );

    if (privateTable.passCounter === activePlayers.length - 1) {
      table.cardsToBeBeat = [];
      table.cardsOnTable = [];
      table.attackingCards = [];
      table.defendingCards = [];

      for (const [player, value] of Object.entries(players)) {
        value.pass = false
      }

      refillHands(players, table);
      shiftAttackerDefender(players, data);
    }

    return { players: players, table: table };
  } else if (data.method === 'enterName') {
    players[data.playerId].name = data.name;
    return { players: players, table: table };
  }
};

export { messageParser, players, table, Player };
