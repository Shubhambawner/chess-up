import { toast } from 'react-toastify';


import s0p from "./components/download/0p.svg"
import s0K from "./components/download/0kg.svg"
import s0q from "./components/download/0q.svg"
import s0b from "./components/download/0b.svg"
import s0k from "./components/download/0k.svg"
import s0r from "./components/download/0r.svg"

import s1p from "./components/download/1p.svg"
import s1K from "./components/download/1kg.svg"
import s1q from "./components/download/1q.svg"
import s1b from "./components/download/1b.svg"
import s1k from "./components/download/1k.svg"
import s1r from "./components/download/1r.svg"

const pieceURL = {
    "0p": s0p,
    "1p": s1p,
    "0K": s0K,
    "0q": s0q,
    "0b": s0b,
    "0k": s0k,
    "0r": s0r,
    "1K": s1K,
    "1q": s1q,
    "1b": s1b,
    "1k": s1k,
    "1r": s1r
}



function movePieceTo(i, j, tsquares, ib, jb, realMove = true) { //realMove is a boolean that states if move is being made by user, or code to get valid moves, move by code, will pass it's value as false, by default it is true
    let squares =JSON.parse( JSON.stringify(tsquares));

    //special pawn moves :
    if (squares[ib][jb][1] == 'p') {
        //if there is en passed n process hapening
        if (ValueOf(j) != ValueOf(jb) && squares[i][j] == null) {
            squares[ib][j] = null;
        }
        //piece promotion
        if (squares[ib][jb][0] == '0' && ValueOf(i) == 7) {
            if (realMove) toast(`The Pawn is promoted to the Queen!`);
            squares[ib][jb] = '0q';
        }
        if (squares[ib][jb][0] == '1' && ValueOf(i) == 0) {
            if (realMove) toast(`The Pawn is promoted to the Queen!`);
            squares[ib][jb] = '1q';
        }
    }
    //normal piece moving from ib,jb to i,j
    squares[i][j] = squares[ib][jb];
    squares[ib][jb] = null;
   // console.log('*********************6666666666666***********************', ValueOf(i), ValueOf(ib), ValueOf(i) != ValueOf(ib));
    return squares;
}


function isUnderCheck(cking, i, j, squares, toLog) {
    let king = null;
    for (let m in squares) {
        if(Array.isArray(squares[m]))
        for (let n in squares[m]) {
            if (squares[m][n] == cking) {
                king = m + "" + n
            }
        }
    }
    if(toLog) console.log(king, cking, i, j, squares, toLog);
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

//range without considering piece pinn or check
function getRoughRange(ii, jj, p, squares, previousSQ) {
    let i = ValueOf(ii)
    let j = ValueOf(jj)
    //console.log(i,j,p,squares)
    let arr = [];
    if (p == "p") {
       // console.log(previousSQ, 'passing to pawn range')
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
   // console.log(brr, ';;;;;;;;;;;;;;;;;;')
    return brr;


}

function pawnRange(i, j, squares, previousSQ) {
    //if(isPin(i, j, squares)) return [];
   // console.log(previousSQ, 'pawnRange previous square')
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
           // console.log(previousSQ, 'n pass n activated!!!!')
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

function canKingMove(squares, playerChar){
    let abr = false;
    for (let m in squares) {
        if (!Array.isArray(squares[m])) continue
        for (let n in squares[m]) {
            if (squares[m][n] && squares[m][n][0] == playerChar) {
                let rt = getRange(m, n, squares[m][n][1], squares);
                if (rt.length > 0) {
                    abr = true
                    break;
                }
            }
        }
    }
    return abr;
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
    return pieceURL[str];
}
//simple string to int converter
function ValueOf(i) {
    return parseInt(i)
}
//recursively checks iff 2 objects are actually equal


export {mapURL,chessStart,getRange,isUnderCheck,movePieceTo,canKingMove}