# Durak

This is a recreation of a classic Russian card game that is currently deployed on Google Cloud to play with up to 4 players.

### Visit the demo here:

[http://34.86.64.212:3000/](http://34.86.64.212:3000/)

## Rules:

### Needed

Two to four players; 36 card deck (aces down to 6s)

### Card Rank

Highest to lowest - A, K, Q, J, 10, 9, 8, 7, 6

### Deal

Six cards to each player, one card at a time. The next top card is flipped up, and the remaining deck is placed on top of it. The suit of the card flipped up is the trump suit for the round.

### Objective

The object of the game is to avoid being the last player with cards.

### Game Play

During game play, there are attackers and a defender. The defender is successful when he/she is able to beat all attacks made and is unsuccessful if he/she is unable or unwilling to beat an attack. The first attacker is the player with the lowest trump card. The first defender is the player left of the first attacker.

An attack consists of a player playing a card into the middle. A defense is made by beating the card played. An attack card can be beaten by a higher ranking card in the same suit, or any trump card if the attack card is a non-trump suited card.

If an attack is successfully defended, another attack can be made, but the new attack card must be the same rank as a previously played card (i.e., the same rank as the first attack card or the defending card). After the original attacker is done attacking, the player left of the defender can make an attack if possible.

The opportunity to make attacks continues clockwise (if playing with more than four players, only the player right and left of the defender can attack).

An attack has a maximum of six attacking cards. If the defender begins with less than six cards, the maximum number of attacking cards is equal to the number of cards the defender has at the start of the attack. An attack may end before six attacking cards are played if the attackers cannot or choose not to attack further.

If a defender successfully defends all attacks, he/she becomes the new attacker. When a defender wins, the cards from the middle are discarded. If a defender cannot defend an attack, he/she must add all the cards from the middle to his/her hand and loses his/her turn to attack.

Before the next attack begins, any player under six cards will draw from the remaining deck to get back to six cards. Once the remaining deck runs out, no card draw occurs after an attack.

A defender can choose not to play on an attacking card even if the defender is able to beat the card played. The defender would take the cards from the middle and loses his/her turn to attack. But, before the defender takes the cards, other players can add possible attacking cards. For example, a player could add a 6 to the middle if a 6 is already in the middle.

### Losing

The last player still with cards is the loser and deals the next game.

### Rules

After an attack, players will draw cards to return their hands to at least six cards. The original attacker draws first, then other attackers moving clockwise, and lastly, the defender if needed.

The last draw card is the flipped up trump card. Once this card is drawn, the race to get rid of cards begins. The last player still with cards is the loser.

A player does not have to attack, even if possible. A defender does not have to defend, even if possible.
