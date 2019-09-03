import React from "react";
import { useSocket } from "../hooks.js";
import Capital from "./Capital.js";
import animals from "../../common/animals.json";
import { MAKE_COUNTEROFFER, MAKE_OFFER } from "../../common/signals.js";

export default function Offer({ players, capital, status, selfId }) {
    const socket = useSocket();

    const { playerId, targetId, animalId, count, offer } = status;
    const player = players[playerId];
    const target = players[targetId];
    const animal = animals[animalId];

    const what = count === 1
        ? `a ${animal.name}`
        : `two ${animal.namePlural}`;

    const who = selfId === targetId
        ? "you"
        : <b>{target.name}</b>;

    if (selfId === playerId) {
        return (
            <div>
                <p>
                    You {offer === null
                        ? "want"
                        : `made a ${offer.reduce((a, b) => a + b, 0)}$ offer`
                    } to buy {what} from {who}.
                </p>

                {!offer &&
                    <Capital capital={capital} offer onSelected={list => socket.emit(MAKE_OFFER, list)} />
                }
            </div>
        );
    }

    if (offer === null) {
        return (
            <div>
                <p>
                    <b>{player.name}</b> wants to buy {what} from {who}.
                </p>
            </div>
        );
    }

    return (
        <div>
            <p>
                <b>{player.name}</b> made an offer to buy {what} from {who} (change: {offer}).
            </p>

            {selfId === targetId &&
                <Capital capital={capital} offer onSelected={list => socket.emit(MAKE_COUNTEROFFER, list)} />
            }
        </div>
    );
}
