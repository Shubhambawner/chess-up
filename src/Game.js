import ReactDOM from 'react-dom';
import React from 'react';
import { createRoot } from 'react-dom/client';
  

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
    autoClose: 3000,
    draggable: false,
    pauseOnHover: false,
    closeButton: false,
    progressBar: false,
    newestOnTop: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnVisibilityChange: false,
    position: toast.POSITION.TOP_CENTER
    });

import Board from './components/Board';
//controlled components


//controlling component
class Game extends React.Component {
  constructor(props) {
    super(props);
    // let a0 = [null, null, null, null, null, null, null, null];
    // let a1 = [null, null, null, null, null, null, null, null];
    // let a2 = [null, null, null, null, null, null, null, null];
    // let a3 = [null, null, null, null, null, null, null, null];
    // let a4 = [null, null, null, null, null, null, null, null];
    // let a5 = [null, null, null, null, null, null, null, null];
    // let a6 = [null, null, null, null, null, null, null, null];
    // let a7 = [null, null, null, null, null, null, null, null];
    // let hrr = [a0, a1, a2, a3, a4, a5, a6, a7];
    //console.log('hrr',hrr)
    let hrr = new Array(8).fill(null).map(x=>Array(8).fill(null))
    hrr.push({ turn: "0", stateNumber: 0, underCheck: null,lastPieceMoved: null });
    //creating the multi dimentional array,
    //this:
    //wont work, as fill just asigns references, so array of nulls is actually created only once.
    //console.log('hrr',hrr)
    let erra = chessStart(hrr);
    let loc = localStorage.getItem("chess");
    if (loc) {
      this.state = JSON.parse(loc);
      //console.log('state',this.state)
    } else {
      //console.log('state no localstorage')
      this.state = {
        H: [{ squares: erra }],
        current: 0, //this is a serial number of the state
        previous: -1//state of game for n pas n, the previous 
      };
    }

  }

  #xo = "X";
  #status = "Next player: X";
  #winner = false;
  #rep = "";
  #piece = null;
  #range = [];

  handleClick(i, j) {
    let squares = superSlice(this.state.H[this.state.current].squares);
    let abr = false;
    let previousSQ = null;
    if (this.state.current > 0) {
      previousSQ = superSlice(this.state.H[this.state.current - 1].squares);
      console.log(previousSQ, 'passing inn', squares)

    }

    if (
      squares[i][j] &&
      !this.#winner &&
      squares[i][j][0] === squares[8].turn &&
      this.#range.indexOf(i + "" + j) == -1
    ) {
      //console.log('rrr')
      unmark(this.#range);
      this.#piece = null;
      this.#range = [];

      this.#piece = i + "" + j;
      this.#range = getRange(i, j, squares[i][j][1], squares, previousSQ); //return array of co-ordinates that are under attack by piece at i,j
      mark(this.#range, squares); // marks green/red all squares under attack, get element by id, and update class list
    } else if (
      //squares[i][j][0] === squares[8].turn &&
      this.#piece != null &&
      this.#range.length != 0 &&
      this.#range.indexOf(i + "" + j) != -1
    ) {
      //console.log(i);
      let vrr = this.state.H;

      squares = movePieceTo(i, j, squares, this.#piece[0], this.#piece[1]); // update array squares to bring piece from this.#piece to i,j, also killing any piece if there on i,j
      squares[8].stateNumber++;
      let oponentKing = squares[8].turn == 0 ? "1K" : "0K";
      let king = squares[8].turn == 0 ? "0K" : "1K";

      //console.log(isUnderCheck(king, i, j, squares))
      if (isUnderCheck(king, i, j, squares)) {
        //alert("the piece is pin! "); handled in getRange!!!
      } else {
        if (squares[8].turn != "0") squares[8].turn = "0";
        else squares[8].turn = "1";

        squares[8].underCheck = isUnderCheck(oponentKing, i, j, squares);


        if (squares[8].underCheck) {
          let k = null;
          for (let m in squares) {
            for (let n in squares[m]) {
              if (squares[m][n] == oponentKing) {
                k = m + "" + n
              }
            }
          }

          for (let m in squares) {
            if (!Array.isArray(squares[m])) continue
            for (let n in squares[m]) {
              if (squares[m][n] && squares[m][n][0] == oponentKing[0]) {
                let rt = getRange(m, n, squares[m][n][1], squares);
                if (rt.length > 0) {
                  abr = true
                  break;
                }
              }
            }
          }


        }
        squares[8].lastPieceMoved = squares[i][j]
        vrr.push({ squares: squares });
        let state3 = { H: vrr, current: this.state.current + 1, previous: this.state.previous + 1 };
        //console.log(this.state.previous + 1, 'settng as previous')
        localStorage.setItem('chess', JSON.stringify(state3));//localstorage integration
        this.setState(state3);
        console.log(state3,'******************************')


        unmark(this.#range);
        this.#piece = null;
        this.#range = [];
      }
      if (!abr && squares[8].underCheck) {
        abr = true
      } else {
        abr = false
      }

      let fg = document.getElementById("current");
      if (fg) {
        fg.scrollIntoView({ behavior: "smooth" });
        //console.log(fg,'scrolling....')
      } else {
        //console.log(fg,'scrolling....')/** $$ here we see, setstate itself re-renders the element!!!!!! */
      }
    }
    if (abr) {
      let kking = squares[8].turn == 1 ? "Black" : "White"
      let winner = (kking == "0K") ? "White" : "Black"
      toast("game over, winner is " + winner)
    }
  }

  Reset() {
    // let a0 = [null, null, null, null, null, null, null, null];
    // let a1 = [null, null, null, null, null, null, null, null];
    // let a2 = [null, null, null, null, null, null, null, null];
    // let a3 = [null, null, null, null, null, null, null, null];
    // let a4 = [null, null, null, null, null, null, null, null];
    // let a5 = [null, null, null, null, null, null, null, null];
    // let a6 = [null, null, null, null, null, null, null, null];
    // let a7 = [null, null, null, null, null, null, null, null];
    // let hrr = [a0, a1, a2, a3, a4, a5, a6, a7];
    let hrr = new Array(8).fill(null).map(x=>Array(8).fill(null))
    hrr.push({ turn: "0", stateNumber: 0, underCheck: null, lastPieceMoved: null });
    let state = {
      H: [{ squares: chessStart(hrr) }],
      current: 0,
      previous: -1
    }
    localStorage.setItem('chess', JSON.stringify(state));//localstorage integration
    this.setState(state);

    this.#xo = "X";
    this.#status = "Next player: X";
    this.#rep = "";
    this.#winner = false;
    this.#piece = null;
    this.range = [];
  }

  jumpTo(i) {
    //console.log(i,i%2)

    const squares = superSlice(this.state.H[i].squares);
    if (!deepEqual(this.state.H[this.state.current].squares, squares)) {
      this.#rep += "re. ";
      if (i % 2 != 0) {
        this.#xo = "O";
        this.#status = "Next player: O";
      } else {
        this.#xo = "X";
        this.#status = "Next player: X";
      }
      //console.log(this.state.H[this.state.current].squares == squares);
      this.#winner = Wi(squares);
      let H2 = superSlice(this.state.H);
      H2.push({ squares: squares });
      let state2 = { H: H2, current: this.state.current + 1, previous: i - 1 };
      //console.log(i - 1, "this is the previous state no.")
      localStorage.setItem('chess', JSON.stringify(state2));//localstorage integration
      this.setState(state2);
    } else {
      //console.log(this.state.H[this.state.current].squares, squares);
      toast("already on current move !");
    }
  }



  render() {
    //console.log(this.state.H[0].squares, "hre");
    let brr = superSlice(this.state.H);

    //render the moves array
    const arr = brr.map((j, i) => {
      let desc = null;
      if(j.squares[8].stateNumber<10){
      desc = "go to move: 0" + j.squares[8].stateNumber;}
      else{
      desc = "go to move: " + j.squares[8].stateNumber;}
      //console.log(j,i, "hreyyyyyy");
      if (i == brr.length - 1
        //&& j.squares[8].stateNumber != 0
      ) {
        desc = "latest move: " + j.squares[8].stateNumber;
        return (
          <li key={i}>
            <button className="current-card button-card" id="current">{desc}
            <img className="fit2" src={mapURL(j.squares[8].lastPieceMoved)}></img></button>
          </li>
        );
      }
      if (j.squares[8].stateNumber == 0) {
        desc = "reset";
        return (
          <li key={i}>
            <button className="button-card" id="reset" onClick={() => this.Reset()}>{desc}</button>
          </li>
        );
      }

      return (
        <li key={i}>
          <button className="button-card" onClick={() => this.jumpTo(i)}>{desc}
          <img className="fit2" src={mapURL(j.squares[8].lastPieceMoved)}></img></button>
        </li>
      );
    });

    //arr.push('4')
    let t = brr[this.state.current].squares[8].turn == 0 ? "whites" : "Blacks";

    let hamburger = 'https://th.bing.com/th/id/R.05c6931e4c4d7d956ed1783747326129?rik=Nx8ITJ647BVK%2bA&riu=http%3a%2f%2fimage.flaticon.com%2ficons%2fpng%2f512%2f52%2f52045.png&ehk=GJDEwltLs8%2bpYAnCuZvycZ76tvjwl2s2J8GVWtdc2ms%3d&risl=&pid=ImgRaw&r=0';
    
    let leftArrow = 'https://pixsector.com/cache/81183b13/avcc910c4ee5888b858fe.png';
    return (
      <div className="game">
        <div className="game-board">

          <Board
            squares={brr[this.state.current].squares}
            onClick={(i, j) => this.handleClick(i, j)}
            value={this.#status}
          />
        </div>
        <div className="card togle inactive" onClick={() => {//to show/hide for small screne
          let j = document.querySelector(".togle");
          //j.classList.toggle("active")
          let imaG = document.querySelector(".iClass");
          let jt = imaG.src;
          if (jt == hamburger) {
            imaG.src = leftArrow;
          } else {
            imaG.src = hamburger;
          }
          let k = document.querySelector(".game-info");
          k.classList.toggle("inactive")
          let k2 = document.querySelector(".github");
          k2.classList.toggle("inactive")
          let k3 = document.querySelector(".github2");
          k3.classList.toggle("inactive");
        }}>
          <img className='iClass' src={hamburger} alt='more'></img>
        </div>
        <div className="game-info inactive">

          <h3 className="card">{"turn of: " + t}</h3>
          <ol id="scrollbull">{arr}</ol>
        </div>
      </div>
    );
  }
}

export default Game;

/////////////////////////////////////////////////////////////////////
//game specific functions
///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//game specific functions
///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//game specific functions
///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//game specific functions
///////////////////////////////////////////////////////////////////////
function mark(trr, squares) {

  for (var j of trr) {
    //console.log(j, 'mark')
    if (!squares[j[0]][j[1]])
      document.querySelector("#t" + j).classList.add("blue-mark");
    else {
      document.querySelector("#t" + j).classList.add("red-mark");
    }
  }
}

function unmark(trr) {
  for (var j of trr) {
    //console.log(j, 'unmark')
    document.querySelector("#t" + j).classList.remove("green-mark");
    document.querySelector("#t" + j).classList.remove("blue-mark");
    document.querySelector("#t" + j).classList.remove("red-mark");
  }
}

function movePieceTo(i, j, tsquares, ib, jb, realMove=true) { //realMove is a boolean that states if move is being made by user, or code to get valid moves, move by code, will pass it's value as false, by default it is true
  let squares = superSlice(tsquares);

  //special pawn moves :
  if (squares[ib][jb][1] == 'p') {
    //if there is en passed n process hapening
    if (ValueOf(j) != ValueOf(jb) && squares[i][j] == null) {
      squares[ib][j] = null;
    }
    //piece promotion
    if(squares[ib][jb][0]=='0'&& ValueOf(i)==7){
      if(realMove) toast(`The Pawn is promoted to the Queen!`);
      squares[ib][jb] = '0q';
    }
    if(squares[ib][jb][0]=='1'&& ValueOf(i)==0){
      if(realMove) toast(`The Pawn is promoted to the Queen!`);
      squares[ib][jb] = '1q';
    }
  }
  //normal piece moving from ib,jb to i,j
  squares[i][j] = squares[ib][jb];
  squares[ib][jb] = null;
  //console.log('*********************************************************',ValueOf(i), ValueOf(ib),ValueOf(i)!=ValueOf(ib));
  return squares;
}


  function isUnderCheck(cking, i, j, squares) {
    let king = null;
    for (let m in squares) {
      for (let n in squares[m]) {
        if (squares[m][n] == cking) {
          king = m + "" + n
        }
      }
    }
    //console.log(king)
    for (let m in squares) {
      if (!Array.isArray(squares[m])) continue;

      for (let n in squares) {

        if (squares[m][n] && getRoughRange(m, n, squares[m][n][1], squares).indexOf(king) != -1) {
          //alert("check!!")
          return true;
        }
        //console.log(m,n)
      }
    }
    return false;
    //TODO
  }

  function getRoughRange(ii, jj, p, squares, previousSQ) {
    let i = ValueOf(ii)
    let j = ValueOf(jj)
    //console.log(i,j,p,squares)
    let arr = [];
    if (p == "p") {
      console.log(previousSQ, 'passing to pawn range')
      arr = pawnRange(i, j, squares, previousSQ);
    } else if (p == "r") {
      arr = rookhRange(i, j, squares);
    } else if (p == "b") {
      arr = bishopRange(i, j, squares);
    } else if (p == "q") {
      arr = rookhRange(i, j, squares).concat(bishopRange(i, j, squares));
    } else if (p == "k") {
      arr = knightRange(i, j, squares);
    } else if (p == "K") {
      arr = kingRange(i, j, squares);
    }

    //console.log(arr)
    return arr;
  }

  function getRange(ii, jj, p, squares, previousSQ) {
    let i = ValueOf(ii)
    let j = ValueOf(jj)
    //console.log(i,j,p,squares)
    let arr = getRoughRange(i, j, p, squares, previousSQ);
    let brr = [];

    //console.log(i,j,typeof i, typeof j)
    let cking = squares[i][j][0] == 0 ? "0K" : "1K"
    for (let ii of arr) {
      let sc = movePieceTo(ii[0], ii[1], squares, i, j, false);
      sc[8].underCheck = false;
      if (!isUnderCheck(cking, i, j, sc)) {
        brr.push(ii)
      }
    }
    return brr;

    //console.log(arr)
    return arr;
  }

  function pawnRange(i, j, squares, previousSQ) {
    //if(isPin(i, j, squares)) return [];
    console.log(previousSQ, 'pawnRange previous square')
    let arr = [];
    if (squares[i][j][0] == 0) {
      //white pawn
      if (i + 1 <= 7 && squares[i + 1][j] == null) {
        arr.push(i + 1 + "" + j);
        if (i == 1) {
          if (squares[i + 2][j] == null) arr.push(i + 2 + "" + j);
        }
      }
      if (squares[i + 1] && squares[i + 1][j + 1] && squares[i + 1][j + 1][0] == 1) arr.push(i + 1 + "" + (j + 1));
      if (squares[i + 1] && squares[i + 1][j - 1] && squares[i + 1][j - 1][0] == 1) arr.push(i + 1 + "" + (j - 1));
      //console.log(arr,'pawnb')

      //for n passed n pawn move
      if (previousSQ && i == 4) {
        console.log(previousSQ, 'n pass n activated!!!!')
        if (squares[4][j + 1] == '1p' && previousSQ[6][j + 1] == '1p' && j < 7) {
          arr.push(5 + "" + (j + 1));
        }
        if (squares[4][j - 1] == '1p' && previousSQ[6][j - 1] == '1p' && j > 0) {
          arr.push(5 + "" + (j - 1));
        }
      }
      return arr;
    } else {
      //black pawn
      if (i - 1 >= 0 && squares[i - 1][j] == null) {
        arr = [i - 1 + "" + j];
        if (i == 6) {
          if (i - 1 >= 0 && squares[i - 1][j] == null) arr.push(i - 2 + "" + j);
        }
      }
      if (squares[i - 1] && squares[i - 1][j + 1] && squares[i - 1][j + 1][0] == 0) arr.push(i - 1 + "" + (j + 1));
      if (squares[i - 1] && squares[i - 1][j - 1] && squares[i - 1][j - 1][0] == 0) arr.push(i - 1 + "" + (j - 1));
      //console.log(arr,'pawn')

      //for n passed n pawn move
      if (previousSQ && i == 3) {
        //console.log(previousSQ, 'black n pass n activated!!!!')
        if (squares[3][j + 1] == '0p' && previousSQ[1][j + 1] == '0p' && j < 7) {
          arr.push(2 + "" + (j + 1));
        }
        if (squares[3][j - 1] == '0p' && previousSQ[1][j - 1] == '0p' && j > 0) {
          arr.push(2 + "" + (j - 1));
        }
      }
      
      return arr;
    }
  }
  function rookhRange(i, j, squares) {
    //if(isPin(i, j, squares)) return [];
    let arr = Vr(i, j, squares);
    return arr;
  }
  function bishopRange(i, j, squares) {
    //if(isPin(i, j, squares)) return [];
    let arr = Cr(i, j, squares);
    return arr;
  }
  function knightRange(i, j, squares) {
    //if(isPin(i, j, squares)) return [];
    //console.log(typeof i, typeof j);
    let arr = [];
    if (
      squares[i + 1] &&
      squares[i + 1][j + 2] !== undefined &&
      (squares[i + 1][j + 2] === null ||
        squares[i + 1][j + 2][0] != squares[i][j][0])
    )
      arr.push(i + 1 + "" + (j + 2));
    if (
      squares[i - 1] &&
      squares[i - 1][j + 2] !== undefined &&
      (squares[i - 1][j + 2] === null ||
        squares[i - 1][j + 2][0] != squares[i][j][0])
    )
      arr.push(i - 1 + "" + (j + 2));
    if (
      squares[i + 1] &&
      squares[i + 1][j - 2] !== undefined &&
      (squares[i + 1][j - 2] === null ||
        squares[i + 1][j - 2][0] != squares[i][j][0])
    )
      arr.push(i + 1 + "" + (j - 2));
    if (
      squares[i - 1] &&
      squares[i - 1][j - 2] !== undefined &&
      (squares[i - 1][j - 2] === null ||
        squares[i - 1][j - 2][0] != squares[i][j][0])
    )
      arr.push(i - 1 + "" + (j - 2));
    if (
      squares[i + 2] &&
      squares[i + 2][j + 1] !== undefined &&
      (squares[i + 2][j + 1] === null ||
        squares[i + 2][j + 1][0] != squares[i][j][0])
    )
      arr.push(i + 2 + "" + (j + 1));
    if (
      squares[i + 2] &&
      squares[i + 2][j - 1] !== undefined &&
      (squares[i + 2][j - 1] === null ||
        squares[i + 2][j - 1][0] != squares[i][j][0])
    )
      arr.push(i + 2 + "" + (j - 1));
    if (
      squares[i - 2] &&
      squares[i - 2][j + 1] !== undefined &&
      (squares[i - 2][j + 1] === null ||
        squares[i - 2][j + 1][0] != squares[i][j][0])
    )
      arr.push(i - 2 + "" + (j + 1));
    if (
      squares[i - 2] &&
      squares[i - 2][j - 1] !== undefined &&
      (squares[i - 2][j - 1] === null ||
        squares[i - 2][j - 1][0] != squares[i][j][0])
    )
      arr.push(i - 2 + "" + (j - 1));
    //console.log(arr);
    return arr;
  }
  function kingRange(i, j, squares) {
    let arr = [];
    for (let c = -1; c < 2; c++) {
      for (let cc = -1; cc < 2; cc++) {
        if (
          squares[i + c] &&
          squares[i + c][j + cc] !== undefined &&
          (squares[i + c][j + cc] === null ||
            squares[i + c][j + cc][0] != squares[i][j][0])
        )
          arr.push(i + c + "" + (j + cc));
      }
    }
    return arr;
  }

  function chessStart(arr) {
    //console.log("Pnullbyte: ",arr);

    arr[1] = ["0p", "0p", "0p", "0p", "0p", "0p", "0p", "0p"];
    arr[6] = ["1p", "1p", "1p", "1p", "1p", "1p", "1p", "1p"];
    arr[0][0] = "0r";
    arr[0][7] = "0r";
    arr[7][0] = "1r";
    arr[7][7] = "1r";
    arr[0][1] = "0k";
    arr[0][6] = "0k";
    arr[7][1] = "1k";
    arr[7][6] = "1k";
    arr[0][2] = "0b";
    arr[0][5] = "0b";
    arr[7][2] = "1b";
    arr[7][5] = "1b";
    arr[0][3] = "0K";
    arr[0][4] = "0q";
    arr[7][3] = "1K";
    arr[7][4] = "1q";

    //console.log("nullbyte: ",arr)
    return arr;
  }

  //actual funcrion for bishop range, used for queens range too
  function Cr(i, j, squares) {
    let arr = []

    for (let c = i - 1, cc = j - 1; c >= 0 && cc >= 0; c--, cc--) {
      if (squares[c][cc] != null) {
        if (squares[c][cc][0] != squares[i][j][0])
          arr.push(c + "" + cc)
        break;
      }
      arr.push(c + "" + cc)
    }
    for (let c = i + 1, cc = j + 1; (c <= 7 && cc <= 7); c++, cc++) {
      if (squares[c][cc] != null) {
        if (squares[c][cc][0] != squares[i][j][0])
          arr.push(c + "" + cc)
        break;
      }
      arr.push(c + "" + cc)
    }
    for (let cc = j - 1, c = i + 1; cc >= 0 && c <= 7; cc--, c++) {
      if (squares[c][cc] != null) {
        if (squares[c][cc][0] != squares[i][j][0])
          arr.push(c + "" + cc)
        break;
      }
      arr.push(c + "" + cc)
    }
    for (let cc = j + 1, c = i - 1; cc <= 7 && c >= 0; cc++, c--) {
      if (squares[c][cc] != null) {
        if (squares[c][cc][0] != squares[i][j][0])
          arr.push(c + "" + cc)
        break;
      }
      arr.push(c + "" + cc)
    }


    return arr
  }
  //actual function for rook range, used for queens range too
  function Vr(i, j, squares) {
    let arr = []

    for (let c = i - 1; c >= 0; c--) {
      if (squares[c][j] != null) {
        if (squares[c][j][0] != squares[i][j][0])
          arr.push(c + "" + j)
        break;
      }
      arr.push(c + "" + j)
    }
    for (let c = i + 1; c <= 7; c++) {
      if (squares[c][j] != null) {
        if (squares[c][j][0] != squares[i][j][0])
          arr.push(c + "" + j)
        break;
      }
      arr.push(c + "" + j)
    }
    for (let c = j - 1; c >= 0; c--) {
      if (squares[i][c] != null) {
        if (squares[i][c][0] != squares[i][j][0])
          arr.push(i + "" + c)
        break;
      }
      arr.push(i + "" + c)
    }
    for (let c = j + 1; c <= 7; c++) {
      if (squares[i][c] != null) {
        if (squares[i][c][0] != squares[i][j][0])
          arr.push(i + "" + c)
        break;
      }
      arr.push(i + "" + c)
    }


    return arr
  }
  //get the pieces images from chess.com
  function mapURL(str) {
    switch (str) {
      case "0p": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png";//break;
      case "1p": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png";//break;
      case "0K": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png";//break;
      case "0q": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png";//break;
      case "0b": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png";//break;
      case "0k": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png";//break;
      case "0r": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png";//break;
      case "1K": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png";//break;
      case "1q": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png";//break;
      case "1b": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png";//break;
      case "1k": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png";//break;
      case "1r": return "https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png";//break;
      default: return null;
    }
  }

  /*////////////////////////  js utility functions//////////////////////// */
  /*////////////////////////  js utility functions//////////////////////// */
  /*////////////////////////  js utility functions//////////////////////// */
  /*////////////////////////  js utility functions//////////////////////// */
  /*////////////////////////  js utility functions//////////////////////// */


  //to make actual copy of some object.
  function superSlice(arr) {
    //this is only for 2d, to make recursive one
    const brr = JSON.parse(JSON.stringify(arr));
    return brr;
  }
  //simple string to int converter
  function ValueOf(i) {
    if (i == 0) return 0;
    if (i == 1) return 1;
    if (i == 2) return 2;
    if (i == 3) return 3;
    if (i == 4) return 4;
    if (i == 5) return 5;
    if (i == 6) return 6;
    if (i == 7) return 7;
    return null;
  }
  //recursively checks iff 2 objects are actually equal
  function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
  }

  function isObject(object) {
    return object != null && typeof object === 'object';
  }
  //depricated
  function Wi() {
    return false;
  }




  let w = window.innerWidth;
  if (w > 630 && w < 780) {
    window.alert("game supported for standard mobile/desktop view, for current device being used, game is under construction");
  }if(w<=630){
    window.alert("this site uses some advance UI properties, so it may produce lag on small screens, please switch to desktop for best experience. or, move to alternate site: https://chess-up.netlify.app/")
  }


/*
the localstorage is used to store the game state,so that reload dosnt make it lost.

when we store object in local storage, we have to see, that the format of object being stored has to be the same in which it will be fetched from there,
otherwise the object being fetched being different, will produce following error:

Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.


*/