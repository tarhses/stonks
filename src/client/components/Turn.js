import React, { useState } from "react";
import { useSocket } from "../hooks.js";
import Capital from "./Capital.js";
import animalTypes from "../../common/animals.json";
import { START_AUCTION, START_OFFER } from "../../common/signals.js";

export default function Turn({ players, capital, animals, status, selfId }) {
    const socket = useSocket();
    const [offer, setOffer] = useState(null);

    const { playerId } = status;
    const player = players[playerId];
    const animalCount = animals.reduce((a, b) => a + b, 0);

    if (!offer) {
        if (selfId === playerId) {
            const choices = [];

            if (animalCount > 0) {
                choices.push(<button onClick={() => socket.emit(START_AUCTION)}>Sell an animal</button>);
            }

            for (const [targetId, target] of players.entries()) {
                if (targetId !== selfId) {

                    for (const [animalId, targetCount] of target.animals.entries()) {
                        const selfCount = player.animals[animalId];
                        const animal = animalTypes[animalId];

                        if (selfCount >= 1 && targetCount >= 1) {
                            let count;
                            if (selfCount === 2 && targetCount === 2) {
                                count = 2;
                            } else {
                                count = 1;
                            }

                            choices.push(<button onClick={() => setOffer({targetId, animalId, count})}>
                                Buy {count === 1 ? `a ${animal.name}` : `two ${animal.namePlural}`} from <b>{target.name}</b>
                            </button>);
                        }
                    }
                }
            }

            return (
                <div>
                    <p>
                        It&apos;s your turn, what will you do?
                        There&apos;s {animalCount} animal{animalCount !== 1 && "s"} left to sell.
                    </p>
                    <ul>
                        {choices.map((choice, id) =>
                            <li key={id}>{choice}</li>
                        )}
                    </ul>
                </div>
            );
        }
    }

    else {
        const target = players[offer.targetId];
        const animal = animalTypes[offer.animalId];
        return (
            <div>
                <p>You&apos;re going to buy {offer.count === 1 ? `a ${animal.name}` : `two ${animal.namePlural}`} from <b>{target.name}</b>.</p>
                <Capital capital={capital} offer onSelected={list => socket.emit(START_OFFER, offer.targetId, offer.animalId, list)} />
                <button onClick={() => setOffer(null)}>Cancel</button>
            </div>
        );
    }

    return (
        <div>
            <p>It&apos;s <b>{player.name}</b>&apos;s turn.</p>
        </div>
    );
}
