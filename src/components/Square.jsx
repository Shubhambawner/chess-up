import React from 'react';
import { memo } from "react";

import util from '../util';

class Square extends React.Component {
    //console.log(props.value)
    #x = this.props.value[1];
    #y = this.props.value[2];
    #color = (this.#x + this.#y) % 2 == 0 ? "whiteSquare" : "blackSquare";

    shouldComponentUpdate(nextProps) {
        // Rendering the component only if 
        // passed props value is changed
      
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
          return true;
        } else {
          return false;
        }
      }
  
  
    render() {
      let p = this.#x + "" + this.#y
      if (p == "00") this.#color += " c00"
      if (p == "07") this.#color += " c07"
      if (p == "70") this.#color += " c70"
      if (p == "77") this.#color += " c77"
  
      return (
        <button
          id={"t" + this.#x + "" + this.#y}
          className={this.#color}
          onClick={() => this.props.onClick()}
        ><img className="fit" src={util.mapURL(this.props.value[0])} />
          {this.props.value[0]}
        </button>
      );
    }
  }

//   const MemSquare = memo(Square)
// export default MemSquare;  
export default Square;  