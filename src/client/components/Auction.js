import React, { useEffect, useState } from "react";
import { useSocket } from "../hooks.js";
import { stopBid } from "../actions.js";
import rules from "../../common/rules.json";
import { MAKE_BID, STOP_BID } from "../../common/signals.js";

export default function Auction({ players, status, selfId, dispatch }) {
    const socket = useSocket();
    const [input, setInput] = useState("");
    const [timer, setTimer] = useState(null);

    const { playerId, bidderId, animalId, amount, bidding, timeout } = status;
    const player = players[playerId];
    const bidder = players[bidderId];
    const animal = rules.animals[animalId];

    function handleBid(event) {
        event.preventDefault(); // don't refresh the page

        // The parseInt function returns NaN when it gets an incorrect number
        // In this case, (NaN > highestBid) always returns false, so we'll be safe
        const bid = parseInt(input);
        if (bid > amount) {
            socket.emit(MAKE_BID, bid);
        }

        setInput("");
    }

    function handleStop() {
        socket.emit(STOP_BID);
        dispatch(stopBid()); // TODO: put dispatch in a context
    }

    useEffect(() => {
        setTimer(null);
        const remaining = timeout - Date.now();

        const ids = [];
        for (let i = 1; i <= 5; i++) {
            ids.push(setTimeout(() => {
                setTimer(i);
            }, remaining - i * 1000));
        }

        return () => ids.forEach(clearTimeout);
    }, [timeout]);

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
                }. {timer &&
                    <b>{timer} seconds left!</b>
                }
            </p>

            {selfId !== playerId &&
                <form onSubmit={handleBid} >
                    <input
                        value={input}
                        onChange={event => setInput(event.target.value)}
                        placeholder={Math.floor(amount / 10 + 1) * 10}
                    />
                    <button type="submit">Make a bid</button>
                    <button type="button" disabled={!bidding || selfId === bidderId} onClick={handleStop}>Stop</button>
                </form>
            }
        </div>
    );
}
