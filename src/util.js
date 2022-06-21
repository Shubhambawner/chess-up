let util = {}


//get the pieces images from chess.com
util.mapURL = function(str) {
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
util.superSlice = function(arr) {
  //this is only for 2d, to make recursive one
  const brr = JSON.parse(JSON.stringify(arr));
  return brr;
}
//simple string to int converter
util.ValueOf = function(i) {
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
util.deepEqual = function(object1, object2) {
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

util.isObject = function(object) {
  return object != null && typeof object === 'object';
}

export default util;