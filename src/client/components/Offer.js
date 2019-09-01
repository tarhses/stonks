import React from "react";
import { useSocket } from "../hooks.js";
import Capital from "./Capital.js";
import animals from "../../animals.json";

const Offer = ({ players, capital, status, selfId }) => {
    const socket = useSocket();

    const { playerId, targetId, animalId, change } = status;
    const player = players[playerId];
    const target = players[targetId];
    const animal = animals[animalId];

    const selfCount = player.animals[animalId];
    const targetCount = target.animals[animalId];

    let count;
    if (selfCount === 2 && targetCount === 2) {
        count = 2;
    } else {
        count = 1;
    }

    const what = count === 1 ? `a ${animal.name}` : `two ${animal.namePlural}`;

    if (selfId === targetId) {
        return (
            <div>
                <p><b>{player.name}</b> made an offer to buy {what} from you (change: {change}).</p>
                <Capital capital={capital} offer onSelected={list => socket.emit("counter", list)} />
            </div>
        );
    }

    return (
        <div>
            <p><b>{player.name}</b> made an offer to <b>{target.name}</b> to buy {what} (change: {change}).</p>
        </div>
    );
};

export default Offer;
