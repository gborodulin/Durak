import React from 'react';
import './Trump.css';
import Card from './Card.js';

class Trump extends React.Component {
  makeTrumpPretty(suit) {
    let newSuit, newColor;

    if (suit === 'S') {
      newSuit = '♠';
      newColor = 'Black';
    } else if (suit === 'C') {
      newSuit = '♣';
      newColor = 'Black';
    } else if (suit === 'D') {
      newSuit = '♦';
      newColor = 'Red';
    } else if (suit === 'H') {
      newSuit = '♥';
      newColor = 'Red';
    }

    return (
      <p className="trumpSymbol" style={{ color: newColor }}>
        {newSuit}
      </p>
    );
  }

  render() {
    if (!this.props.noCardsLeft) {
      return (
        <div className="trumpCard">
          <Card
            face={this.props.trumpCard.face}
            suit={this.props.trumpCard.suit}
            trump="trump"
          />
          {/* {this.makeTrumpPretty(this.props.trump)} */}
        </div>
      );
    } else {
      return (
        <div className="trumpCard">
          {this.makeTrumpPretty(this.props.trumpCard.suit)}
        </div>
      );
    }
  }
}

export default Trump;
