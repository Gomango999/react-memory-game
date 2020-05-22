import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import CardBack from "./cards/card_back_red.png"
import JD from "./cards/JD.png"
import JC from "./cards/JC.png"
import JH from "./cards/JH.png"
import QS from "./cards/QS.png"
import QD from "./cards/QD.png"
import QC from "./cards/QC.png"
import KH from "./cards/KH.png"
import KS from "./cards/KS.png"
import KD from "./cards/KD.png"
import AS from "./cards/AS.png"
const cardImages = [JD, JC, JH, QS, QD, QC, KH, KS, KD, AS];

class Card extends React.Component {
  render() {
    let className = "card";
    let style = {};
    if (this.props.matched){
      className += " matched";
      style = {
        backgroundImage: `url(${cardImages[this.props.value]})`,
        filter: "brightness(50%)",
        transform: `rotate(${this.props.rotation}deg)`,
      }

    } else {
      className += " unmatched";
      style = {backgroundImage: `url(${CardBack})`}
      if (this.props.selected) {
        className += " selected";
        style = {backgroundImage: `url(${cardImages[this.props.value]})`}
      }
    }

    return (
      <div className="card-container" >
        <div className={className} style={style} onClick={() => {this.props.onClick()}}>
        </div>
      </div>
    );
  }
}

class Board extends React.Component {
  isSelected(y, x, select1, select2) {
    let selected = false;
    if (select1 && y === select1.y && x === select1.x) {
      selected = true;
    }
    if (select2 && y === select2.y && x === select2.x) {
      selected = true;
    }
    return selected;
  }

  render () {
    let board = [];
    let select1 = this.props.select1;
    let select2 = this.props.select2;
    for (let y = 0; y < this.props.rows; y++) {
      let row = []
      for (let x = 0; x < this.props.cols; x++) {
        row.push(
          <Card
            value={this.props.cards[y][x].value}
            selected={this.isSelected(y,x,select1,select2)}
            matched={this.props.cards[y][x].matched}
            rotation={this.props.cards[y][x].rotation}
            onClick={() => {this.props.onClick(y,x)}}
            key={x}
          />
        );
      }
      board.push(
        <div className="board-row" key={y}>
          {row}
        </div>
      );
    }
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    let cards = this.shuffleBoard();
    this.state = {
      cards: cards,
      select1: null,
      select2: null,
      moves: 0,
    }
    this.selectTimer = null;
  }

  resetGame() {
    let cards = this.shuffleBoard();
    this.setState({
      cards: cards,
      select1: null,
      select2: null,
      moves: 0,
    });
    clearInterval(this.selectTimer);
  }

  shuffleBoard() {
    let rows = this.props.rows;
    let cols = this.props.cols;
    let numCards = rows * cols;
    let values = []
    for (let i = 0; i < numCards; i++) {
      values.push((i/2)|0)
    }
    shuffle(values);
    let i = 0;
    let cards = new Array(rows);
    for (let y = 0; y < rows; y++) {
      cards[y] = new Array(cols);
      for (let x = 0; x < cols; x++) {
        cards[y][x] = {
          value: values[i],
          matched: false,
          rotation: Math.random()*8-4,
        }
        i++;
      }
    }
    return cards;
  }

  clearSelection() {
    let select1 = this.state.select1;
    let select2 = this.state.select2;
    select1 = null;
    select2 = null;
    this.setState({
      select1: select1,
      select2: select2,
    });
  }

  handleClick(y, x) {
    let cards = this.state.cards;
    let select1 = this.state.select1;
    let select2 = this.state.select2;
    let moves = this.state.moves;

    if (cards[y][x].matched) return;

    if (!select1 || select2) {
      // Making first selection, or reselecting
      clearInterval(this.selectTimer);
      select1 = {y:y, x:x};
      select2 = null;
    } else if (select1 && !select2) {
      if (y === select1.y && x === select1.x) {
        // Unselected first selection
        select1 = null;
        select2 = null;
      } else {
        // Making new second selection
        select2 = {y:y, x:x};
        moves++;
        if (cards[select1.y][select1.x].value
        === cards[select2.y][select2.x].value
        ) {
          // Matched
          cards[select1.y][select1.x].matched = true;
          cards[select2.y][select2.x].matched = true;
          select1 = null;
          select2 = null;
        } else {
          // No match
          this.selectTimer = setInterval(() => {this.clearSelection()}, 1000);
        }
      }
    }
    this.setState({
      cards: cards,
      select1: select1,
      select2: select2,
      moves: moves,
    });
  }

  hasWon() {
    let unmatched = false;
    for (let y = 0; y < this.props.rows && !unmatched; y++) {
      for (let x = 0; x < this.props.cols && !unmatched; x++) {
        if (!this.state.cards[y][x].matched) {
          unmatched = true;
        }
      }
    }
    return !unmatched;
  }

  render() {
    let status = "";
    if (this.hasWon()) {
      status = `You won in ${this.state.moves} moves!`;
    } else {
      if (this.state.moves === 0) {
        status = "Match pairs of cards to win!";
      } else {
        status = `Moves: ${this.state.moves}`
      }
    }

    return (<div className="game">
      {/* <h1>Memory</h1> */}
      <div className="board">
        <Board
          rows={this.props.rows}
          cols={this.props.cols}
          cards={this.state.cards}
          select1={this.state.select1}
          select2={this.state.select2}
          onClick={(y,x) => {this.handleClick(y,x)}}
        />
      </div>
      <div className="status">
        {status}
        <br/>
      </div>
      <div className="reset-container">
        <button className="reset" onClick={()=>{this.resetGame();}}>
          <div className="reset-text">
            Reset
          </div>
        </button>
      </div>
    </div>);
  }
}

ReactDOM.render(
  <Game
    rows={3}
    cols={6}
  />,
  document.getElementById('root')
);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
