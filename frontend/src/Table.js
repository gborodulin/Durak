import React from 'react';
import './Table.css';
import Card from './Card';
import GameDeck from './GameDeck';

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.defendCardOnTable = this.defendCardOnTable.bind(this);
  }

  defendCardOnTable(face, suit) {
    const card = { face: face, suit: suit };
    this.props.defendCardOnTable(card);
  }

  render() {
    if (this.props.gameOver[0] === false) {
      return (
        <div className="table">
          <GameDeck
            gameDeck={this.props.gameDeck}
            trumpCard={this.props.trumpCard}
          />
          <div>
            {this.props.attackingCards.map((card, index) => {
              return (
                <Card
                  face={card.face}
                  suit={card.suit}
                  key={index}
                  defendCardOnTable={this.defendCardOnTable}
                />
              );
            })}
          </div>
          <div className="defenseCards">
            {this.props.defendingCards.map((card, index) => {
              return (
                <Card
                  face={card.face}
                  suit={card.suit}
                  key={index}
                  holdDefenseCards="holdDefenseCards"
                />
              );
            })}
          </div>
        </div>
      );
    } else if (this.props.gameOver[0] === true) {
      return (
        <div className="table">
          <p className="gameOverMessage">
            Game Over
            <br />
            Loser is {this.props.gameOver[1]}
          </p>
        </div>
      );
    } else {
      return <div className="table"></div>;
    }
  }
}

export default Table;
