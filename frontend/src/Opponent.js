import React from 'react';
import './Opponent.css';
import Card from './Card';

class Opponent extends React.Component {
  constructor(props) {
    super(props);

    this.createOpponentInfo = this.createOpponentInfo.bind(this);
  }

  createOpponentInfo(opponent) {
    const oppHand = [];

    for (var i = 0; i < opponent.handLength; i++) {
      oppHand.push({});
    }

    let oppName = null;

    if (opponent.role === 'attacker' || opponent.role === 'neutral') {
      oppName = <h3 className="oppName red">{opponent.name}</h3>;
    } else if (opponent.role === 'defender') {
      oppName = <h3 className="oppName blue">{opponent.name}</h3>;
    } else {
      oppName = <h3 className="oppName">{opponent.name}</h3>;
    }

    return (
      <div>
        {oppName}
        <div className="oppHand">
          {oppHand.map((card, index) => {
            return <Card opponent={card} key={index} />;
          })}
        </div>
      </div>
    );
  }

  render() {
    if (this.props.opponent && this.props.opponent0) {
      return (
        <div className="opp opponent0">
          {this.createOpponentInfo(this.props.opponent)}
        </div>
      );
    } else if (this.props.opponent && this.props.opponent1) {
      return (
        <div className="opp opponent1">
          {this.createOpponentInfo(this.props.opponent)}
        </div>
      );
    } else if (this.props.opponent && this.props.opponent2) {
      return (
        <div className="opp opponent2">
          {this.createOpponentInfo(this.props.opponent)}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Opponent;
