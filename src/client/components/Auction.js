import React, { useState } from "react";
import { useSocket } from "../hooks.js";
import animals from "../../animals.json";

const Auction = ({ players, status, selfId }) => {
    const socket = useSocket();
    const [input, setInput] = useState("");

    const { playerId, bidderId, animalId, amount } = status;
    const player = players[playerId];
    const bidder = players[bidderId];
    const animal = animals[animalId];

    const handleSubmit = e => {
        e.preventDefault(); // don't refresh the page

        if (input.trim().toLowerCase() === "stop") {
            socket.emit("stop");
        } else {
            // The parseInt function returns NaN when it gets an incorrect number
            // In this case, (NaN > highestBid) always returns false, so we'll be safe
            const bid = parseInt(input);
            if (bid > amount) {
                socket.emit("bid", bid);
            }
        }

        setInput("");
    };

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
                        onChange={e => setInput(e.target.value)}
                        placeholder={Math.floor(amount / 10 + 1) * 10}
                    />
                    <button>Make a bid</button>
                    <small> Type in &quot;stop&quot; to withdraw from the auction.</small>
                </form>
            }
        </div>
    );
};

export default Auction;
