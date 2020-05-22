import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Card extends React.Component {
  render() {
    return (
      <div className="card-container">
        <div className="card"></div>
      </div>
    );
  }
}

class Board extends React.Component {
  render () {
    let numCards = this.props.rows * this.props.cols;
    let board = [];
    for (let y = 0; y < this.props.rows; y++) {
      let row = []
      for (let x = 0; x < this.props.cols; x++) {
        row.push(<Card key={x}/>);
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
  render() {
    let status = "Match cards to win!"
    return (<div className="game">
      {/* <h1>Memory</h1> */}
      <div className="board">
        <Board
          rows={3}
          cols={6}
        />
      </div>
      <div className="status">
        {status}
        <br/>
        <button className="reset">Reset</button>
      </div>
    </div>);
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
