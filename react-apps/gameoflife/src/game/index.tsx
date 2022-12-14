import React from 'react';
import './Game.css';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Game extends React.Component {
  state = {
    cells: [],
    isRunning: false,
    interval: 100,
  };

  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;

    this.board = this.makeEmptyBoard();
  }

  // Create an empty board
  makeEmptyBoard() {
    const board = [];

    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }

    return board;
  }

  // Create cells from this.board
  makeCells() {
    const cells = [];

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top + window.pageYOffset) - doc.clientTop,
    };
  }

  handleClick = (event) => {
    const elemOffset = this.getElementOffset();

    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    const xIsValid = (x >= 0 && x <= this.cols);
    const yIsValid = (y >= 0 && y <= this.rows);

    if (xIsValid && yIsValid) {
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({ cells: this.makeCells() });
  };

  runGame = () => {
    this.setState({ isRunning: true });
    this.runIteration();
  };

  stopGame = () => {
    this.setState({ isRunning: false });

    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  };

  runIteration() {
    const newBoard = this.makeEmptyBoard();

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else if (!this.board[y][x] && neighbors === 3) {
          newBoard[y][x] = true;
        }
      }
    }

    this.board = newBoard;
    this.setState({ cells: this.makeCells() });

    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.state.interval);
  }

  calculateNeighbors(board, x, y) {
    let neighbors = 0;

    const dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
    ];

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];

      const x1 = x + dir[1];
      const x1IsValid = (x1 >= 0 && x1 < this.cols);

      const y1 = y + dir[0];
      const y1IsValid = (y1 >= 0 && y1 < this.rows);

      if (x1IsValid && y1IsValid && board[y1][x1]) {
        neighbors++;
      }
    }

    return neighbors;
  }

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  };

  handleClear = () => {
    this.board = this.makeEmptyBoard();
    this.setState({ cells: this.makeCells() });
  };

  handleRandom = () => {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.board[y][x] = (Math.random() >= 0.5);
      }
    }

    this.setState({ cells: this.makeCells() });
  };

  render() {
    const { cells, interval, isRunning } = this.state;

    return (
      <div>
        <div
          className="Board"
          style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }}
          onClick={this.handleClick}
          ref={(n) => { this.boardRef = n; }}
        >
          {cells.map((cell) => {
            return (
              <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} />
            );
          })}
        </div>

        {/* <div className="controls">
                    Update every <input value={interval} onChange={this.handleIntervalChange} /> msec
                    {isRunning ?
                        <button className="button" onClick={this.stopGame}>Stop</button> :
                        <button className="button" onClick={this.runGame}>Run</button>
                    }
                    <button className="button" onClick={this.handleRandom}>Random</button>
                    <button className="button" onClick={this.handleClear}>Clear</button>
        </div> */}
      </div>
    );
  }
}

export default Game;
