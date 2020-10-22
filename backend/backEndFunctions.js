const faceOnTable = (face, table) => {
  const cardsOnTable = table.cardsOnTable;
  let isOnTable = false;
  if (cardsOnTable.length === 0) {
    isOnTable = true;
  } else {
    cardsOnTable.forEach((c) => {
      if (c.face === face) {
        isOnTable = true;
      }
    });
  }
  return isOnTable;
};

const defendCard = (players, table, data) => {
  //remove selectedCard from hand
  var newHand = players[data.playerId].hand.filter(
    (c) =>
      !(
        c.face === players[data.playerId].selectedCard.face &&
        c.suit === players[data.playerId].selectedCard.suit
      )
  );
  players[data.playerId].hand = newHand;

  //remove card from cards to be beat
  const removeCardToBeBeat = table.cardsToBeBeat.findIndex(
    (cur) => cur.face === data.card.face && cur.suit === data.card.suit
  );

  table.cardsToBeBeat.splice(removeCardToBeBeat, 1);

  //find index of card wanting to be defended
  const indexOfAttackCard = table.attackingCards.findIndex(
    (cur) => cur.face === data.card.face && cur.suit === data.card.suit
  );

  //place defense card in parrallel array at same index of attack card
  table.defendingCards.splice(
    indexOfAttackCard,
    1,
    players[data.playerId].selectedCard
  );
  //place card in general cards on table
  table.cardsOnTable.push(players[data.playerId].selectedCard);
  //reset the selected card
  players[data.playerId].selectedCard = null;
};

const attackWithCard = (players, table, data) => {
  const newHand = players[data.playerId].hand.filter(
    (c) => !(c.face === data.card.face && c.suit === data.card.suit)
  );
  players[data.playerId].hand = newHand;
  table.cardsToBeBeat.push(data.card);
  table.attackingCards.push(data.card);
  table.cardsOnTable.push(data.card);
  table.defendingCards.push({});

  for (const [player, value] of Object.entries(players)) {
    value.pass = false
  }
};

const shiftAttackerDefender = (players, data) => {
  const attackerLocation = Object.values(players).findIndex(
    (cur) => cur.role === 'attacker'
  );

  if (Object.values(players)[attackerLocation].hand.length === 0) {
    Object.values(players)[attackerLocation].role = null;
  }

  let defenderLocation = Object.values(players).findIndex(
    (cur) => cur.role === 'defender'
  );

  Object.values(players)[defenderLocation].role = null;
  Object.values(players)[defenderLocation].selectedCard = null;

  while (Object.values(players)[defenderLocation].inGame === false) {
    if (defenderLocation === Object.values(players).length - 1) {
      defenderLocation = 0;
    } else {
      defenderLocation += 1;
    }
  }

  Object.values(players)[defenderLocation].role = 'defender';

  const activePlayers = Object.values(players).filter(
    (player) => player.inGame === true
  );

  defenderLocation = activePlayers.findIndex((cur) => cur.role === 'defender');

  for (let i = 0; i < activePlayers.length; i++) {
    const currentPlayer =
      activePlayers[(defenderLocation + i) % activePlayers.length];

    if (data.method === 'pickUp' && activePlayers.length > 2) {
      if (i === 1) {
        currentPlayer.role = 'attacker';
      } else if (i === 2) {
        currentPlayer.role = 'defender';
      } else {
        currentPlayer.role = null;
      }
    } else if (data.method === 'pickUp' && activePlayers.length === 2) {
      if (i === 0) {
        currentPlayer.role = 'defender';
      } else if (i === 1) {
        currentPlayer.role = 'attacker';
      } else {
        currentPlayer.role = null;
      }
    } else if (data.method === 'pass') {
      if (i === 0) {
        currentPlayer.role = 'attacker';
      } else if (i === 1) {
        currentPlayer.role = 'defender';
      } else {
        currentPlayer.role = null;
      }
    }
  }
};

const refillHands = (players, table) => {
  if (table.gameDeck.length !== 0) {
    //locate current attacker
    const attackerLocation = Object.values(players).findIndex(
      (cur) => cur.role === 'attacker'
    );

    //locate current defender
    const defenderLocation = Object.values(players).findIndex(
      (cur) => cur.role === 'defender'
    );

    //start iterating at attacker position
    for (let i = 0; i < Object.values(players).length; i++) {
      const currentPlayer = Object.values(players)[
        (attackerLocation + i) % Object.values(players).length
      ];

      if (currentPlayer.role !== 'defender' && currentPlayer.inGame === true) {
        for (let i = 0; currentPlayer.hand.length < 6; i++) {
          if (table.gameDeck.length > 0) {
            const dealtCard = table.gameDeck.shift();
            currentPlayer.hand.push(dealtCard);
          } else {
            break;
          }
        }
      }
    }

    //add to defender's hand last
    for (
      let i = 0;
      Object.values(players)[defenderLocation].hand.length < 6;
      i++
    ) {
      if (table.gameDeck.length > 0) {
        const dealtCard = table.gameDeck.shift();
        Object.values(players)[defenderLocation].hand.push(dealtCard);
      } else {
        break;
      }
    }
  }
};

const checkWhichPlayerIsOut = (players, table) => {
  if (table.gameDeck.length === 0) {
    Object.values(players).forEach((player) => {
      if (player.hand.length === 0) {
        player.inGame = false;
      }
    });
  }
};

const endGameIfOver = (players, table) => {
  const activePlayers = Object.values(players).filter(
    (player) => player.inGame === true
  );

  if (activePlayers.length === 1) {
    Object.values(players).forEach((player) => {
      player.role = null;
    });
    table.gameOver = [true, activePlayers[0].name];
  }
};


//
const forfeit = (players, table, loserName) => {
  Object.values(players).forEach((player) => {
    player.role = null;
    player.hand = [];
  });

  table.gameOver = [true, loserName];
}
//


const whoGoesFirst = (players, table) => {
  //who has the lowest trump
  let firstLowestTrumpFound = false;
  for (var i = 6; i < 15; i++) {
    for (const [player, value] of Object.entries(players)) {
      if (
        value.hand.findIndex((cur) => {
          return cur.face === i && cur.suit === table.trumpCard.suit;
        }) !== -1
      ) {
        firstLowestTrumpFound = true;
        value.role = 'attacker';

        const defenderLocation = Object.keys(players).indexOf(player) + 1;

        if (Object.values(players)[defenderLocation]) {
          Object.values(players)[defenderLocation].role = 'defender';
        } else {
          Object.values(players)[0].role = 'defender';
        }

        break;
      }
    }
    if (firstLowestTrumpFound === true) {
      break;
    }
  }
  //set first player as attacker and second as defender if no one got trumps
  if (firstLowestTrumpFound === false) {
    for (const [player, value] of Object.entries(players)) {
      value.role = 'attacker';
      const defenderLocation = Object.keys(players).indexOf(player) + 1;

      Object.values(players)[defenderLocation].role = 'defender';
      break;
    }
  }
};

const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getCleanTable = () => {
  return {
    gameDeck: [],
    cardsToBeBeat: [],
    cardsOnTable: [],
    attackingCards: [],
    defendingCards: [],
    trumpCard: { face: 0, suit: '' },
    gameOver: [false, ''],
  };
};

export {
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
  forfeit
};
