import { h, Fragment } from "preact";
import { useSocket } from "../hooks.js";
import { SELL_ANIMAL } from "../../common/signals.js";
import rules from "../../common/rules.json";

export default function AuctionEnd({ players, capital, status, selfId }) {
    const socket = useSocket();

    const { playerId, bidderId, animalId, amount } = status;
    const player = players[playerId];
    const bidder = players[bidderId];
    const animal = rules.animals[animalId];
    const sum = capital.reduce((a, b) => a + b, 0);

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
                    <button onClick={() => socket.emit(SELL_ANIMAL, false)}>
                        Sell the {animal.name} to <b>{bidder.name}</b>
                    </button>
                    <button onClick={() => socket.emit(SELL_ANIMAL, true)} disabled={sum < amount}>
                        Buy the {animal.name} back
                    </button>
                </div>
            }
        </div>
    );
}
