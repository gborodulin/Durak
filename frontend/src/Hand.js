import React from 'react';
import './Hand.css';
import Card from './Card.js';
import PersonalButton from './PersonalButton.js';
import PersonalMessage from './PersonalMessage.js';
import Animate from './Animate'


class Hand extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orgHand: [],
      targetId: ''
    };

    this.selectCardFromHand = this.selectCardFromHand.bind(this);
    this.pickUp = this.pickUp.bind(this);
    this.pass = this.pass.bind(this);
  }

  selectCardFromHand(face, suit) {

    const card = { face: face, suit: suit };
    this.props.selectCardFromHand(card);
  }

  pickUp() {
    this.props.pickUp();
  }

  pass() {
    this.props.pass();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.hand !== this.props.hand) {
      const trumps = this.props.hand.filter(
        (card) => card.suit === this.props.trumpCard.suit
      );
      trumps.sort((a, b) => {
        return a.face - b.face;
      });

      const nonTrumps = this.props.hand.filter(
        (card) => card.suit !== this.props.trumpCard.suit
      );

      nonTrumps.sort((a, b) => {
        return a.face - b.face;
      });

      this.setState({ orgHand: nonTrumps.concat(trumps) });
    }
  }

  render() {
    return (
      <div className="hand">
        <PersonalMessage role={this.props.role} />
        <PersonalButton
          cardsToBeBeat={this.props.cardsToBeBeat}
          attackingCards={this.props.attackingCards}
          role={this.props.role}
          hand={this.props.hand}
          pickUp={this.pickUp}
          pass={this.pass}
        />

        <div className="cardsInHand">
          {this.state.orgHand.map((card, index) => {
            return (
              <Card
                face={card.face}
                suit={card.suit}
                key={index}
                cardNum={index}
                inHand="inHand"
                selectedCard={this.props.selectedCard}
                selectCardFromHand={this.selectCardFromHand}
                
              />
            );
          })}
        </div>
        
      </div>
    );
  }
}

export default Hand;
