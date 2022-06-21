import React from 'react';

import Square from './Square';


class Board extends React.Component {
    renderSquare(i, j) {
      //console.log(i,j,this.props.squares[i][j])
      return (
        <Square
          key={i * 10 + j}
          value={[this.props.squares[i][j], i, j]}
          onClick={() => this.props.onClick(i, j)}
        />
      );
    }
  
    render() {
      //console.log("hello", this.props.squares);
      const arr = this.props.squares;
      const brr = arr.map((i, j) => {
        if (j != 8) {
          const crr = i.map((i1, j1) => {
            return this.renderSquare(j, j1);
          });
          return (
            <div key={j} className="board-row">
              {crr}
            </div>
          );
        }
      });
  
      return <div id="sadsad">{brr}</div>;
    }
  }
export default Board;  