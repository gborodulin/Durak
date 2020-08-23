import React from 'react';
import './App.css';
import Hand from './Hand.js';
import Table from './Table.js';
import Opponent from './Opponent';

const ws = new WebSocket('ws://localHost:8080');
let playerId = 0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notAllowed: null,
      nameEntered: false,

      playerInfo: {
        hand: [],
        name: 'Default',
        role: null,
        opponents: [],
        selectedCard: null,
      },

      tableInfo: {
        gameDeck: [],
        cardsToBeBeat: [],
        cardsOnTable: [],
        attackingCards: [],
        defendingCards: [],
        trumpCard: {},
        gameOver: [null, ''],
      },
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.enterName = this.enterName.bind(this);
  }

  componentDidMount() {
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.method === 'initialConnection') {
        playerId = data.playerId;
        console.log(`my player id is ${playerId}`);
      } else if (data.method === 'fullUpdate') {
        this.setState({
          playerInfo: data.playerInfo,
          tableInfo: data.table,
        });
      } else if (data.method === 'personalResponse') {
        this.setState({ personalMessage: data.message });
      } else if (data.method === 'rejection') {
        this.setState({ notAllowed: true });
      }
    };
  }

  //FUNCTIONS
  startNewGame() {
    ws.send(JSON.stringify({ method: 'startNewGame' }));
  }

  selectCardFromHand(card) {
    ws.send(
      JSON.stringify({
        method: 'selectCardFromHand',
        playerId: playerId,
        card: card,
      })
    );
  }

  defendCardOnTable(card) {
    ws.send(
      JSON.stringify({
        method: 'defendCardOnTable',
        playerId: playerId,
        card: card,
      })
    );
  }

  pickUp() {
    ws.send(
      JSON.stringify({
        method: 'pickUp',
        playerId: playerId,
      })
    );
  }

  pass() {
    ws.send(
      JSON.stringify({
        method: 'pass',
        playerId: playerId,
      })
    );
  }

  enterName(e) {
    if (
      e.key === 'Enter' &&
      e.target.value !== '' &&
      e.target.value.length < 9
    ) {
      ws.send(
        JSON.stringify({
          method: 'enterName',
          playerId: playerId,
          name: e.target.value,
        })
      );

      this.setState({
        nameEntered: true,
      });
    }
  }

  render() {
    if (!this.state.notAllowed && this.state.nameEntered) {
      return (
        <div className="App">
          <button
            className={
              this.state.playerInfo.opponents.length === 0
                ? 'newGameInvisible'
                : 'newGame'
            }
            onClick={this.startNewGame}
          >
            Start New Game
          </button>
          <Table
            attackingCards={this.state.tableInfo.attackingCards}
            defendingCards={this.state.tableInfo.defendingCards}
            trumpCard={this.state.tableInfo.trumpCard}
            gameDeck={this.state.tableInfo.gameDeck}
            gameOver={this.state.tableInfo.gameOver}
            role={this.state.playerInfo.role}
            defendCardOnTable={this.defendCardOnTable}
          />
          <Hand
            hand={this.state.playerInfo.hand}
            role={this.state.playerInfo.role}
            tableInfo={this.state.tableInfo}
            selectedCard={this.state.playerInfo.selectedCard}
            cardsToBeBeat={this.state.tableInfo.cardsToBeBeat}
            attackingCards={this.state.tableInfo.attackingCards}
            trumpCard={this.state.tableInfo.trumpCard}
            selectCardFromHand={this.selectCardFromHand}
            pickUp={this.pickUp}
            pass={this.pass}
          />
          <Opponent
            opponent={this.state.playerInfo.opponents[0]}
            opponent0="opponent0"
          />
          <Opponent
            opponent={this.state.playerInfo.opponents[1]}
            opponent1="opponent1"
          />
          <Opponent
            opponent={this.state.playerInfo.opponents[2]}
            opponent2="opponent2"
          />
        </div>
      );
    } else if (!this.state.notAllowed && !this.state.nameEntered) {
      return (
        <div className="App">
          <h1 className="durak">Durak</h1>
          <div className="logo">
            <img src={require('./jesterHat.jpg')} alt="" />
          </div>
          <div className="enterName">
            <p>Enter Your Name:</p>
            <input type="text" onKeyDown={this.enterName}></input>
          </div>
        </div>
      );
    } else {
      return <div className="App">Table is full, try again later</div>;
    }
  }
}

export default App;
