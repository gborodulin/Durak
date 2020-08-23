import React from 'react';
import './PersonalMessage.css';

class PersonalMessage extends React.Component {
  render() {
    if (this.props.role === 'attacker' || this.props.role === 'neutral')
      return <p className="personalMessage attack">Attack!</p>;
    else if (this.props.role === 'defender')
      return <p className="personalMessage defend">Defend!</p>;
    else return <p className="personalMessage"></p>;
  }
}

export default PersonalMessage;
