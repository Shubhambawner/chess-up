import React from "react";

export class GameErrorboundry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log(error);
        this.setState({ hasError: true });
    }

    render() {
        if (this.state.hasError) {
            localStorage.removeItem('chess');
            alert(`Something went wrong in the Game. \nWe will have to reset the game 😢😒`);
            window.location.reload();
            return this.props.children ;
        }
        return this.props.children;
    }
}