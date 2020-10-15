import React from 'react';
import './PersonalButton.css';

class PersonalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hide: false,
    };

    this.pickUp = this.pickUp.bind(this);
    this.pass = this.pass.bind(this);
    // this.componentWillUpdate = this.componentWillUpdate.bind(this);
  }

  pickUp() {
    this.props.pickUp();
  }

  pass() {
    this.setState({ hide: true });
    this.props.pass();
  }

  componentDidUpdate(prevProps) {
    if (this.props.hand.length === 0 && prevProps.hand.length > 0) {
      this.pass();
    }

    if (this.props.cardsToBeBeat.length !== prevProps.cardsToBeBeat.length) {
      this.setState({ hide: false });
    }
  }

  render() {
    if (this.props.cardsToBeBeat.length > 0 && this.props.role === 'defender') {
      return (
        <>
        <div className='or'>or</div>
        <div className="personalButton" onClick={this.pickUp}>
          Pick Up
        </div>
        </>
      );
    } else if (
      this.props.cardsToBeBeat.length === 0 &&
      (this.props.role === 'attacker' || this.props.role === 'neutral') &&
      this.props.attackingCards.length > 0
    ) {
      return (
        <>
        {this.state.hide ? null : <div className='or'>or</div>}
        
        <div
          className={
            this.state.hide
              ? 'personalButton invisibleButton'
              : 'personalButton'
          }
          onClick={this.pass}
        >
          Pass
        </div>
        </>
      );
    } else {
      return <div className="personalButton invisibleButton"></div>;
    }
  }
}

export default PersonalButton;
