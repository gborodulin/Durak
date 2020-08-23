// const activePlayers = Object.values(players).filter(
//   (player) => player.inGame === true
// );

// const defenderId = Object.keys(players).find((id) => {
//   return players[id].role === 'defender';
// });

const players = {
  'c0a64616-2c29-2268-9118-00fb26c2f737': {
    id: 1,
    inGame: true,
    hand: [],
    role: null,
    opponents: [],
    selectedCard: null,
    personalButton: null,
  },
  '3dd12114-67e5-10f9-d345-8312e507cea3': {
    id: 2,
    inGame: true,
    hand: [],
    role: null,
    opponents: [],
    selectedCard: null,
    personalButton: null,
  },
  'd86a5ddc-cbb6-f5ed-a32e-376139f6a4a2': {
    id: 3,
    inGame: true,
    hand: [],
    role: 'attacker',
    opponents: [],
    selectedCard: null,
    personalButton: null,
  },
  'c64e26b9-85bc-6ef4-44e4-6a0eeb4da854': {
    id: 4,
    inGame: false,
    hand: [],
    role: 'defender',
    opponents: [],
    selectedCard: null,
    personalButton: null,
  },
};

// const trumpSuit = 'H';
// for (var i = 6; i < 15; i++) {
//   for (const [player, value] of Object.entries(players)) {
//     const found = value.hand.findIndex((cur) => {
//       return cur.face === i && cur.suit === trumpSuit;
//     });
//     console.log(found);
//   }
// }

// let defenderLocation = Object.values(players).findIndex(
//   (cur) => cur.role === 'defender'
// );

// console.log('initial -- defenderLocation', defenderLocation);

// while (Object.values(players)[defenderLocation].inGame === false) {
//   if (defenderLocation === Object.values(players).length - 1) {
//     defenderLocation = 0;
//   } else {
//     defenderLocation += 1;
//   }
//   console.log('in while -- defenderLocation', defenderLocation);
// }

// console.log('post while -- defenderLocation', defenderLocation);

// Object.values(players)[defenderLocation].role = 'defender';

// const activePlayers = Object.values(players).filter(
//   (player) => player.inGame === true
// );

// console.log('active players', activePlayers);

// defenderLocation = activePlayers.findIndex((cur) => cur.role === 'defender');

// console.log('within active players -- defenderLocation', defenderLocation);

// for (let i = 0; i < activePlayers.length; i++) {
//   const currentPlayer =
//     activePlayers[(defenderLocation + i) % activePlayers.length];
// }
