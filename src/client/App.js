import React, { useState, useReducer, useEffect } from "react";
import { useSocket } from "./hooks.js";
import reducer from "./reducer.js";
import * as actions from "./actions";
import announcement from "./announcement.js";
import Login from "./components/Login.js";
import Lobby from "./components/Lobby.js";
import Game from "./components/Game.js";

const App = () => {
    const socket = useSocket();
    const [state, dispatch] = useReducer(reducer, null);
    const [messages, setMessages] = useState([]);

    const on = (action) => (...args) => {
        const payload = action(...args);
        console.log(payload);

        const message = announcement(state, payload);
        if (message) {
            setMessages([message, ...messages]);
        }

        dispatch(payload);
    };

    useEffect(() => {
        if (state) {
            socket.on("enter", on(actions.addPlayer));
            socket.on("leave", on(actions.removePlayer));
            socket.on("turn", on(actions.startTurn));
            socket.on("auction", on(actions.startAuction));
            socket.on("reauction", on(actions.restartAuction));
            socket.on("offer", on(actions.startOffer));
            socket.on("bid", on(actions.auctionBid));
            socket.on("stop", on(actions.auctionEnd));
            socket.on("sell", on(actions.sellAnimal));
            socket.on("earn", on(actions.earnCapital));
            socket.on("pay", on(actions.loseCapital));
            socket.on("end", on(actions.endGame));
            return () => socket.off();
        }
    });

    let content;
    if (!state) {
        content = <Login onLogin={on(actions.login)}/>;
    } else if (!state.status) {
        content = <Lobby players={state.players} roomId={state.roomId} selfId={state.selfId}/>;
    } else {
        content = <Game state={state} messages={messages}/>;
    }

    return (
        <div className="c">
            <h1>Stonks</h1>
            {content}
        </div>
    );
};

export default App;
