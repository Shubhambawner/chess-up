import ReactDOM from 'react-dom';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { mapURL, chessStart, getRange, isUnderCheck, movePieceTo, canKingMove } from '../util'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
    autoClose: 1000,
    draggable: false,
    pauseOnHover: true,
    closeButton: false,
    progressBar: false,
    newestOnTop: false,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnVisibilityChange: false,
});

import Board from './Board';
import History from './History';

//controlled components


//controlling component
class Game extends React.Component {
    constructor(props) {
        super(props);
        let hrr = new Array(8).fill(null).map(x => Array(8).fill(null))
        hrr.push({ turn: "0", stateNumber: 0, underCheck: null, lastPieceMoved: null });
        //creating the multi dimentional array,
        //this:
        //wont work, as fill just asigns references, so array of nulls is actually created only once.
        //console.log('hrr',hrr)
        let loc = localStorage.getItem("chess");
        if (loc) {
            this.state = JSON.parse(loc);

        } else {
            //console.log('state no localstorage')
            let erra = chessStart(hrr);
            this.state = {
                H: [{ squares: erra }],
                marked: [],
                current: 0, //this is a serial number of the state
                previous: -1,//state of game for n pas n, the previous 
                winner: null
            };
            localStorage.setItem('chess', JSON.stringify(this.state));//localstorage integration
        }
        // console.log('state',this.state)
    }

    mark(arr) {
        let s2 = JSON.parse(JSON.stringify(this.state)); s2.marked = arr;
        // console.log("setting state:", s2, this.state);
        this.setState(s2)
    }

    #piece = null;
    #range = [];

    Reset() {
        let hrr = new Array(8).fill(null).map(x => Array(8).fill(null))
        hrr.push({ turn: "0", stateNumber: 0, underCheck: null, lastPieceMoved: null });
        let state = {
            H: [{ squares: chessStart(hrr) }],
            current: 0,
            previous: -1
        }
        localStorage.setItem('chess', JSON.stringify(state));//localstorage integration
        this.setState(state);

        this.#piece = null;
        this.range = [];
    }

    //jump back/forth to some stage of the game
    jumpTo(i) {
        //console.log(i,i%2)

        const squares = JSON.parse(JSON.stringify((this.state.H[i].squares)));
        if (JSON.stringify(this.state.H[this.state.current].squares) != JSON.stringify(squares)) {
            if (i % 2 != 0) {
            } else {
            }
            //console.log(this.state.H[this.state.current].squares == squares);
            let H2 = JSON.parse(JSON.stringify(this.state.H));
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

    markPieces(i, j) {
        let squares = JSON.parse(JSON.stringify(this.state.H[this.state.current].squares));
        let previousSQ = null;
        if (this.state.current > 0) {
            previousSQ = JSON.parse(JSON.stringify(this.state.H[this.state.current - 1].squares));
            // console.log(previousSQ, 'passing inn', squares)
        }

        this.#piece = i + "" + j;
        this.#range = getRange(i, j, squares[i][j][1], squares, previousSQ); //return array of co-ordinates that are under attack by piece at i,j
        this.mark(this.#range); // marks green/red all squares under attack, get element by id, and update class list
    }

    createMove(i, j) {
        let squares = JSON.parse(JSON.stringify(this.state.H[this.state.current].squares));
        let abr = false;
        let previousSQ = null;
        if (this.state.current > 0) {
            previousSQ = JSON.parse(JSON.stringify(this.state.H[this.state.current - 1].squares));
            // console.log(previousSQ, 'passing inn', squares)
        }


        //    console.log(i, '************[[[[[[[[[[[[[[[[*********');
        let vrr = this.state.H;

        squares = movePieceTo(i, j, squares, this.#piece[0], this.#piece[1]); // update array squares to bring piece from this.#piece to i,j, also killing any piece if there on i,j
        squares[8].stateNumber++;
        let oponentKing = squares[8].turn == 0 ? "1K" : "0K";
        let king = squares[8].turn == 0 ? "0K" : "1K";

        if (isUnderCheck(king, i, j, squares)) {
            toast("the piece is pin! "); //handled in getRange!!!
        } else {
            if (squares[8].turn != "0") squares[8].turn = "0";
            else squares[8].turn = "1";

            squares[8].underCheck = isUnderCheck(oponentKing, i, j, squares, true);

            let winner = null;
            if (squares[8].underCheck) {
                toast((squares[8].turn == 0 ? "white " : "black ") + "under check!")
                if (!canKingMove(squares, oponentKing[0]) && squares[8].underCheck) {
                    winner = squares[8].turn != 1 ? "Black" : "White"
                    //   let winner = (kking == "0K") ? "White" : "Black"
                    toast("game over, winner is " + winner)
                }
            }
            squares[8].lastPieceMoved = squares[i][j]
            squares[8].winner = winner
            vrr.push({ squares: squares });
            let state3 = { H: vrr, current: this.state.current + 1, previous: this.state.previous + 1, marked: [] };
            //console.log(this.state.previous + 1, 'settng as previous')
            localStorage.setItem('chess', JSON.stringify(state3));//localstorage integration
            this.setState(state3);
            // console.log(state3, '******************************')


            this.#piece = null;
            this.#range = [];
        }

        //??
        let fg = document.getElementById("current");
        if (fg) {
            fg.scrollIntoView({ behavior: "smooth" });
            //console.log(fg,'scrolling....')
        } else {
            //console.log(fg,'scrolling....')/** $$ here we see, setstate itself re-renders the element!!!!!! */
        }


    }

    render() {
        //console.log(this.state.H[0].squares, "hre");

        //render the moves array


        //arr.push('4')
        let brr = JSON.parse(JSON.stringify(this.state.H));
        let t = brr[this.state.current].squares[8].turn == 0 ? "whites" : "Blacks";

        const Data = {
            lastActivePiece: [this.#piece, this.state.H[this.state.current].squares[8]],
            markPieces: this.markPieces.bind(this),
            createMove: this.createMove.bind(this)
        }

        let gameData = {
            History: JSON.parse(JSON.stringify(this.state.H)),
            currentPlayer: t,
            winner: this.state.winner
        }

        return (
            <div className="game">
                
                    <div className="game-board">
                        <Board
                            squares={brr[this.state.current].squares}
                            marked={this.state.marked}
                            Data={Data}
                        />
                    </div>
                    <History gameData={gameData} methods={{ jumpTo: this.jumpTo.bind(this), Reset: this.Reset.bind(this) }} />
            </div>
        );
    }
}

export default Game;


/*
the localstorage is used to store the game state,so that reload dosnt make it lost.

when we store object in local storage, we have to see, that the format of object being stored has to be the same in which it will be fetched from there,
otherwise the object being fetched being different, will produce following error:

Error: A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.


*/