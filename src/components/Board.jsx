import React from 'react';
import { memo } from "react";

import Square from './Square';


class Board extends React.Component {
    handleClick = (i,j) => {this.props.onClick(i, j);console.log('11')}
    renderSquare(i, j) {
      //console.log(i,j,this.props.squares[i][j])
      return (
        <Square
          key={i * 10 + j}
          value={[this.props.squares[i][j], i, j]}
          onClick={this.handleClick.bind(this,i,j)}
        />
      );
    }

    // shouldComponentUpdate(nextProps) {
    //     // Rendering the component only if 
    //     // passed props value is changed
      
    //     return false;
    //   }
  
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

//   Board = memo(Board)
export default Board;  

// export default MemoBoard;  