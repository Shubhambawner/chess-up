import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mapURL } from '../util';




class Square extends React.Component {
    
    Data = this.props.Data
    #x = this.props.value[1];
    #y = this.props.value[2];

    shouldComponentUpdate(nextProps) {
        // Rendering the component only if 
        // passed props value is changed

        let m = JSON.parse(JSON.stringify(nextProps));

        m.lastActivePiece = this.props.Data.lastActivePiece;

        if (JSON.stringify(m) !== JSON.stringify(this.props)) {
           console.log("rendering square: ", this.#x + "" + this.#y, JSON.stringify(m), JSON.stringify(this.props))

            return true;
        } else {
            return false;
        }
    }

    handleClick = () => {
        if (this.props.marked) {
            this.props.Data.createMove(this.#x ,this.#y, this.props.Data.lastActivePiece)
        }else if(this.props.value[0][0]==this.props.Data.lastActivePiece[1].turn){
            this.props.Data.markPieces(this.#x+"", this.#y+"")
        }else{
            toast("wrong turn");
        }
    }



    render() {
        let color = (this.#x + this.#y) % 2 == 0 ? "whiteSquare " : "blackSquare ";

        let p = this.#x + "" + this.#y
        if (p == "00") color += " c00 "
        if (p == "07") color += " c07 "
        if (p == "70") color += " c70 "
        if (p == "77") color += " c77 "
        color += this.props.marked ? (this.props.value[0] ? " red-mark" : " blue-mark") : ""


        return (
            <button
                id={"t" + this.#x + "" + this.#y}
                className={color}
                onClick={this.handleClick.bind(this)}
            ><img className="fit" src={mapURL(this.props.value[0])} />
                {this.props.value[0]}
            </button>
        );
    }
}

//   const MemSquare = memo(Square)
// export default MemSquare;  
export default Square;  