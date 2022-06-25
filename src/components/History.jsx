import React from "react";
import {mapURL} from '../util'
import hamburger from '../img/R.png';
import leftArrow from '../img/T.png';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    shouldComponentUpdate(nextProps) {
        // Rendering the component only if
        // passed props value is changed
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
            return true;
        } else {
            return false;
        }
    }
    render(){
        return(
            <li key={this.props.listData.id+Date.now()}>
                        <button className="current-card button-card" id="current">{this.props.listData.desc}
                            <img className="fit2" src={mapURL(this.props.listData.piece)}></img></button>
                    </li>
        )
    }
}
class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        }
    }

    shouldComponentUpdate(props,state){
        console.log(JSON.stringify(this.props.gameData)!=JSON.stringify(props.gameData))
        return JSON.stringify(this.props.gameData)!=JSON.stringify(props.gameData) || state.isVisible!=this.state.isVisible
    }

    getIframe = () => {
        window.alert("copy this code to use in your website! :\n <iframe src=\"https://chess-up.netlify.app/\"></iframe>")
      };
    render() {

        const arr = this.props.gameData.History.map((j, i) => {
            let desc = null;
            if (j.squares[8].stateNumber < 10) {
                desc = "go to move: 0" + j.squares[8].stateNumber;
            }
            else {
                desc = "go to move: " + j.squares[8].stateNumber;
            }
            //console.log(j,i, "hreyyyyyy");
            if (i == this.props.gameData.History.length - 1 ) {
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
                        <button className="button-card" id="reset" onClick={() => this.props.methods.Reset()}>{desc}</button>
                    </li>
                );
            }

            let listData={
                desc:desc,
                piece:j.squares[8].lastPieceMoved,
                id:i
            }

            return (
                
                <ListItem key={listData.id} listData={listData}/>
            );
        });

        return (
            <React.Fragment>
                <div className="card togle inactive" onClick={()=>{this.setState({isVisible:!this.state.isVisible});console.log('22222')}}>
                    <img className='iClass' src={this.state.isVisible?leftArrow:hamburger} alt='more'></img>
                </div>
                <div className={this.state.isVisible?"game-info":"game-info inactive"} style={{zIndex:2}}>

                    <h3 className="card">{"turn of: " + this.props.gameData.currentPlayer}</h3>
                    <ol id="scrollbull">{arr}</ol>
                </div>
                
                <div style={{zIndex:3}} className={this.state.isVisible?"github inactive":"github"} >
                    <a style={{width: "100%",height: "100%"}} href="https://github.com/Shubhambawner/learner/tree/main/Dev/REACT/Chess-up">
                        <img style={{width: "95%",height: "95%"}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Github-desktop-logo-symbol.svg/128px-Github-desktop-logo-symbol.svg.png" alt="" ></img>
                    </a>
                </div>

                <div style={{zIndex:3}}  className={this.state.isVisible?"github2 inactive":"github2"}  >
                    <div style={{width: `100%`,height: `100%`,    display: `flex`,
    justifyContent: 'center',
    alignItems: 'center'}} onClick={()=>getIframe()}>
                        <img style={{height: "65%",
      width: "65%",
      position: "relative",
      top: "0.8vh"}} src="https://cdn3.iconfinder.com/data/icons/ecommerce-mix/1024/program-512.png" alt="" ></img>
                    </div>
                </div>
    
            </React.Fragment>
        )
    }
}

export default History;