import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Overlay(props) {
  if (props.overlay){
    return (
      <div>
        <div className="overlay"></div>
        <div className="text">{props.overlay}</div>
      </div>
    );
  } else {
    return null;
  }
}

class Board extends React.Component {
  renderSquare(i,j) {
    return (
      <Square
        value={this.props.squares[j]}
        onClick={() => this.props.onClick(i,j)}
      />
    );
  }

  renderOverlay() {
    return (
      <Overlay
        overlay={this.props.overlay}
      />
    );
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.renderOverlay()}
        <div className="board-row">
	        {this.renderSquare(this.props.boardID, 0)}
          {this.renderSquare(this.props.boardID, 1)}
          {this.renderSquare(this.props.boardID, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.boardID, 3)}
          {this.renderSquare(this.props.boardID, 4)}
          {this.renderSquare(this.props.boardID, 5)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.boardID, 6)}
          {this.renderSquare(this.props.boardID, 7)}
          {this.renderSquare(this.props.boardID, 8)}
        </div>
      </div>
    );
  }
}

class SuperBoard extends React.Component{
  renderBoard(i) {
    var className = "board";
    className = this.props.lastPlayed === i ? className + " selected" : className;
    return (
      <Board
        className = {className}
        boardID = {i}
        squares={this.props.boards[i]}
        onClick={this.props.onClick}
        overlay = {this.props.wonBoards[i]}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="super-board-row">
	        {this.renderBoard(0)}
          {this.renderBoard(1)}
          {this.renderBoard(2)}
        </div>
        <div className="super-board-row">
          {this.renderBoard(3)}
          {this.renderBoard(4)}
          {this.renderBoard(5)}
        </div>
        <div className="super-board-row">
          {this.renderBoard(6)}
          {this.renderBoard(7)}
          {this.renderBoard(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          boards: initBoards(),
          wonBoards: Array(9).fill(null),
          lastPlayed: -1
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const boards = current.boards.map(arr => arr.slice());
    const lastPlayed = current.lastPlayed;

    const rightBoard = (i !== lastPlayed && lastPlayed !== -1);
    if (boards[i][j] || rightBoard || current.wonBoards[i] || boardWin(current.wonBoards)) {
      return;
    }

    boards[i][j] = this.state.xIsNext ? "X" : "O";
    
    const updatedWonBoards = updateWonBoards(boards);
    const updatedLastPlayed = updatedWonBoards[j] ? -1 : j;

    this.setState({
      history: history.concat([
        {
          boards: boards,
          wonBoards: updatedWonBoards,
          lastPlayed: updatedLastPlayed
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = boardWin(current.wonBoards);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <SuperBoard
            boards={current.boards}
            onClick={(i,j) => this.handleClick(i,j)}
            wonBoards={current.wonBoards}
            lastPlayed={current.lastPlayed}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function updateWonBoards(boards){
  var wonBoards = new Array(9);
  for (var i = 0; i < 9; i++){
    wonBoards[i] = boardWin(boards[[i]]);
  }
  return wonBoards;
}

function boardWin(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  //" " is used to indicate a draw
  if (board.some(i => i === null)){
    return null;
  } else {
    return " ";
  }

}

function initBoards() {
  var boards = new Array(9);

  for(var i = 0; i < boards.length ;i++){
    boards[i] = new Array(9);
    boards[i].fill(null);
  }

  return boards;
} 