import React from "react";
import { useSocket } from "../hooks.js";
import animals from "../../common/animals.json";

const AuctionEnd = ({ players, capital, status, selfId }) => {
    const socket = useSocket();

    const { playerId, bidderId, animalId, amount } = status;
    const player = players[playerId];
    const bidder = players[bidderId];
    const animal = animals[animalId];
    const money = capital.reduce((sum, value) => sum + value, 0);

    return (
        <div>
            <p>
                {selfId === bidderId
                    ? "You"
                    : <b>{bidder.name}</b>
                } won {selfId === playerId
                    ? "your"
                    : <><b>{player.name}</b>&apos;s</>
                } auction : a {animal.name} ({animal.score} points) for {amount}$.
            </p>

            {selfId === playerId &&
                <div>
                    <button onClick={() => socket.emit("deal")}>
                        Sell the {animal.name} to <b>{bidder.name}</b>
                    </button>
                    <button onClick={() => socket.emit("buyback")} disabled={money < amount}>
                        Buy the {animal.name} back
                    </button>
                </div>
            }
        </div>
    );
};

export default AuctionEnd;
