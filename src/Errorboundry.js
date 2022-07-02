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
        console.error(error);
    }

    render() {
        if (this.state.hasError) {
            localStorage.removeItem('chess');
            alert(`Something went wrong. We will have to reset the game 😢😒`)
            return this.props.children ;
        }
        return this.props.children;
    }
}