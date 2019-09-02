import React, { useState } from "react";
import { useSocket } from "../hooks.js";
import animals from "../../common/animals.json";
import { MAKE_BID, STOP_BID } from "../../common/signals.js";

export default function Auction({ players, status, selfId }) {
    const socket = useSocket();
    const [input, setInput] = useState("");

    const { playerId, bidderId, animalId, amount } = status;
    const player = players[playerId];
    const bidder = players[bidderId];
    const animal = animals[animalId];

    function handleSubmit(event) {
        event.preventDefault(); // don't refresh the page

        // The parseInt function returns NaN when it gets an incorrect number
        // In this case, (NaN > highestBid) always returns false, so we'll be safe
        const bid = parseInt(input);
        if (bid > amount) {
            socket.emit(MAKE_BID, bid);
        }

        setInput("");
    }

    return (
        <div>
            <p>
                {selfId === playerId
                    ? "You are"
                    : <><b>{player.name} </b> is</>
                } selling a {animal.name} ({animal.score} points).
            </p>

            <p>
                Current highest bid : {amount}$ by {selfId === bidderId
                    ? "you"
                    : <b>{bidder.name}</b>
                }.
            </p>

            {selfId !== playerId &&
                <form onSubmit={handleSubmit} >
                    <input
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        placeholder={Math.floor(amount / 10 + 1) * 10}
                    />
                    <button type="submit">Make a bid</button>
                    <button type="button" onClick={() => socket.emit(STOP_BID)}>Stop</button>
                </form>
            }
        </div>
    );
}
