import React from 'react';
import './App.css';
import Hand from './Hand.js';
import Table from './Table.js';
import Opponent from './Opponent';
import Animate from './Animate'


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
        name: 'Anonymous',
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

    this.inputField = React.createRef()
    this.componentDidMount = this.componentDidMount.bind(this);
    this.enterName = this.enterName.bind(this);

    this.moveSelectedCard = this.moveSelectedCard.bind(this)
    this.onClickReset = this.onClickReset.bind(this)

    this.selectCardFromHand = this.selectCardFromHand.bind(this)
    
  }

  componentDidMount() {
    Animate.openSignIn()

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.method === 'initialConnection') {
        playerId = data.playerId;
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


    this.inputField.current.focus()
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
      (e.key === 'Enter' || e.target.className === 'joinTable')
      && this.inputField.current.value !== '' 
      && this.inputField.current.value.length < 13
    ) {
      const allCaps = this.inputField.current.value.toUpperCase()

      ws.send(
        JSON.stringify({
          method: 'enterName',
          playerId: playerId,
          name: allCaps
        })
      );

      this.setState({
        nameEntered: true,
      });
    }
  }

  moveSelectedCard(e){
    
    if(this.state.playerInfo.selectedCard){
      const selectedCard = document.getElementById('selectedCard')

      selectedCard.style.pointerEvents = 'none'
      selectedCard.style.position='absolute'
      selectedCard.style.top=`${e.clientY-50}px`
      selectedCard.style.left=`${e.clientX-50}px`
      selectedCard.style.zIndex= 1000
    }

  }

  onClickReset(){
    if(this.state.playerInfo.selectedCard){
      const selectedCard = document.getElementById('selectedCard')

      selectedCard.style.pointerEvents = ''
      selectedCard.style.position=''
      selectedCard.style.top=''
      selectedCard.style.left=''
      selectedCard.style.zIndex= ''

      this.setState({ 
        playerInfo: {
        hand: this.state.playerInfo.hand,
        name: this.state.playerInfo.name,
        role: this.state.playerInfo.role,
        opponents: this.state.playerInfo.opponents,
        selectedCard: null,
      },})
    }



    
  }

  forfeit(){
    ws.send(
      JSON.stringify({
        method: 'forfeit',
        playerId: playerId,
      })
    );
  }

  

  render() {
    if (!this.state.notAllowed && this.state.nameEntered) {
      return (
        <div className="App" onMouseMove={this.moveSelectedCard} onClick={this.onClickReset}>


        {this.state.tableInfo.gameOver[0] === false && this.state.playerInfo.hand.length > 0 ? 
         <div className='newGame' onClick={this.forfeit}>
            <div className='newGameText'>
              Forfeit
            </div> 
          </div>
          :
          <div
            className={
              (this.state.playerInfo.opponents.length === 0) || (this.state.tableInfo.gameOver[0] === false && this.state.playerInfo.hand.length === 0) 
                ? 'newGameInvisible'
                : 'newGame'
            }
            onClick={this.startNewGame}
          >
            <div className='newGameText'>
            Start New Game
            </div>
          </div>
        }

          <Table
            attackingCards={this.state.tableInfo.attackingCards}
            defendingCards={this.state.tableInfo.defendingCards}
            trumpCard={this.state.tableInfo.trumpCard}
            gameDeck={this.state.tableInfo.gameDeck}
            gameOver={this.state.tableInfo.gameOver}
            role={this.state.playerInfo.role}
            defendCardOnTable={this.defendCardOnTable}
            opponents={this.state.playerInfo.opponents}
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
          {this.state.playerInfo.opponents.length === 1 ? <Opponent
            opponent={this.state.playerInfo.opponents[0]}
            opponent1="opponent1"
          />: <>
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
        </>}
        </div>
      );
    } else if (!this.state.notAllowed && !this.state.nameEntered) {
      
      return (
        <div className="App App-alternate" onKeyDown={this.enterName}>
          <h1 className="durak">Durak</h1>
          <h3>RussiaN Card GamE</h3>
          
          <div className="enterName">
            <div>Enter Your Name:<br/> <div className='charAmount'>(12 characters max)</div></div>
            <input type="text" ref={this.inputField} ></input>
          </div>
          <div className='joinTable' onClick={this.enterName}>Join Table</div>
        </div>
      );
    } else {
      return <div className="App"><div className='tableIsFull'>Table is full <br/> try again later</div></div>;
    }
  }
}

export default App;
