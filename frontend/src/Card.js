import React from 'react';
import './Card.css';

class Card extends React.Component {
  constructor(props) {
    super(props);

    this.sendCard = this.sendCard.bind(this);
    this.render = this.render.bind(this);
  }

  sendCard(e) {
    if (this.props.selectCardFromHand) {   
      this.props.selectCardFromHand(this.props.face, this.props.suit);
    }
    if (this.props.defendCardOnTable) {
      this.props.defendCardOnTable(this.props.face, this.props.suit);
    }

  }

  makeCardPretty(face, suit) {
    let newFace, newSuit, newColor;

    if (face <= 10) newFace = face;
    else if (face === 11) newFace = 'J';
    else if (face === 12) newFace = 'Q';
    else if (face === 13) newFace = 'K';
    else if (face === 14) newFace = 'A';

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
      <div>
        <h3 className="face" style={{ color: [newColor] }}>
          {newFace}
        </h3>
        <h3 className="suit" style={{ color: [newColor] }}>
          {newSuit}
        </h3>
      </div>
    );
  }

  //you can now receive selectedCard here
  render() {
    //Table/DefenseCards/Not Blank
    if (this.props.opponent) {
      return (
        <div className="backOfCard">
          <img src={require('./icons/jester.svg')} alt="" />
        </div>
      );
      //trump card
    } else if (this.props.trump) {
      return (
        <div className="card trump" onClick={this.sendCard}>
          <div className="trumpTextHolder">
            {this.makeCardPretty(this.props.face, this.props.suit)}
          </div>
        </div>
      );
    } else if (this.props.holdDefenseCards && this.props.face) {
      return (
        <div className="card" onClick={this.sendCard}>
          {this.makeCardPretty(this.props.face, this.props.suit)}
        </div>
      );
      //Table/DefenseCards/Blank
    } else if (this.props.holdDefenseCards && !this.props.face) {
      return (
        <div className="card invisibleCard" onClick={this.sendCard}>
          {this.makeCardPretty(this.props.face, this.props.suit)}
        </div>
      );
    } else if (
      this.props.selectedCard &&
      this.props.selectedCard.face === this.props.face &&
      this.props.selectedCard.suit === this.props.suit
    ) {
      return (
        <div className="card" id="selectedCard" onClick={this.sendCard} >
          {this.makeCardPretty(this.props.face, this.props.suit)}
        </div>
      );
    } else if (this.props.inHand) {
      return (
        <div className="card inHand" onClick={this.sendCard}>
          {this.makeCardPretty(this.props.face, this.props.suit)}
        </div>
      );
    } else {
      return (
        <div className="card" onClick={this.sendCard}>
          {this.makeCardPretty(this.props.face, this.props.suit)}
        </div>
      );
    }
  }
}

export default Card;
