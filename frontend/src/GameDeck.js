import React from 'react';
import './GameDeck.css';
import Card from './Card.js';
import Trump from './Trump.js';

class GameDeck extends React.Component {
  constructor(props) {
    super(props);

    this.createBackOfDeck = this.createBackOfDeck.bind(this);
  }

  createBackOfDeck(gameDeckLength) {
    const deck = [];

    for (var i = 0; i < gameDeckLength; i++) {
      deck.push({});
    }

    return (
      <div className="backOfDeck">
        {this.props.gameDeck.map((card, index) => {
          return <Card opponent={card} key={index} />;
        })}
      </div>
    );
  }

  render() {
    if (this.props.gameDeck.length > 1) {
      return (
        <div className="gameDeck">
          <p className="cardsLeft">{this.props.gameDeck.length}</p>
          <Trump trumpCard={this.props.trumpCard} />
          {this.createBackOfDeck(this.props.gameDeck.length)}
        </div>
      );
    } else if (this.props.gameDeck.length === 1) {
      return (
        <div className="gameDeck">
          <p className="cardsLeft">{this.props.gameDeck.length}</p>
          <Trump trumpCard={this.props.trumpCard} />
        </div>
      );
    } else if (this.props.gameDeck.length === 0) {
      return (
        <div className="gameDeck">
          <p className="cardsLeft">{this.props.gameDeck.length}</p>
          <Trump trumpCard={this.props.trumpCard} noCardsLeft="noCardsLeft" />
        </div>
      );
    }
  }
}

export default GameDeck;
