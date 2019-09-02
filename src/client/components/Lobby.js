import React from "react";
import { useSocket } from "../hooks.js";
import RoomInformation from "./RoomInformation.js";
import { START_TURN } from "../../common/signals.js";

export default function Lobby({ players, roomId, selfId }) {
    const socket = useSocket();

    const remaining = 3 - players.length;

    return (
        <div>
            <RoomInformation name={players[selfId].name} id={roomId} />
            <div className="card">
                {remaining > 0
                    ? <p>Waiting for {remaining} more player{remaining > 1 && "s"}.</p>
                    : <p>Ready to start!</p>
                }

                <ul>
                    {players.map((player, id) =>
                        <li key={id}><b>{player.name}</b> {id === selfId && <i>(you)</i>}</li>
                    )}
                </ul>
            </div>

            <hr/>
            <button
                className="btn primary w-100"
                onClick={() => socket.emit(START_TURN)}
                disabled={remaining > 0}
            >
                Start
            </button>
        </div>
    );
}
