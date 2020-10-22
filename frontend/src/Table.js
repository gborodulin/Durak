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
          <div className='attackingCards'>
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
          <img id='loserHat' src={require('./icons/jester.svg')}/>
          <p className="gameOverMessage">
            {this.props.gameOver[1]}
            <br />
             Loses
          </p>
        </div>
      );
    }else if(this.props.opponents.length === 0 ){
      return(
      <div className="table">
          <p className="gameOverMessage">
            Please wait for other players to connect
            <br />
            <br/>
            (or open a new tab to play locally)
          </p>
        </div>
      );
    } else {
      return <div className="table"></div>;
    }
  }
}

export default Table;
